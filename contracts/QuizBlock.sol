// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title QuizBlock - Advanced Web3 Quiz Platform
 * @dev A cutting-edge smart contract for decentralized quiz competitions
 * Features: NFT rewards, token staking, live events, reputation system
 */
contract QuizBlock is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // ============ STATE VARIABLES ============
    
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _quizIdCounter;
    Counters.Counter private _eventIdCounter;
    
    // Token for rewards and staking
    IERC20 public immutable rewardToken;
    
    // Quiz and Event structures
    struct Quiz {
        uint256 id;
        string title;
        string category;
        string[] questions;
        string[] correctAnswers;
        uint256 timeLimit; // in seconds
        uint256 entryFee;
        uint256 rewardPool;
        bool isActive;
        address creator;
        uint256 createdAt;
    }
    
    struct LiveEvent {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 maxParticipants;
        uint256 entryFee;
        uint256 totalPrizePool;
        bool isActive;
        address[] participants;
        mapping(address => uint256) scores;
        mapping(address => bool) hasParticipated;
    }
    
    struct UserProfile {
        uint256 totalQuizzes;
        uint256 correctAnswers;
        uint256 reputation;
        uint256 tokensEarned;
        uint256 nftsEarned;
        bool isRegistered;
    }
    
    // Mappings
    mapping(uint256 => Quiz) public quizzes;
    mapping(uint256 => LiveEvent) public liveEvents;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => mapping(uint256 => bool)) public hasAnsweredQuiz;
    mapping(address => mapping(uint256 => uint256)) public userScores;
    mapping(uint256 => address[]) public quizParticipants;
    
    // Events
    event QuizCreated(uint256 indexed quizId, address indexed creator, string title);
    event LiveEventCreated(uint256 indexed eventId, address indexed creator, string title);
    event QuizCompleted(address indexed user, uint256 indexed quizId, uint256 score, uint256 reward);
    event LiveEventJoined(address indexed user, uint256 indexed eventId);
    event LiveEventCompleted(uint256 indexed eventId, address[] winners, uint256[] prizes);
    event NFTAwarded(address indexed user, uint256 indexed tokenId, string achievement);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _rewardToken) ERC721("QuizBlock Achievement", "QBA") {
        rewardToken = IERC20(_rewardToken);
    }
    
    // ============ QUIZ FUNCTIONS ============
    
    /**
     * @dev Create a new quiz
     * @param _title Quiz title
     * @param _category Quiz category
     * @param _questions Array of questions
     * @param _correctAnswers Array of correct answers
     * @param _timeLimit Time limit in seconds
     * @param _entryFee Entry fee in tokens
     * @param _rewardPool Reward pool in tokens
     */
    function createQuiz(
        string memory _title,
        string memory _category,
        string[] memory _questions,
        string[] memory _correctAnswers,
        uint256 _timeLimit,
        uint256 _entryFee,
        uint256 _rewardPool
    ) external onlyOwner {
        require(_questions.length == _correctAnswers.length, "Questions and answers length mismatch");
        require(_questions.length > 0, "Quiz must have at least one question");
        
        uint256 quizId = _quizIdCounter.current();
        _quizIdCounter.increment();
        
        quizzes[quizId] = Quiz({
            id: quizId,
            title: _title,
            category: _category,
            questions: _questions,
            correctAnswers: _correctAnswers,
            timeLimit: _timeLimit,
            entryFee: _entryFee,
            rewardPool: _rewardPool,
            isActive: true,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        
        emit QuizCreated(quizId, msg.sender, _title);
    }
    
    /**
     * @dev Participate in a quiz
     * @param _quizId Quiz ID
     * @param _answers User's answers
     */
    function participateInQuiz(
        uint256 _quizId,
        string[] memory _answers
    ) external nonReentrant {
        Quiz storage quiz = quizzes[_quizId];
        require(quiz.isActive, "Quiz is not active");
        require(!hasAnsweredQuiz[msg.sender][_quizId], "Already participated");
        require(_answers.length == quiz.questions.length, "Invalid number of answers");
        
        // Pay entry fee if required
        if (quiz.entryFee > 0) {
            require(rewardToken.transferFrom(msg.sender, address(this), quiz.entryFee), "Entry fee transfer failed");
        }
        
        // Calculate score
        uint256 score = 0;
        for (uint256 i = 0; i < _answers.length; i++) {
            if (keccak256(bytes(_answers[i])) == keccak256(bytes(quiz.correctAnswers[i]))) {
                score++;
            }
        }
        
        // Update user data
        hasAnsweredQuiz[msg.sender][_quizId] = true;
        userScores[msg.sender][_quizId] = score;
        quizParticipants[_quizId].push(msg.sender);
        
        // Calculate reward
        uint256 reward = (quiz.rewardPool * score) / quiz.questions.length;
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        if (!profile.isRegistered) {
            profile.isRegistered = true;
        }
        profile.totalQuizzes++;
        profile.correctAnswers += score;
        profile.tokensEarned += reward;
        
        // Award reputation based on performance
        uint256 reputationGain = score * 10; // 10 points per correct answer
        profile.reputation += reputationGain;
        
        // Transfer reward
        if (reward > 0) {
            require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");
        }
        
        // Award NFT for perfect score
        if (score == quiz.questions.length) {
            _awardAchievementNFT(msg.sender, "Perfect Score", _quizId);
        }
        
        emit QuizCompleted(msg.sender, _quizId, score, reward);
        emit ReputationUpdated(msg.sender, profile.reputation);
    }
    
    // ============ LIVE EVENT FUNCTIONS ============
    
    /**
     * @dev Create a live quiz event
     */
    function createLiveEvent(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxParticipants,
        uint256 _entryFee,
        uint256 _totalPrizePool
    ) external onlyOwner {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        
        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();
        
        LiveEvent storage event_ = liveEvents[eventId];
        event_.id = eventId;
        event_.title = _title;
        event_.description = _description;
        event_.startTime = _startTime;
        event_.endTime = _endTime;
        event_.maxParticipants = _maxParticipants;
        event_.entryFee = _entryFee;
        event_.totalPrizePool = _totalPrizePool;
        event_.isActive = true;
        
        emit LiveEventCreated(eventId, msg.sender, _title);
    }
    
    /**
     * @dev Join a live event
     */
    function joinLiveEvent(uint256 _eventId) external nonReentrant {
        LiveEvent storage event_ = liveEvents[_eventId];
        require(event_.isActive, "Event is not active");
        require(block.timestamp >= event_.startTime && block.timestamp <= event_.endTime, "Event not in progress");
        require(event_.participants.length < event_.maxParticipants, "Event is full");
        require(!event_.hasParticipated[msg.sender], "Already joined");
        
        // Pay entry fee
        if (event_.entryFee > 0) {
            require(rewardToken.transferFrom(msg.sender, address(this), event_.entryFee), "Entry fee transfer failed");
        }
        
        event_.participants.push(msg.sender);
        event_.hasParticipated[msg.sender] = true;
        
        emit LiveEventJoined(msg.sender, _eventId);
    }
    
    // ============ NFT FUNCTIONS ============
    
    /**
     * @dev Award achievement NFT
     */
    function _awardAchievementNFT(address _user, string memory _achievement, uint256 _quizId) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(_user, tokenId);
        
        // Update user profile
        userProfiles[_user].nftsEarned++;
        
        emit NFTAwarded(_user, tokenId, _achievement);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getQuiz(uint256 _quizId) external view returns (
        uint256 id,
        string memory title,
        string memory category,
        uint256 timeLimit,
        uint256 entryFee,
        uint256 rewardPool,
        bool isActive,
        address creator,
        uint256 createdAt
    ) {
        Quiz storage quiz = quizzes[_quizId];
        return (
            quiz.id,
            quiz.title,
            quiz.category,
            quiz.timeLimit,
            quiz.entryFee,
            quiz.rewardPool,
            quiz.isActive,
            quiz.creator,
            quiz.createdAt
        );
    }
    
    function getUserProfile(address _user) external view returns (
        uint256 totalQuizzes,
        uint256 correctAnswers,
        uint256 reputation,
        uint256 tokensEarned,
        uint256 nftsEarned,
        bool isRegistered
    ) {
        UserProfile storage profile = userProfiles[_user];
        return (
            profile.totalQuizzes,
            profile.correctAnswers,
            profile.reputation,
            profile.tokensEarned,
            profile.nftsEarned,
            profile.isRegistered
        );
    }
    
    function getQuizParticipants(uint256 _quizId) external view returns (address[] memory) {
        return quizParticipants[_quizId];
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function toggleQuiz(uint256 _quizId) external onlyOwner {
        quizzes[_quizId].isActive = !quizzes[_quizId].isActive;
    }
    
    function toggleLiveEvent(uint256 _eventId) external onlyOwner {
        liveEvents[_eventId].isActive = !liveEvents[_eventId].isActive;
    }
    
    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(rewardToken.transfer(owner(), _amount), "Withdrawal failed");
    }
}
