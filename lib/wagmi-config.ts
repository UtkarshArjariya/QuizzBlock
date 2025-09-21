import { createConfig, http } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Get your project ID from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

// QuizBlock Contract Addresses (deploy these contracts first)
const QUIZBLOCK_CONTRACT = '0x...' // Replace with deployed contract address
const REWARD_TOKEN_CONTRACT = '0x...' // Replace with deployed token address

// Wagmi configuration
export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: 'QuizBlock' }),
  ],
})

// Contract ABIs
export const QUIZBLOCK_ABI = [
  // Quiz Functions
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "string[]", "name": "_questions", "type": "string[]" },
      { "internalType": "string[]", "name": "_correctAnswers", "type": "string[]" },
      { "internalType": "uint256", "name": "_timeLimit", "type": "uint256" },
      { "internalType": "uint256", "name": "_entryFee", "type": "uint256" },
      { "internalType": "uint256", "name": "_rewardPool", "type": "uint256" }
    ],
    "name": "createQuiz",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_quizId", "type": "uint256" },
      { "internalType": "string[]", "name": "_answers", "type": "string[]" }
    ],
    "name": "participateInQuiz",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_quizId", "type": "uint256" }],
    "name": "getQuiz",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "uint256", "name": "timeLimit", "type": "uint256" },
      { "internalType": "uint256", "name": "entryFee", "type": "uint256" },
      { "internalType": "uint256", "name": "rewardPool", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserProfile",
    "outputs": [
      { "internalType": "uint256", "name": "totalQuizzes", "type": "uint256" },
      { "internalType": "uint256", "name": "correctAnswers", "type": "uint256" },
      { "internalType": "uint256", "name": "reputation", "type": "uint256" },
      { "internalType": "uint256", "name": "tokensEarned", "type": "uint256" },
      { "internalType": "uint256", "name": "nftsEarned", "type": "uint256" },
      { "internalType": "bool", "name": "isRegistered", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "quizId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" }
    ],
    "name": "QuizCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "quizId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "score", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" }
    ],
    "name": "QuizCompleted",
    "type": "event"
  }
] as const

export const REWARD_TOKEN_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Contract addresses
export const CONTRACTS = {
  QUIZBLOCK: QUIZBLOCK_CONTRACT,
  REWARD_TOKEN: REWARD_TOKEN_CONTRACT,
} as const
