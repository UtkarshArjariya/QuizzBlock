import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
    ILiveQuizSession,
    ILiveParticipant,
    ILiveAnswer,
    IQuizResults,
    IParticipantResult,
    IQuestionStats,
    IQuiz
} from '@/types/types';

export type NextApiResponseServerIO = NextApiResponse & {
    socket: {
        server: NetServer & {
            io: ServerIO;
        };
    };
};

// In-memory storage for quiz sessions (in production, use a database)
const quizSessions = new Map<string, ILiveQuizSession>();
const participantSockets = new Map<string, string>(); // participantId -> socketId

class LiveQuizManager {
    private io: ServerIO;

    constructor(io: ServerIO) {
        this.io = io;
    }

    createQuizSession(quiz: IQuiz, hostWallet: string, prizeAmount: number): ILiveQuizSession {
        const sessionId = uuidv4();
        const code = this.generateQuizCode();

        const session: ILiveQuizSession = {
            id: sessionId,
            code,
            quiz,
            hostWallet,
            prizeAmount,
            status: 'waiting',
            currentQuestionIndex: -1,
            participants: [],
            createdAt: new Date().toISOString(),
            questionTimeLimit: 30 // 30 seconds per question
        };

        quizSessions.set(sessionId, session);
        return session;
    }

    joinQuizSession(code: string, walletAddress: string, username?: string, socketId?: string): ILiveParticipant | null {
        const session = Array.from(quizSessions.values()).find(s => s.code === code);
        if (!session || session.status === 'ended') {
            return null;
        }

        // Check if participant already exists
        const existingParticipant = session.participants.find(p => p.walletAddress === walletAddress);
        if (existingParticipant) {
            existingParticipant.isConnected = true;
            if (socketId) {
                participantSockets.set(existingParticipant.id, socketId);
            }
            return existingParticipant;
        }

        const participant: ILiveParticipant = {
            id: uuidv4(),
            walletAddress,
            username,
            joinedAt: new Date().toISOString(),
            isConnected: true,
            score: 0,
            answers: []
        };

        session.participants.push(participant);

        if (socketId) {
            participantSockets.set(participant.id, socketId);
        }

        // Notify all participants about new joiner
        this.io.to(session.code).emit('quiz:participant-joined', {
            participant,
            totalParticipants: session.participants.length
        });

        return participant;
    }

    startQuiz(sessionId: string, hostWallet: string): boolean {
        const session = quizSessions.get(sessionId);
        if (!session || session.hostWallet !== hostWallet || session.status !== 'waiting') {
            return false;
        }

        session.status = 'active';
        session.startedAt = new Date().toISOString();
        session.currentQuestionIndex = 0;
        session.questionStartTime = Date.now();

        const currentQuestion = session.quiz.questions[0];

        // Broadcast quiz start to all participants
        this.io.to(session.code).emit('quiz:started', {
            sessionId,
            currentQuestion,
            timeLimit: session.questionTimeLimit
        });

        // Start question timer
        this.startQuestionTimer(sessionId);

        return true;
    }

    nextQuestion(sessionId: string, hostWallet: string): boolean {
        const session = quizSessions.get(sessionId);
        if (!session || session.hostWallet !== hostWallet || session.status !== 'active') {
            return false;
        }

        session.currentQuestionIndex++;

        if (session.currentQuestionIndex >= session.quiz.questions.length) {
            return this.endQuiz(sessionId, hostWallet);
        }

        session.questionStartTime = Date.now();
        const currentQuestion = session.quiz.questions[session.currentQuestionIndex];

        // Broadcast next question to all participants
        this.io.to(session.code).emit('quiz:question-changed', {
            questionIndex: session.currentQuestionIndex,
            question: currentQuestion,
            timeLimit: session.questionTimeLimit,
            timeLeft: session.questionTimeLimit
        });

        // Start question timer
        this.startQuestionTimer(sessionId);

        return true;
    }

    endQuiz(sessionId: string, hostWallet: string): boolean {
        const session = quizSessions.get(sessionId);
        if (!session || session.hostWallet !== hostWallet) {
            return false;
        }

        session.status = 'ended';
        session.endedAt = new Date().toISOString();

        // Calculate final results
        const results = this.calculateQuizResults(session);

        // Save results to JSON file
        this.saveQuizResults(results);

        // Broadcast quiz end to all participants
        this.io.to(session.code).emit('quiz:ended', { results });

        return true;
    }

    submitAnswer(sessionId: string, participantId: string, questionId: string, optionId: string): boolean {
        const session = quizSessions.get(sessionId);
        if (!session || session.status !== 'active') {
            return false;
        }

        const participant = session.participants.find(p => p.id === participantId);
        if (!participant) {
            return false;
        }

        const currentQuestion = session.quiz.questions[session.currentQuestionIndex];
        if (currentQuestion.id !== questionId) {
            return false; // Wrong question
        }

        // Check if already answered this question
        const existingAnswer = participant.answers.find(a => a.questionId === questionId);
        if (existingAnswer) {
            return false; // Already answered
        }

        const correctOption = currentQuestion.options.find(o => o.isCorrect);
        const isCorrect = optionId === correctOption?.id;
        const timeToAnswer = Date.now() - (session.questionStartTime || Date.now());

        const answer: ILiveAnswer = {
            questionId,
            optionId,
            isCorrect,
            timeToAnswer,
            answeredAt: new Date().toISOString()
        };

        participant.answers.push(answer);

        if (isCorrect) {
            // Score calculation: base score + time bonus
            const timeBonus = Math.max(0, (session.questionTimeLimit * 1000 - timeToAnswer) / 100);
            participant.score += Math.round(100 + timeBonus);
        }

        // Update participant rankings
        this.updateParticipantRankings(session);

        // Broadcast leaderboard update
        this.io.to(session.code).emit('quiz:leaderboard-update', {
            participants: session.participants.sort((a, b) => b.score - a.score)
        });

        return true;
    }

