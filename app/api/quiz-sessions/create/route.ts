import { NextRequest, NextResponse } from 'next/server';
import { fileSessionStore } from '@/lib/fileSessionStore';
import { IQuiz, ILiveQuizSession } from '@/types/types';

export async function POST(req: NextRequest) {
    try {
        const { quiz, prizeAmount, hostWallet }: {
            quiz: IQuiz;
            prizeAmount: number;
            hostWallet: string;
        } = await req.json();

        if (!quiz || !hostWallet || prizeAmount <= 0) {
            return NextResponse.json(
                { error: 'Invalid quiz data' },
                { status: 400 }
            );
        }

        // Generate session
        const session: ILiveQuizSession = {
            id: `session-${Date.now()}-${Math.random().toString(36).substring(2)}`,
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

        // Store session
        fileSessionStore.createSession(session);

        // Debug: Check if session was stored
        const storedSession = fileSessionStore.getSessionByCode(session.code);
        console.log('Session created:', {
            code: session.code,
            stored: !!storedSession,
            sessionId: session.id
        });

        return NextResponse.json({
            success: true,
            session
        });

    } catch (error) {
        console.error('Error creating quiz session:', error);
        return NextResponse.json(
            { error: 'Failed to create quiz session' },
            { status: 500 }
        );
    }
}