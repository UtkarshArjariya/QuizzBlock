import { useState, useEffect } from 'react';
import {
    ILiveQuizSession,
    ILiveParticipant,
    IQuestion,
    IQuizResults,
    IQuiz
} from '@/types/types';

// WebSocket API interface
interface IWebSocketAPI {
    // Connection state
    isConnected: boolean;

    // Host functions
    createQuiz: (quiz: any, prizeAmount: number, hostWallet: string) => void;
    startQuiz: (sessionId: string, hostWallet: string) => void;
    nextQuestion: (sessionId: string, hostWallet: string) => void;
    endQuiz: (sessionId: string, hostWallet: string) => void;

    // Participant functions
    joinQuiz: (code: string, walletAddress: string, username?: string) => void;
    pingQuiz: (code: string) => Promise<{ exists: boolean; quiz?: any; error?: string }>;
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
}

// Global variable to store current session for mock implementation
let currentSession: ILiveQuizSession | null = null;

// Event callbacks storage
let eventCallbacks: { [key: string]: Function } = {};

export function useWebSocket(): IWebSocketAPI {
    const [isConnected, setIsConnected] = useState(true); // Start as connected since we use API

    useEffect(() => {
        // API-based approach doesn't need connection simulation
        console.log('API-based WebSocket hook initialized');
    }, []);    // Create quiz using API
    const createQuiz = async (quiz: IQuiz, prizeAmount: number, hostWallet: string) => {
        try {
            console.log('Creating quiz via API:', { quiz: quiz.title, prizeAmount, hostWallet });

            const response = await fetch('/api/quiz-sessions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quiz,
                    prizeAmount,
                    hostWallet
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store session globally for mock implementation
                currentSession = data.session;

                // Trigger callback
                setTimeout(() => {
                    eventCallbacks.onQuizCreated?.({ session: data.session });
                    console.log(`Quiz created with code: ${data.session.code}`);
                }, 500);
            } else {
                console.error('Failed to create quiz:', data.error);
                eventCallbacks.onError?.({ message: data.error || 'Failed to create quiz' });
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            eventCallbacks.onError?.({ message: 'Failed to create quiz' });
        }
    };

    // Join quiz using API
    const joinQuiz = async (code: string, walletAddress: string, username?: string) => {
        try {
            console.log('Joining quiz via API:', { code, walletAddress, username });

            const response = await fetch('/api/quiz-sessions/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    walletAddress,
                    username
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update current session if this is the host's session
                if (currentSession && currentSession.code === code.toUpperCase()) {
                    currentSession = data.session;
                }

                // Trigger callback
                setTimeout(() => {
                    eventCallbacks.onParticipantJoined?.({
                        participant: data.participant,
                        session: data.session
                    });
                    console.log(`Joined quiz: ${data.session.quiz.title}`);
                }, 500);
            } else {
                console.error('Failed to join quiz:', data.error);
                eventCallbacks.onError?.({ message: data.error || 'Failed to join quiz' });
            }
        } catch (error) {
            console.error('Error joining quiz:', error);
            eventCallbacks.onError?.({ message: 'Failed to join quiz' });
        }
    };

    // Ping quiz to check if it exists
    const pingQuiz = async (code: string): Promise<{ exists: boolean; quiz?: any; error?: string }> => {
        try {
            console.log('Pinging quiz:', code);

            const response = await fetch('/api/quiz-sessions/ping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.success && data.exists) {
                return {
                    exists: true,
                    quiz: data.quiz
                };
            } else {
                return {
                    exists: false,
                    error: data.error || 'Quiz not found'
                };
            }
        } catch (error) {
            console.error('Error pinging quiz:', error);
            return {
                exists: false,
                error: 'Failed to ping quiz server'
            };
        }
    };

    const startQuiz = async (sessionId: string, hostWallet: string) => {
        console.log('Starting quiz:', sessionId);

        if (!currentSession || !currentSession.quiz.questions.length) {
            eventCallbacks.onError?.({ message: 'No quiz session found' });
            return;
        }

        try {
            // Update session status
            currentSession.status = 'active';
            currentSession.currentQuestionIndex = 0;
            currentSession.startedAt = new Date().toISOString();

            // Save updated session to file storage
            const response = await fetch('/api/quiz-sessions/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: currentSession.code,
                    updates: {
                        status: 'active',
                        currentQuestionIndex: 0,
                        startedAt: new Date().toISOString()
                    }
                })
            });

            if (response.ok) {
                const firstQuestion = currentSession.quiz.questions[0];

                // Trigger quiz started callback
                setTimeout(() => {
                    eventCallbacks.onQuizStarted?.({
                        sessionId: currentSession!.id,
                        currentQuestion: firstQuestion,
                        timeLimit: 30
                    });
                    console.log('Quiz started! First question is now active.');
                }, 500);
            } else {
                throw new Error('Failed to update session');
            }

        } catch (error) {
            console.error('Error starting quiz:', error);
            eventCallbacks.onError?.({ message: 'Failed to start quiz' });
        }
    };

    const nextQuestion = async (sessionId: string, hostWallet: string) => {
        console.log('Next question:', sessionId);

        if (!currentSession) {
            eventCallbacks.onError?.({ message: 'No active quiz session' });
            return;
        }

        const newQuestionIndex = currentSession.currentQuestionIndex + 1;

        if (newQuestionIndex >= currentSession.quiz.questions.length) {
            // End quiz if no more questions
            endQuiz(sessionId, hostWallet);
            return;
        }

        try {
            // Update session with new question index
            currentSession.currentQuestionIndex = newQuestionIndex;

            // Save updated session to file storage
            const response = await fetch('/api/quiz-sessions/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: currentSession.code,
                    updates: {
                        currentQuestionIndex: newQuestionIndex
                    }
                })
            });

            if (response.ok) {
                const nextQ = currentSession.quiz.questions[newQuestionIndex];

                setTimeout(() => {
                    eventCallbacks.onQuestionChanged?.({
                        questionIndex: newQuestionIndex,
                        question: nextQ,
                        timeLimit: 30,
                        timeLeft: 30
                    });
                    console.log('Next question loaded!');
                }, 500);
            } else {
                throw new Error('Failed to update session');
            }

        } catch (error) {
            console.error('Error updating question index:', error);
            eventCallbacks.onError?.({ message: 'Failed to move to next question' });
        }
    };

    const endQuiz = async (sessionId: string, hostWallet: string) => {
        console.log('Ending quiz:', sessionId);

        if (!currentSession) {
            eventCallbacks.onError?.({ message: 'No active quiz session' });
            return;
        }

        try {
            // Update session status to ended
            currentSession.status = 'ended';
            currentSession.endedAt = new Date().toISOString();

            // Save updated session to file storage
            const response = await fetch('/api/quiz-sessions/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: currentSession.code,
                    updates: {
                        status: 'ended',
                        endedAt: new Date().toISOString()
                    }
                })
            });

            if (response.ok) {
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
                    // Keep the callback for components to handle the redirect
                    eventCallbacks.onQuizEnded?.({ results: mockResults });
                    console.log('Quiz ended! Components will handle redirect.');
                }, 500);
            } else {
                throw new Error('Failed to update session');
            }

        } catch (error) {
            console.error('Error ending quiz:', error);
            eventCallbacks.onError?.({ message: 'Failed to end quiz' });
        }
    };

    const submitAnswer = (sessionId: string, participantId: string, questionId: string, optionId: string) => {
        console.log('Submitting answer:', { sessionId, participantId, questionId, optionId });

        // Find the question and check if answer is correct
        if (currentSession) {
            const question = currentSession.quiz.questions.find(q => q.id === questionId);
            if (question) {
                const selectedOption = question.options.find(opt => opt.id === optionId);
                if (selectedOption?.isCorrect) {
                    console.log('Correct answer! 🎉');
                } else {
                    console.log('Answer submitted!');
                }
            }
        } else {
            console.log('Answer submitted!');
        }
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

    return {
        isConnected,
        createQuiz,
        startQuiz,
        nextQuestion,
        endQuiz,
        joinQuiz,
        pingQuiz,
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
        onError
    };
}