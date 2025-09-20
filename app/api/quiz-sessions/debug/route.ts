import { NextResponse } from 'next/server';
import quizSessionStore from '@/lib/quizSessionStore';

export async function GET() {
    try {
        const debug = quizSessionStore.getDebugInfo();

        return NextResponse.json({
            success: true,
            debug,
            message: 'Debug info retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting debug info:', error);
        return NextResponse.json(
            { error: 'Failed to get debug info' },
            { status: 500 }
        );
    }
}