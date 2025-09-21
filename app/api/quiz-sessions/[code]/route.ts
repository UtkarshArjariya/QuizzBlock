import { NextRequest, NextResponse } from 'next/server';
import { mongoSessionStore } from '@/lib/mongoSessionStore';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json(
                { error: 'Quiz code is required' },
                { status: 400 }
            );
        }

        const session = await mongoSessionStore.getSessionByCode(code.toUpperCase());

        // Debug: Log lookup attempt
        const allSessions = await mongoSessionStore.getAllSessions();
        console.log('Session lookup:', {
            code: code.toUpperCase(),
            found: !!session,
            allSessions: Object.keys(allSessions)
        });

        if (!session) {
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            session,
            participantCount: session.participants.length
        });

    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        );
    }
}