import { useState, useEffect } from 'react';
import {
    ILiveQuizSession,
    ILiveParticipant,
    IQuestion,
    IQuizResults,
    IQuiz
} from '@/types/types';
import toast from 'react-hot-toast';

// Mock WebSocket implementation for development
export interface UseWebSocketReturn {
    socket: any;
    isConnected: boolean;

    // Host functions
    createQuiz: (quiz: IQuiz, prizeAmount: number, hostWallet: string) => void;
    startQuiz: (sessionId: string, hostWallet: string) => void;
    nextQuestion: (sessionId: string, hostWallet: string) => void;
    endQuiz: (sessionId: string, hostWallet: string) => void;

    // Participant functions
    joinQuiz: (code: string, walletAddress: string, username?: string) => void;
    submitAnswer: (sessionId: string, participantId: string, questionId: string, optionId: string) => void;
    leaveQuiz: (sessionId: string, participantId: string) => void;

    // Event handlers
    onQuizCreated: (callback: (data: { session: ILiveQuizSession }) => void) => void;
    onQuizStarted: (callback: (data: { sessionId: string; currentQuestion: IQuestion; timeLimit: number }) => void) => void;
    onQuestionChanged: (callback: (data: { questionIndex: number; question: IQuestion; timeLimit: number; timeLeft: number }) => void) => void;
    onQuizEnded: (callback: (data: { results: IQuizResults }) => void) => void;
    onParticipantJoined: (callback: (data: { participant: ILiveParticipant; session?: ILiveQuizSession }) => void) => void;
    onParticipantLeft: (callback: (data: { participantId: string; totalParticipants: number }) => void) => void;
    onTimerUpdate: (callback: (data: { timeLeft: number }) => void) => void;
    onLeaderboardUpdate: (callback: (data: { participants: ILiveParticipant[] }) => void) => void;
    onError: (callback: (data: { message: string; code?: string }) => void) => void;

    // Cleanup
    disconnect: () => void;
}

// In-memory storage for demo purposes
let currentSession: ILiveQuizSession | null = null;
let eventCallbacks: { [key: string]: Function } = {};

