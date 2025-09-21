import { ILiveQuizSession } from '@/types/types';
import { getQuizSessionModel, IQuizSession, IParticipant } from './models/QuizSession';

// Convert between our internal MongoDB model and the existing interface
const convertToLiveQuizSession = (dbSession: IQuizSession): ILiveQuizSession => {
    return {
        id: dbSession.sessionId,
        code: dbSession.code,
        quiz: {
            id: dbSession.sessionId,
            title: dbSession.title,
            description: dbSession.description || '',
            categoryId: dbSession.category,
            questions: dbSession.questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options.map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect
                }))
            })),
            difficulty: dbSession.difficulty,
            prize: dbSession.prizePool || 0
        },
        hostWallet: dbSession.hostWallet,
        prizeAmount: dbSession.prizePool || 0,
        status: dbSession.status,
        currentQuestionIndex: dbSession.currentQuestionIndex,
        participants: dbSession.participants.map(p => ({
            id: p.id,
            walletAddress: p.walletAddress,
            username: p.username,
            joinedAt: p.joinedAt.toISOString(),
            isConnected: true, // Assume connected for now
            score: p.score,
            answers: p.answers.map(a => ({
                questionId: a.questionId,
                optionId: a.selectedOptionId,
                isCorrect: a.isCorrect,
                timeToAnswer: 0, // We'll need to calculate this if needed
                answeredAt: a.answeredAt.toISOString()
            })),
            rank: 0 // Calculate rank based on score
        })),
        createdAt: dbSession.createdAt.toISOString(),
        startedAt: dbSession.startedAt?.toISOString(),
        endedAt: dbSession.endedAt?.toISOString(),
        questionTimeLimit: dbSession.timePerQuestion
    };
};

const convertFromLiveQuizSession = (liveSession: ILiveQuizSession): Partial<IQuizSession> => {
    return {
        sessionId: liveSession.id,
        code: liveSession.code,
        hostWallet: liveSession.hostWallet,
        title: liveSession.quiz.title,
        description: liveSession.quiz.description || undefined,
        category: liveSession.quiz.categoryId,
        difficulty: (liveSession.quiz.difficulty as 'easy' | 'medium' | 'hard' | 'mixed')?.toLowerCase() as 'easy' | 'medium' | 'hard' | 'mixed' || 'medium',
        questions: liveSession.quiz.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                isCorrect: opt.isCorrect
            })),
            points: 100, // Default points since not in IQuestion
            timeLimit: 30 // Default time limit since not in IQuestion
        })),
        participants: liveSession.participants.map(p => ({
            id: p.id,
            walletAddress: p.walletAddress,
            username: p.username || '',
            score: p.score,
            answers: p.answers.map(a => ({
                questionId: a.questionId,
                selectedOptionId: a.optionId,
                isCorrect: a.isCorrect,
                answeredAt: new Date(a.answeredAt)
            })),
            joinedAt: new Date(p.joinedAt)
        })),
        status: liveSession.status,
        currentQuestionIndex: liveSession.currentQuestionIndex,
        totalQuestions: liveSession.quiz.questions.length,
        timePerQuestion: liveSession.questionTimeLimit,
        prizePool: liveSession.prizeAmount,
        startedAt: liveSession.startedAt ? new Date(liveSession.startedAt) : undefined,
        endedAt: liveSession.endedAt ? new Date(liveSession.endedAt) : undefined
    };
};

// MongoDB-based session store with the same interface as fileSessionStore
export const mongoSessionStore = {
    createSession: async (session: ILiveQuizSession): Promise<void> => {
        try {
            const QuizSessionModel = await getQuizSessionModel();
            const dbSession = convertFromLiveQuizSession(session);

            const newSession = new QuizSessionModel(dbSession);
            await newSession.save();

            console.log('Session created and saved to MongoDB:', session.code);
        } catch (error) {
            console.error('Error creating session in MongoDB:', error);
            throw error;
        }
    },

    getSessionByCode: async (code: string): Promise<ILiveQuizSession | null> => {
        try {
            const QuizSessionModel = await getQuizSessionModel();
            const dbSession = await QuizSessionModel.findOne({
                code: code.toUpperCase()
            }).exec();

            if (!dbSession) {
                return null;
            }

            return convertToLiveQuizSession(dbSession);
        } catch (error) {
            console.error('Error reading session from MongoDB:', error);
            return null;
        }
    },

    getAllSessions: async (): Promise<{ [code: string]: ILiveQuizSession }> => {
        try {
            const QuizSessionModel = await getQuizSessionModel();
            const dbSessions = await QuizSessionModel.find().exec();

            const sessions: { [code: string]: ILiveQuizSession } = {};
            for (const dbSession of dbSessions) {
                const liveSession = convertToLiveQuizSession(dbSession);
                sessions[liveSession.code] = liveSession;
            }

            return sessions;
        } catch (error) {
            console.error('Error reading all sessions from MongoDB:', error);
            return {};
        }
    },

    updateSession: async (code: string, updates: Partial<ILiveQuizSession>): Promise<boolean> => {
        try {
            const QuizSessionModel = await getQuizSessionModel();

            // First get the existing session
            const existingSession = await QuizSessionModel.findOne({
                code: code.toUpperCase()
            }).exec();

            if (!existingSession) {
                return false;
            }

            // Convert to live session, apply updates, then convert back
            const liveSession = convertToLiveQuizSession(existingSession);
            const updatedLiveSession = { ...liveSession, ...updates };
            const dbUpdates = convertFromLiveQuizSession(updatedLiveSession);

            await QuizSessionModel.updateOne(
                { code: code.toUpperCase() },
                { $set: dbUpdates }
            ).exec();

            return true;
        } catch (error) {
            console.error('Error updating session in MongoDB:', error);
            return false;
        }
    },

    // Additional MongoDB-specific methods
    deleteSession: async (code: string): Promise<boolean> => {
        try {
            const QuizSessionModel = await getQuizSessionModel();
            const result = await QuizSessionModel.deleteOne({
                code: code.toUpperCase()
            }).exec();

            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting session from MongoDB:', error);
            return false;
        }
    },

    cleanupExpiredSessions: async (): Promise<number> => {
        try {
            const QuizSessionModel = await getQuizSessionModel();
            const result = await QuizSessionModel.deleteMany({
                expiresAt: { $lt: new Date() }
            }).exec();

            console.log(`Cleaned up ${result.deletedCount} expired sessions`);
            return result.deletedCount;
        } catch (error) {
            console.error('Error cleaning up expired sessions:', error);
            return 0;
        }
    }
};