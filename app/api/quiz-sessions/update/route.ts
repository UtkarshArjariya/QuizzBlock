import { NextRequest, NextResponse } from 'next/server';
import { mongoSessionStore } from '@/lib/mongoSessionStore';

export async function POST(request: NextRequest) {
    try {
        const { code, updates } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Quiz code is required' }, { status: 400 });
        }

        // Get existing session
        const session = await mongoSessionStore.getSessionByCode(code);
        if (!session) {
            return NextResponse.json({ error: 'Quiz session not found' }, { status: 404 });
        }

        // Update session with provided updates in MongoDB
        const updateSuccess = await mongoSessionStore.updateSession(code, {
            ...updates
        });

        if (!updateSuccess) {
            return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
        }

        // Get updated session
        const updatedSession = await mongoSessionStore.getSessionByCode(code);

        console.log(`Session ${code} updated:`, updates);

        return NextResponse.json({
            success: true,
            session: updatedSession
        });

    } catch (error) {
        console.error('Error updating quiz session:', error);
        return NextResponse.json(
            { error: 'Failed to update quiz session' },
            { status: 500 }
        );
    }
}