# 🚀 QuizBlock Web3 Integration Guide

## Overview

This guide will help you set up a cutting-edge Web3 quiz platform using:
- **Wagmi** for React hooks and wallet integration
- **Smart contracts** for decentralized quiz management
- **NFT rewards** for achievements
- **Token rewards** for participation

## 🏗️ Architecture

### Smart Contracts
- **QuizBlock.sol**: Main quiz platform contract
- **RewardToken.sol**: ERC20 token for rewards
- **Features**: NFT achievements, reputation system, live events

### Frontend Integration
- **Wagmi**: Modern React hooks for Web3
- **Viem**: Type-safe Ethereum library
- **TanStack Query**: Caching and state management

## 📦 Installation

### 1. Install Dependencies
```bash
npm install wagmi viem @tanstack/react-query
```

### 2. Install Hardhat (for contract deployment)
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

### 3. Install OpenZeppelin Contracts
```bash
npm install @openzeppelin/contracts
```

## 🔧 Configuration

### 1. Update Wagmi Config
Edit `lib/wagmi-config.ts`:
```typescript
// Replace with your deployed contract addresses
const QUIZBLOCK_CONTRACT = '0x...' // Your deployed QuizBlock address
const REWARD_TOKEN_CONTRACT = '0x...' // Your deployed token address
```

### 2. Update Provider
Replace your current Web3 provider with Wagmi in `providers/ContextProvider.tsx`:
```typescript
import WagmiWrapper from './WagmiProvider'

function ContextProvider({ children }: Props) {
  return (
    <WagmiWrapper>
      <AppKitWrapper>
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </AppKitWrapper>
    </WagmiWrapper>
  )
}
```

## 🚀 Deployment

### 1. Configure Hardhat
Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [process.env.PRIVATE_KEY]
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### 2. Deploy Contracts
```bash
# Set your private key
export PRIVATE_KEY="your-private-key-here"

# Deploy to Fuji testnet first
npx hardhat run scripts/deploy.js --network fuji

# Deploy to mainnet when ready
npx hardhat run scripts/deploy.js --network avalanche
```

### 3. Update Contract Addresses
After deployment, update the addresses in `lib/wagmi-config.ts`.

## 🎯 Key Features

### 1. Smart Contract Features
- **Quiz Creation**: Create quizzes with questions, answers, and rewards
- **Participation**: Users pay entry fees and earn rewards based on performance
- **NFT Achievements**: Earn NFTs for perfect scores and milestones
- **Reputation System**: Build reputation through consistent performance
- **Live Events**: Time-limited competitions with larger prize pools
- **Token Economy**: ERC20 tokens for rewards and staking

### 2. Frontend Features
- **Wallet Integration**: Seamless connection with MetaMask, WalletConnect, etc.
- **Real-time Updates**: Live quiz participation and results
- **NFT Gallery**: View earned achievement NFTs
- **Leaderboards**: Track top performers
- **Portfolio**: View token balance and earnings

## 🔗 Usage Examples

### 1. Connect Wallet
```typescript
import { useAccount, useConnect } from 'wagmi'

function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  
  if (isConnected) {
    return <div>Connected: {address}</div>
  }
  
  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  )
}
```

### 2. Participate in Quiz
```typescript
import { useQuizBlock } from '@/hooks/useQuizBlock'

function QuizComponent({ quizId }: { quizId: number }) {
  const { participateInQuiz, isPending } = useQuizBlock()
  
  const handleSubmit = async (answers: string[]) => {
    try {
      await participateInQuiz(quizId, answers)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }
  
  return (
    <button 
      onClick={() => handleSubmit(['answer1', 'answer2'])}
      disabled={isPending}
    >
      {isPending ? 'Submitting...' : 'Submit Quiz'}
    </button>
  )
}
```

### 3. View User Profile
```typescript
import { useQuizBlock } from '@/hooks/useQuizBlock'

function UserProfile() {
  const { userProfile, tokenBalance } = useQuizBlock()
  
  if (!userProfile) return <div>Loading...</div>
  
  return (
    <div>
      <h3>Your Stats</h3>
      <p>Quizzes Taken: {userProfile.totalQuizzes.toString()}</p>
      <p>Correct Answers: {userProfile.correctAnswers.toString()}</p>
      <p>Reputation: {userProfile.reputation.toString()}</p>
      <p>Tokens Earned: {userProfile.tokensEarned.toString()}</p>
      <p>NFTs Earned: {userProfile.nftsEarned.toString()}</p>
      <p>Token Balance: {tokenBalance}</p>
    </div>
  )
}
```

## 🎨 UI Components

### 1. Quiz Card with Web3 Integration
```typescript
import { useQuiz } from '@/hooks/useQuizBlock'

function QuizCard({ quizId }: { quizId: number }) {
  const { quiz, isLoading } = useQuiz(quizId)
  
  if (isLoading) return <div>Loading quiz...</div>
  if (!quiz) return <div>Quiz not found</div>
  
  return (
    <div className="quiz-card">
      <h3>{quiz.title}</h3>
      <p>Category: {quiz.category}</p>
      <p>Entry Fee: {formatEther(quiz.entryFee)} QBT</p>
      <p>Reward Pool: {formatEther(quiz.rewardPool)} QBT</p>
      <p>Time Limit: {quiz.timeLimit.toString()} seconds</p>
      <button>Start Quiz</button>
    </div>
  )
}
```

## 🔒 Security Considerations

1. **Access Control**: Only owner can create quizzes and events
2. **Reentrancy Protection**: All external calls are protected
3. **Input Validation**: All inputs are validated
4. **Token Approvals**: Users must approve tokens before spending
5. **Time Limits**: Quizzes have time limits to prevent cheating

## 📊 Analytics & Monitoring

### 1. Contract Events
Monitor these events for analytics:
- `QuizCreated`: Track quiz creation
- `QuizCompleted`: Track participation and scores
- `NFTAwarded`: Track achievement NFTs
- `ReputationUpdated`: Track user progression

### 2. Frontend Analytics
- User engagement metrics
- Quiz completion rates
- Token distribution
- NFT minting statistics

## 🚀 Next Steps

1. **Deploy to Testnet**: Start with Fuji testnet
2. **Test Functionality**: Create and participate in quizzes
3. **UI Polish**: Enhance the user interface
4. **Analytics**: Add tracking and monitoring
5. **Mainnet Launch**: Deploy to Avalanche mainnet
6. **Marketing**: Promote your Web3 quiz platform

## 🆘 Troubleshooting

### Common Issues
1. **Wallet Not Detected**: Check browser extension and settings
2. **Transaction Fails**: Ensure sufficient gas and token approvals
3. **Contract Not Found**: Verify contract addresses are correct
4. **Network Issues**: Ensure you're on the correct network

### Support
- Check the [Wagmi documentation](https://wagmi.sh/)
- Review [Viem documentation](https://viem.sh/)
- Join the [Avalanche Discord](https://discord.gg/avalancheavax)

---

**Happy Building! 🎉**

Your Web3 quiz platform is now ready to revolutionize education and gamification in the blockchain space!