    private startQuestionTimer(sessionId: string): void {
        const session = quizSessions.get(sessionId);
        if (!session) return;

        let timeLeft = session.questionTimeLimit;

        const timer = setInterval(() => {
            timeLeft--;

            this.io.to(session.code).emit('quiz:timer-update', { timeLeft });

            if (timeLeft <= 0) {
                clearInterval(timer);
                // Auto move to next question if host hasn't done it manually
                setTimeout(() => {
                    const currentSession = quizSessions.get(sessionId);
                    if (currentSession && currentSession.status === 'active') {
                        this.nextQuestion(sessionId, currentSession.hostWallet);
                    }
                }, 2000); // 2 second delay before auto-advance
            }
        }, 1000);
    }

    private updateParticipantRankings(session: ILiveQuizSession): void {
        const sortedParticipants = [...session.participants].sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            // If scores are equal, rank by average response time (faster is better)
            const avgTimeA = a.answers.reduce((sum, answer) => sum + answer.timeToAnswer, 0) / a.answers.length;
            const avgTimeB = b.answers.reduce((sum, answer) => sum + answer.timeToAnswer, 0) / b.answers.length;
            return avgTimeA - avgTimeB;
        });

        sortedParticipants.forEach((participant, index) => {
            participant.rank = index + 1;
        });
    }

    private calculateQuizResults(session: ILiveQuizSession): IQuizResults {
        this.updateParticipantRankings(session);

        const participantResults: IParticipantResult[] = session.participants.map(p => ({
            walletAddress: p.walletAddress,
            username: p.username,
            score: p.score,
            rank: p.rank || 0,
            totalAnswers: p.answers.length,
            correctAnswers: p.answers.filter(a => a.isCorrect).length,
            averageResponseTime: p.answers.length > 0
                ? p.answers.reduce((sum, a) => sum + a.timeToAnswer, 0) / p.answers.length
                : 0,
            answers: p.answers,
            prize: p.rank === 1 ? session.prizeAmount : 0 // Winner takes all for now
        }));

        const questionStats: IQuestionStats[] = session.quiz.questions.map(question => {
            const questionAnswers = session.participants.flatMap(p =>
                p.answers.filter(a => a.questionId === question.id)
            );

            const correctAnswers = questionAnswers.filter(a => a.isCorrect).length;
            const totalAnswers = questionAnswers.length;

            const optionBreakdown = question.options.map(option => {
                const count = questionAnswers.filter(a => a.optionId === option.id).length;
                return {
                    optionId: option.id,
                    optionText: option.text,
                    count,
                    percentage: totalAnswers > 0 ? (count / totalAnswers) * 100 : 0
                };
            });

            return {
                questionId: question.id,
                questionText: question.text,
                totalAnswers,
                correctAnswers,
                accuracyRate: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
                averageResponseTime: questionAnswers.length > 0
                    ? questionAnswers.reduce((sum, a) => sum + a.timeToAnswer, 0) / questionAnswers.length
                    : 0,
                optionBreakdown
            };
        });

        const startTime = new Date(session.startedAt!).getTime();
        const endTime = new Date(session.endedAt!).getTime();

        return {
            sessionId: session.id,
            quiz: session.quiz,
            hostWallet: session.hostWallet,
            prizeAmount: session.prizeAmount,
            totalParticipants: session.participants.length,
            completedAt: session.endedAt!,
            duration: endTime - startTime,
            participants: participantResults,
            questionStats
        };
    }

    private saveQuizResults(results: IQuizResults): void {
        const fs = require('fs');
        const path = require('path');

        // Create results directory if it doesn't exist
        const resultsDir = path.join(process.cwd(), 'quiz-results');
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `quiz-${results.sessionId}-${timestamp}.json`;
        const filepath = path.join(resultsDir, filename);

        // Save results to JSON file
        fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
        console.log(`Quiz results saved to: ${filepath}`);
    }

    private generateQuizCode(): string {
        // Generate a 6-character alphanumeric code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Ensure uniqueness
        const existingCodes = Array.from(quizSessions.values()).map(s => s.code);
        if (existingCodes.includes(code)) {
            return this.generateQuizCode(); // Try again
        }

        return code;
    }

    getSessionByCode(code: string): ILiveQuizSession | undefined {
        return Array.from(quizSessions.values()).find(s => s.code === code);
    }

    getSessionById(id: string): ILiveQuizSession | undefined {
        return quizSessions.get(id);
    }

    removeParticipant(sessionId: string, participantId: string): void {
        const session = quizSessions.get(sessionId);
        if (!session) return;

        const participantIndex = session.participants.findIndex(p => p.id === participantId);
        if (participantIndex > -1) {
            session.participants.splice(participantIndex, 1);
            participantSockets.delete(participantId);

            this.io.to(session.code).emit('quiz:participant-left', {
                participantId,
                totalParticipants: session.participants.length
            });
        }
    }
}

let liveQuizManager: LiveQuizManager;

export function initializeLiveQuizManager(io: ServerIO): LiveQuizManager {
    if (!liveQuizManager) {
        liveQuizManager = new LiveQuizManager(io);
    }
    return liveQuizManager;
}

export function getLiveQuizManager(): LiveQuizManager {
    return liveQuizManager;
}

export { quizSessions, participantSockets };