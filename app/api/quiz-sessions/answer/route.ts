import { NextRequest, NextResponse } from 'next/server';
import { mongoSessionStore } from '@/lib/mongoSessionStore';

export async function POST(req: NextRequest) {
    try {
        const { sessionId, participantId, questionId, optionId }: {
            sessionId: string;
            participantId: string;
            questionId: string;
            optionId: string;
        } = await req.json();

        if (!sessionId || !participantId || !questionId || !optionId) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        console.log('Answer submission:', { sessionId, participantId, questionId, optionId });

        // Get all sessions and find the one by sessionId
        const allSessions = await mongoSessionStore.getAllSessions();
        const session = Object.values(allSessions).find(s => s.id === sessionId);

        if (!session) {
            return NextResponse.json(
                { error: 'Quiz session not found' },
                { status: 404 }
            );
        }

        if (session.status !== 'active') {
            return NextResponse.json(
                { error: 'Quiz is not active' },
                { status: 400 }
            );
        }

        // Find the participant
        const participant = session.participants.find(p => p.id === participantId);
        if (!participant) {
            return NextResponse.json(
                { error: 'Participant not found' },
                { status: 404 }
            );
        }

        // Find the question
        const question = session.quiz.questions.find(q => q.id === questionId);
        if (!question) {
            return NextResponse.json(
                { error: 'Question not found' },
                { status: 404 }
            );
        }

        // Find the selected option
        const selectedOption = question.options.find(opt => opt.id === optionId);
        if (!selectedOption) {
            return NextResponse.json(
                { error: 'Invalid option' },
                { status: 400 }
            );
        }

        // Check if participant already answered this question
        const existingAnswer = participant.answers.find(a => a.questionId === questionId);
        if (existingAnswer) {
            return NextResponse.json(
                { error: 'Already answered this question' },
                { status: 400 }
            );
        }

        // Create the answer
        const answer = {
            questionId,
            optionId,
            isCorrect: selectedOption.isCorrect,
            answeredAt: new Date().toISOString(),
            timeToAnswer: 5000 // Mock response time in milliseconds
        };

        // Add answer to participant
        participant.answers.push(answer);

        // Update score if correct
        if (selectedOption.isCorrect) {
            participant.score += 100; // Base points for correct answer
        }

        // Update session in MongoDB
        await mongoSessionStore.updateSession(session.code, { participants: session.participants });

        console.log('Answer recorded:', {
            participantId,
            questionId,
            isCorrect: selectedOption.isCorrect,
            newScore: participant.score
        });

        return NextResponse.json({
            success: true,
            isCorrect: selectedOption.isCorrect,
            score: participant.score,
            correctOptionId: question.options.find(opt => opt.isCorrect)?.id
        });

    } catch (error) {
        console.error('Error submitting answer:', error);
        return NextResponse.json(
            { error: 'Failed to submit answer' },
            { status: 500 }
        );
    }
}