// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken - QuizBlock Reward Token
 * @dev ERC20 token for quiz rewards and staking
 */
contract RewardToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * 10**18; // 10M tokens
    
    constructor() ERC20("QuizBlock Token", "QBT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens (only owner)
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
