interface ICategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  quizzes: IQuiz[];
}

interface IQuiz {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  categoryId: string;
  questions: IQuestion[];
  // Event-specific fields
  isEvent?: boolean;
  prize?: number;
  date?: string;
  time?: string;
  duration?: string;
  difficulty?: string;
  totalSlots?: number;
  slotsLeft?: number;
  registrationFee?: number;
  creator?: string;
  followers?: string;
  tags?: string[];
}

interface IQuestion {
  id: string;
  text: string;
  difficulty?: string | null;
  options: IOption[];
}

interface IResponse {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
}

interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ICategoryStats {
  attempts: number;
  averageScore: number | null;
  categoryId: string;
  completed: number;
  id: string;
  lastAttempt: Date;
  userId: string;
  category: ICategory;
}

// Live Quiz Types
interface ILiveQuizSession {
  id: string;
  code: string;
  quiz: IQuiz;
  hostWallet: string;
  prizeAmount: number;
  status: 'waiting' | 'active' | 'ended';
  currentQuestionIndex: number;
  participants: ILiveParticipant[];
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  questionStartTime?: number;
  questionTimeLimit: number; // in seconds
}

interface ILiveParticipant {
  id: string;
  walletAddress: string;
  username?: string;
  joinedAt: string;
  isConnected: boolean;
  score: number;
  answers: ILiveAnswer[];
  rank?: number;
}

interface ILiveAnswer {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
  timeToAnswer: number; // time taken to answer in milliseconds
  answeredAt: string;
}

interface IQuizResults {
  sessionId: string;
  quiz: IQuiz;
  hostWallet: string;
  prizeAmount: number;
  totalParticipants: number;
  completedAt: string;
  duration: number; // total quiz duration in milliseconds
  participants: IParticipantResult[];
  questionStats: IQuestionStats[];
}

interface IParticipantResult {
  walletAddress: string;
  username?: string;
  score: number;
  rank: number;
  totalAnswers: number;
  correctAnswers: number;
  averageResponseTime: number;
  answers: ILiveAnswer[];
  prize?: number;
}

interface IQuestionStats {
  questionId: string;
  questionText: string;
  totalAnswers: number;
  correctAnswers: number;
  accuracyRate: number;
  averageResponseTime: number;
  optionBreakdown: {
    optionId: string;
    optionText: string;
    count: number;
    percentage: number;
  }[];
}

// WebSocket Events
interface ISocketEvents {
  // Host events
  'host:start-quiz': () => void;
  'host:next-question': () => void;
  'host:end-quiz': () => void;
  'host:question-timer': (timeLeft: number) => void;

  // Participant events
  'participant:join': (data: { walletAddress: string; username?: string }) => void;
  'participant:answer': (data: { questionId: string; optionId: string; timeToAnswer: number }) => void;
  'participant:leave': () => void;

  // Broadcast events
  'quiz:started': (data: { sessionId: string; currentQuestion: IQuestion; timeLimit: number }) => void;
  'quiz:question-changed': (data: { questionIndex: number; question: IQuestion; timeLimit: number; timeLeft: number }) => void;
  'quiz:ended': (data: { results: IQuizResults }) => void;
  'quiz:participant-joined': (data: { participant: ILiveParticipant; totalParticipants: number }) => void;
  'quiz:participant-left': (data: { participantId: string; totalParticipants: number }) => void;
  'quiz:timer-update': (data: { timeLeft: number }) => void;
  'quiz:leaderboard-update': (data: { participants: ILiveParticipant[] }) => void;

  // Error events
  'error': (data: { message: string; code?: string }) => void;
}

export type {
  ICategory,
  IQuiz,
  IQuestion,
  IOption,
  IResponse,
  ICategoryStats,
  ILiveQuizSession,
  ILiveParticipant,
  ILiveAnswer,
  IQuizResults,
  IParticipantResult,
  IQuestionStats,
  ISocketEvents
};
