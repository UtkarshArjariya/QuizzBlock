import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
    ILiveQuizSession,
    ILiveParticipant,
    IQuestion,
    IQuizResults,
    ISocketEvents
} from '@/types/types';

export interface UseWebSocketReturn {
    socket: Socket | null;
    isConnected: boolean;

    // Host functions
    createQuiz: (quiz: any, prizeAmount: number, hostWallet: string) => void;
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

export const useWebSocket = (): UseWebSocketReturn => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const eventCallbacks = useRef<{ [key: string]: Function }>({});

    useEffect(() => {
        const socketInstance = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
            path: '/api/socket/io',
            transports: ['websocket', 'polling']
        }); socketInstance.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        });

        // Register event listeners
        socketInstance.on('host:quiz-created', (data) => {
            eventCallbacks.current.onQuizCreated?.(data);
        });

        socketInstance.on('quiz:started', (data) => {
            eventCallbacks.current.onQuizStarted?.(data);
        });

        socketInstance.on('quiz:question-changed', (data) => {
            eventCallbacks.current.onQuestionChanged?.(data);
        });

        socketInstance.on('quiz:ended', (data) => {
            eventCallbacks.current.onQuizEnded?.(data);
        });

        socketInstance.on('participant:joined', (data) => {
            eventCallbacks.current.onParticipantJoined?.(data);
        });

        socketInstance.on('quiz:participant-joined', (data) => {
            eventCallbacks.current.onParticipantJoined?.(data);
        });

        socketInstance.on('quiz:participant-left', (data) => {
            eventCallbacks.current.onParticipantLeft?.(data);
        });

        socketInstance.on('quiz:timer-update', (data) => {
            eventCallbacks.current.onTimerUpdate?.(data);
        });

        socketInstance.on('quiz:leaderboard-update', (data) => {
            eventCallbacks.current.onLeaderboardUpdate?.(data);
        });

        socketInstance.on('error', (data) => {
            console.error('WebSocket error:', data);
            eventCallbacks.current.onError?.(data);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Host functions
    const createQuiz = (quiz: any, prizeAmount: number, hostWallet: string) => {
        socket?.emit('host:create-quiz', { quiz, prizeAmount, hostWallet });
    };

    const startQuiz = (sessionId: string, hostWallet: string) => {
        socket?.emit('host:start-quiz', { sessionId, hostWallet });
    };

    const nextQuestion = (sessionId: string, hostWallet: string) => {
        socket?.emit('host:next-question', { sessionId, hostWallet });
    };

    const endQuiz = (sessionId: string, hostWallet: string) => {
        socket?.emit('host:end-quiz', { sessionId, hostWallet });
    };

    // Participant functions
    const joinQuiz = (code: string, walletAddress: string, username?: string) => {
        socket?.emit('participant:join', { code, walletAddress, username });
    };

    const submitAnswer = (sessionId: string, participantId: string, questionId: string, optionId: string) => {
        socket?.emit('participant:answer', { sessionId, participantId, questionId, optionId });
    };

    const leaveQuiz = (sessionId: string, participantId: string) => {
        socket?.emit('participant:leave', { sessionId, participantId });
    };

    // Event handler setters
    const onQuizCreated = (callback: (data: { session: ILiveQuizSession }) => void) => {
        eventCallbacks.current.onQuizCreated = callback;
    };

    const onQuizStarted = (callback: (data: { sessionId: string; currentQuestion: IQuestion; timeLimit: number }) => void) => {
        eventCallbacks.current.onQuizStarted = callback;
    };

    const onQuestionChanged = (callback: (data: { questionIndex: number; question: IQuestion; timeLimit: number; timeLeft: number }) => void) => {
        eventCallbacks.current.onQuestionChanged = callback;
    };

    const onQuizEnded = (callback: (data: { results: IQuizResults }) => void) => {
        eventCallbacks.current.onQuizEnded = callback;
    };

    const onParticipantJoined = (callback: (data: { participant: ILiveParticipant; session?: ILiveQuizSession }) => void) => {
        eventCallbacks.current.onParticipantJoined = callback;
    };

    const onParticipantLeft = (callback: (data: { participantId: string; totalParticipants: number }) => void) => {
        eventCallbacks.current.onParticipantLeft = callback;
    };

    const onTimerUpdate = (callback: (data: { timeLeft: number }) => void) => {
        eventCallbacks.current.onTimerUpdate = callback;
    };

    const onLeaderboardUpdate = (callback: (data: { participants: ILiveParticipant[] }) => void) => {
        eventCallbacks.current.onLeaderboardUpdate = callback;
    };

    const onError = (callback: (data: { message: string; code?: string }) => void) => {
        eventCallbacks.current.onError = callback;
    };

    const disconnect = () => {
        socket?.disconnect();
    };

    return {
        socket,
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