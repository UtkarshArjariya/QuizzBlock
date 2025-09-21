import { NextRequest, NextResponse } from 'next/server';
import { mongoSessionStore } from '@/lib/mongoSessionStore';
import { mongoUserStore } from '@/lib/mongoUserStore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionCode = searchParams.get('sessionCode');

        if (!sessionCode) {
            return NextResponse.json({ error: 'Session code is required' }, { status: 400 });
        }

        // Get session data
        const session = await mongoSessionStore.getSessionByCode(sessionCode);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Calculate leaderboard data
        const leaderboardData = session.participants.map(participant => {
            const questionsAttempted = participant.answers.length;
            const correctAnswers = participant.answers.filter(answer => answer.isCorrect).length;
            const totalQuestions = session.quiz.questions.length;
            const accuracy = questionsAttempted > 0 ? Math.round((correctAnswers / questionsAttempted) * 100) : 0;

            return {
                id: participant.id,
                walletAddress: participant.walletAddress,
                username: participant.username || 'Anonymous',
                score: participant.score,
                questionsAttempted,
                correctAnswers,
                totalQuestions,
                accuracy,
                joinedAt: participant.joinedAt,
                answers: participant.answers
            };
        }).sort((a, b) => {
            // Sort by score (descending), then by accuracy (descending), then by questions attempted (descending)
            if (b.score !== a.score) return b.score - a.score;
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return b.questionsAttempted - a.questionsAttempted;
        }).map((participant, index) => ({
            ...participant,
            rank: index + 1
        }));

        // Session summary
        const sessionSummary = {
            sessionId: session.id,
            sessionCode: session.code,
            quizTitle: session.quiz.title,
            categoryId: session.quiz.categoryId,
            totalQuestions: session.quiz.questions.length,
            totalParticipants: session.participants.length,
            status: session.status,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            duration: session.startedAt && session.endedAt
                ? new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()
                : null
        };

        console.log('Leaderboard generated for session:', sessionCode, {
            participants: leaderboardData.length,
            topScore: leaderboardData[0]?.score || 0
        });

        return NextResponse.json({
            success: true,
            sessionSummary,
            leaderboard: leaderboardData
        });

    } catch (error) {
        console.error('Error generating leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to generate leaderboard' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionCode } = await req.json();

        if (!sessionCode) {
            return NextResponse.json({ error: 'Session code is required' }, { status: 400 });
        }

        // Get session data
        const session = await mongoSessionStore.getSessionByCode(sessionCode);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (session.status !== 'ended') {
            return NextResponse.json({ error: 'Quiz must be ended to finalize stats' }, { status: 400 });
        }

        // Update stats for all participants
        const updatePromises = session.participants.map(async (participant) => {
            const questionsAttempted = participant.answers.length;
            const correctAnswers = participant.answers.filter(answer => answer.isCorrect).length;
            const totalQuestions = session.quiz.questions.length;

            try {
                await mongoUserStore.recordQuizCompletion(participant.walletAddress, {
                    categoryId: session.quiz.categoryId,
                    quizId: session.id,
                    score: participant.score,
                    responses: participant.answers,
                    questionsAttempted,
                    correctAnswers,
                    totalQuestions,
                    completedAt: new Date(session.endedAt || new Date())
                });

                console.log('Stats updated for participant:', participant.walletAddress, {
                    score: participant.score,
                    questionsAttempted,
                    correctAnswers
                });

                return {
                    walletAddress: participant.walletAddress,
                    success: true
                };
            } catch (error) {
                console.error('Failed to update stats for:', participant.walletAddress, error);
                return {
                    walletAddress: participant.walletAddress,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });

        const updateResults = await Promise.all(updatePromises);
        const successCount = updateResults.filter(result => result.success).length;
        const failureCount = updateResults.length - successCount;

        console.log('Bulk stats update completed:', {
            sessionCode,
            total: updateResults.length,
            successful: successCount,
            failed: failureCount
        });

        return NextResponse.json({
            success: true,
            message: 'Participant stats updated',
            results: {
                total: updateResults.length,
                successful: successCount,
                failed: failureCount,
                details: updateResults
            }
        });

    } catch (error) {
        console.error('Error updating participant stats:', error);
        return NextResponse.json(
            { error: 'Failed to update participant stats' },
            { status: 500 }
        );
    }
}