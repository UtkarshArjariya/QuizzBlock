import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { QUIZBLOCK_ABI, REWARD_TOKEN_ABI, CONTRACTS } from '@/lib/wagmi-config'
import { parseEther, formatEther } from 'viem'

// Types
export interface Quiz {
  id: bigint
  title: string
  category: string
  timeLimit: bigint
  entryFee: bigint
  rewardPool: bigint
  isActive: boolean
  creator: string
  createdAt: bigint
}

export interface UserProfile {
  totalQuizzes: bigint
  correctAnswers: bigint
  reputation: bigint
  tokensEarned: bigint
  nftsEarned: bigint
  isRegistered: boolean
}

// Custom hook for quiz operations
export function useQuizBlock() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read user profile
  const { data: userProfile, refetch: refetchProfile } = useReadContract({
    address: CONTRACTS.QUIZBLOCK,
    abi: QUIZBLOCK_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Read token balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.REWARD_TOKEN,
    abi: REWARD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Participate in quiz
  const participateInQuiz = async (quizId: number, answers: string[]) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      await writeContract({
        address: CONTRACTS.QUIZBLOCK,
        abi: QUIZBLOCK_ABI,
        functionName: 'participateInQuiz',
        args: [BigInt(quizId), answers],
      })
    } catch (err) {
      console.error('Error participating in quiz:', err)
      throw err
    }
  }

  // Approve tokens for quiz entry
  const approveTokens = async (amount: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      await writeContract({
        address: CONTRACTS.REWARD_TOKEN,
        abi: REWARD_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.QUIZBLOCK, parseEther(amount)],
      })
    } catch (err) {
      console.error('Error approving tokens:', err)
      throw err
    }
  }

  // Join live event
  const joinLiveEvent = async (eventId: number) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      await writeContract({
        address: CONTRACTS.QUIZBLOCK,
        abi: QUIZBLOCK_ABI,
        functionName: 'joinLiveEvent',
        args: [BigInt(eventId)],
      })
    } catch (err) {
      console.error('Error joining live event:', err)
      throw err
    }
  }

  return {
    // State
    isConnected,
    address,
    userProfile: userProfile as UserProfile | undefined,
    tokenBalance: tokenBalance ? formatEther(tokenBalance) : '0',
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    
    // Functions
    participateInQuiz,
    approveTokens,
    joinLiveEvent,
    refetchProfile,
    refetchBalance,
  }
}

// Hook for reading quiz data
export function useQuiz(quizId: number) {
  const { data: quiz, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.QUIZBLOCK,
    abi: QUIZBLOCK_ABI,
    functionName: 'getQuiz',
    args: [BigInt(quizId)],
  })

  return {
    quiz: quiz as Quiz | undefined,
    isLoading,
    error,
    refetch,
  }
}

// Hook for reading multiple quizzes
export function useQuizzes(quizIds: number[]) {
  const results = quizIds.map(quizId => useQuiz(quizId))
  
  return {
    quizzes: results.map(r => r.quiz),
    isLoading: results.some(r => r.isLoading),
    errors: results.map(r => r.error),
    refetchAll: () => results.forEach(r => r.refetch()),
  }
}