export const useWebSocket = (): UseWebSocketReturn => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Simulate connection after a short delay
        const timer = setTimeout(() => {
            setIsConnected(true);
            console.log('Mock WebSocket connected');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Mock implementations
    const createQuiz = (quiz: IQuiz, prizeAmount: number, hostWallet: string) => {
        console.log('Creating quiz:', { quiz: quiz.title, prizeAmount, hostWallet });

        // Generate mock session
        const session: ILiveQuizSession = {
            id: `session-${Date.now()}`,
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            quiz,
            hostWallet,
            prizeAmount,
            status: 'waiting',
            currentQuestionIndex: -1,
            participants: [],
            createdAt: new Date().toISOString(),
            questionTimeLimit: 30
        };

        currentSession = session;

        // Trigger callback
        setTimeout(() => {
            eventCallbacks.onQuizCreated?.({ session });
            toast.success(`Quiz created with code: ${session.code}`);
        }, 500);
    };

    const startQuiz = (sessionId: string, hostWallet: string) => {
        console.log('Starting quiz:', sessionId);

        if (currentSession && currentSession.quiz.questions.length > 0) {
            currentSession.status = 'active';
            currentSession.currentQuestionIndex = 0;
            currentSession.startedAt = new Date().toISOString();

            setTimeout(() => {
                eventCallbacks.onQuizStarted?.({
                    sessionId,
                    currentQuestion: currentSession!.quiz.questions[0],
                    timeLimit: 30
                });
                toast.success('Quiz started!');
            }, 500);
        }
    };

    const nextQuestion = (sessionId: string, hostWallet: string) => {
        console.log('Next question:', sessionId);

        if (currentSession) {
            currentSession.currentQuestionIndex++;

            if (currentSession.currentQuestionIndex >= currentSession.quiz.questions.length) {
                // End quiz
                endQuiz(sessionId, hostWallet);
                return;
            }

            setTimeout(() => {
                eventCallbacks.onQuestionChanged?.({
                    questionIndex: currentSession!.currentQuestionIndex,
                    question: currentSession!.quiz.questions[currentSession!.currentQuestionIndex],
                    timeLimit: 30,
                    timeLeft: 30
                });
            }, 500);
        }
    };

    const endQuiz = (sessionId: string, hostWallet: string) => {
        console.log('Ending quiz:', sessionId);

        if (currentSession) {
            currentSession.status = 'ended';
            currentSession.endedAt = new Date().toISOString();

            // Generate mock results
            const mockResults: IQuizResults = {
                sessionId,
                quiz: currentSession.quiz,
                hostWallet,
                prizeAmount: currentSession.prizeAmount,
                totalParticipants: currentSession.participants.length,
                completedAt: new Date().toISOString(),
                duration: 300000, // 5 minutes
                participants: currentSession.participants.map((p, index) => ({
                    walletAddress: p.walletAddress,
                    username: p.username,
                    score: Math.floor(Math.random() * 1000),
                    rank: index + 1,
                    totalAnswers: currentSession!.quiz.questions.length,
                    correctAnswers: Math.floor(Math.random() * currentSession!.quiz.questions.length),
                    averageResponseTime: Math.floor(Math.random() * 5000) + 1000,
                    answers: [],
                    prize: index === 0 ? currentSession!.prizeAmount : 0
                })),
                questionStats: []
            };

            setTimeout(() => {
                eventCallbacks.onQuizEnded?.({ results: mockResults });
                toast.success('Quiz ended! Results generated.');
            }, 500);
        }
    };

    const joinQuiz = (code: string, walletAddress: string, username?: string) => {
        console.log('Joining quiz with code:', code);
        toast(`Attempting to join quiz with code: ${code}`);

        // For demo, simulate successful join
        setTimeout(() => {
            toast.error('Quiz not found. For full functionality, implement the WebSocket server.');
        }, 1000);
    };

    const submitAnswer = (sessionId: string, participantId: string, questionId: string, optionId: string) => {
        console.log('Submitting answer:', { sessionId, participantId, questionId, optionId });
    };

    const leaveQuiz = (sessionId: string, participantId: string) => {
        console.log('Leaving quiz:', { sessionId, participantId });
    };

    // Event handler setters
    const onQuizCreated = (callback: (data: { session: ILiveQuizSession }) => void) => {
        eventCallbacks.onQuizCreated = callback;
    };

    const onQuizStarted = (callback: (data: { sessionId: string; currentQuestion: IQuestion; timeLimit: number }) => void) => {
        eventCallbacks.onQuizStarted = callback;
    };

    const onQuestionChanged = (callback: (data: { questionIndex: number; question: IQuestion; timeLimit: number; timeLeft: number }) => void) => {
        eventCallbacks.onQuestionChanged = callback;
    };

    const onQuizEnded = (callback: (data: { results: IQuizResults }) => void) => {
        eventCallbacks.onQuizEnded = callback;
    };

    const onParticipantJoined = (callback: (data: { participant: ILiveParticipant; session?: ILiveQuizSession }) => void) => {
        eventCallbacks.onParticipantJoined = callback;
    };

    const onParticipantLeft = (callback: (data: { participantId: string; totalParticipants: number }) => void) => {
        eventCallbacks.onParticipantLeft = callback;
    };

    const onTimerUpdate = (callback: (data: { timeLeft: number }) => void) => {
        eventCallbacks.onTimerUpdate = callback;
    };

    const onLeaderboardUpdate = (callback: (data: { participants: ILiveParticipant[] }) => void) => {
        eventCallbacks.onLeaderboardUpdate = callback;
    };

    const onError = (callback: (data: { message: string; code?: string }) => void) => {
        eventCallbacks.onError = callback;
    };

    const disconnect = () => {
        console.log('Mock WebSocket disconnected');
        setIsConnected(false);
    };

    return {
        socket: null,
        isConnected,
        createQuiz,
        startQuiz,
        nextQuestion,
        endQuiz,
        joinQuiz,
        submitAnswer,
        leaveQuiz,
        onQuizCreated,
        onQuizStarted,
        onQuestionChanged,
        onQuizEnded,
        onParticipantJoined,
        onParticipantLeft,
        onTimerUpdate,
        onLeaderboardUpdate,
        onError,
        disconnect
    };
};