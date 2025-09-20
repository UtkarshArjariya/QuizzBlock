// Simple file-based storage for development (replace with database in production)
import fs from 'fs';
import path from 'path';
import { ILiveQuizSession } from '@/types/types';

const STORAGE_FILE = path.join(process.cwd(), 'tmp', 'quiz-sessions.json');

// Ensure tmp directory exists
const ensureStorageDir = () => {
    const tmpDir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
};

// Simple file-based session storage
export const fileSessionStore = {
    createSession: (session: ILiveQuizSession): void => {
        ensureStorageDir();
        const sessions = fileSessionStore.getAllSessions();
        sessions[session.code] = session;
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(sessions, null, 2));
        console.log('Session created and saved:', session.code);
    },

    getSessionByCode: (code: string): ILiveQuizSession | null => {
        try {
            ensureStorageDir();
            if (!fs.existsSync(STORAGE_FILE)) {
                return null;
            }
            const sessions = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
            return sessions[code.toUpperCase()] || null;
        } catch (error) {
            console.error('Error reading sessions:', error);
            return null;
        }
    },

    getAllSessions: (): { [code: string]: ILiveQuizSession } => {
        try {
            ensureStorageDir();
            if (!fs.existsSync(STORAGE_FILE)) {
                return {};
            }
            return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
        } catch (error) {
            console.error('Error reading all sessions:', error);
            return {};
        }
    },

    updateSession: (code: string, updates: Partial<ILiveQuizSession>): boolean => {
        try {
            const sessions = fileSessionStore.getAllSessions();
            if (!sessions[code]) {
                return false;
            }
            sessions[code] = { ...sessions[code], ...updates };
            fs.writeFileSync(STORAGE_FILE, JSON.stringify(sessions, null, 2));
            return true;
        } catch (error) {
            console.error('Error updating session:', error);
            return false;
        }
    }
};