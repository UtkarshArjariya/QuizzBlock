import { ILiveQuizSession, ILiveParticipant, IQuizResults } from '@/types/types';

// Global storage that persists across serverless function calls
const globalSessions = new Map<string, ILiveQuizSession>();
const globalSessionsByCode = new Map<string, string>();

// In-memory storage for quiz sessions (in production, use a database)
class QuizSessionStore {
    private get sessions() {
        return globalSessions;
    }

    private get sessionsByCode() {
        return globalSessionsByCode;
    }

    createSession(session: ILiveQuizSession): void {
        this.sessions.set(session.id, session);
        this.sessionsByCode.set(session.code, session.id);
    }

    getSessionById(sessionId: string): ILiveQuizSession | undefined {
        return this.sessions.get(sessionId);
    }

    getSessionByCode(code: string): ILiveQuizSession | undefined {
        const sessionId = this.sessionsByCode.get(code);
        return sessionId ? this.sessions.get(sessionId) : undefined;
    }

    updateSession(sessionId: string, updates: Partial<ILiveQuizSession>): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        const updatedSession = { ...session, ...updates };
        this.sessions.set(sessionId, updatedSession);
        return true;
    }

    addParticipant(sessionId: string, participant: ILiveParticipant): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        // Check if participant already exists
        const existingIndex = session.participants.findIndex(
            p => p.walletAddress === participant.walletAddress
        );

        if (existingIndex >= 0) {
            // Update existing participant
            session.participants[existingIndex] = participant;
        } else {
            // Add new participant
            session.participants.push(participant);
        }

        this.sessions.set(sessionId, session);
        return true;
    }

    removeParticipant(sessionId: string, participantId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        session.participants = session.participants.filter(
            p => p.id !== participantId
        );

        this.sessions.set(sessionId, session);
        return true;
    }

    getAllSessions(): ILiveQuizSession[] {
        return Array.from(this.sessions.values());
    }

    deleteSession(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        this.sessions.delete(sessionId);
        this.sessionsByCode.delete(session.code);
        return true;
    }

    // Clean up expired sessions (older than 24 hours)
    cleanupExpiredSessions(): void {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        for (const [sessionId, session] of this.sessions.entries()) {
            const sessionAge = now - new Date(session.createdAt).getTime();
            if (sessionAge > oneDay) {
                this.deleteSession(sessionId);
            }
        }
    }

    // Debug method to see all sessions
    getDebugInfo(): any {
        const sessionCounts = {
            totalSessions: this.sessions.size,
            totalCodes: this.sessionsByCode.size,
            sessions: Array.from(this.sessions.entries()).map(([id, session]) => ({
                id,
                code: session.code,
                status: session.status,
                participantCount: session.participants.length,
                createdAt: session.createdAt
            })),
            codes: Array.from(this.sessionsByCode.entries())
        };

        console.log('QuizSessionStore Debug:', sessionCounts);
        return sessionCounts;
    }
}

// Global instance
const quizSessionStore = new QuizSessionStore();

// Clean up expired sessions every hour
if (typeof window === 'undefined') { // Only run on server
    setInterval(() => {
        quizSessionStore.cleanupExpiredSessions();
    }, 60 * 60 * 1000);
}

export default quizSessionStore;