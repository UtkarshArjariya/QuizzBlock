import { NextRequest, NextResponse } from 'next/server';
import { fileSessionStore } from '@/lib/fileSessionStore';
import { ILiveParticipant } from '@/types/types';

export async function POST(req: NextRequest) {
    try {
        const { code, walletAddress, username }: {
            code: string;
            walletAddress: string;
            username?: string;
        } = await req.json();

        if (!code || !walletAddress) {
            return NextResponse.json(
                { error: 'Quiz code and wallet address are required' },
                { status: 400 }
            );
        }

        console.log('Join request:', { code: code.toUpperCase(), walletAddress, username });

        // Find session by code using fileSessionStore
        const session = fileSessionStore.getSessionByCode(code.toUpperCase());

        if (!session) {
            console.log('Session not found for code:', code.toUpperCase());
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        if (session.status !== 'waiting') {
            return NextResponse.json(
                { error: 'Quiz has already started or ended' },
                { status: 400 }
            );
        }

        // Check if participant already joined
        const existingParticipant = session.participants.find(
            p => p.walletAddress === walletAddress
        );

        if (existingParticipant) {
            console.log('Participant already joined:', walletAddress);
            return NextResponse.json({
                success: true,
                session,
                participant: existingParticipant,
                message: 'Already joined'
            });
        }

        // Create new participant
        const participant: ILiveParticipant = {
            id: `participant-${Date.now()}-${Math.random().toString(36).substring(2)}`,
            walletAddress,
            username: username || `Player ${session.participants.length + 1}`,
            score: 0,
            answers: [],
            joinedAt: new Date().toISOString(),
            isConnected: true
        };

        // Add participant to session
        session.participants.push(participant);

        // Update session in file store
        fileSessionStore.updateSession(session.code, { participants: session.participants });

        console.log('Participant joined successfully:', {
            participantId: participant.id,
            sessionCode: session.code,
            totalParticipants: session.participants.length
        });

        return NextResponse.json({
            success: true,
            session,
            participant
        });

    } catch (error) {
        console.error('Error joining quiz:', error);
        return NextResponse.json(
            { error: 'Failed to join quiz' },
            { status: 500 }
        );
    }
}