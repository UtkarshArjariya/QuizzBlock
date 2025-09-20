import { NextRequest, NextResponse } from 'next/server';
import { fileSessionStore } from '@/lib/fileSessionStore';

export async function POST(req: NextRequest) {
    try {
        const { code }: { code: string } = await req.json();

        if (!code) {
            return NextResponse.json(
                { error: 'Quiz code is required' },
                { status: 400 }
            );
        }

        const session = fileSessionStore.getSessionByCode(code.toUpperCase());

        if (!session) {
            return NextResponse.json(
                { error: 'Quiz not found', exists: false },
                { status: 404 }
            );
        }

        // Return basic quiz info without joining
        return NextResponse.json({
            success: true,
            exists: true,
            quiz: {
                title: session.quiz.title,
                code: session.code,
                status: session.status,
                participantCount: session.participants.length,
                prizeAmount: session.prizeAmount
            }
        });

    } catch (error) {
        console.error('Error pinging quiz session:', error);
        return NextResponse.json(
            { error: 'Failed to ping quiz session' },
            { status: 500 }
        );
    }
}