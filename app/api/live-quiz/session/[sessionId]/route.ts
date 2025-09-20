import { NextRequest, NextResponse } from "next/server";
import { getLiveQuizManager } from "@/lib/liveQuizManager";

// GET /api/live-quiz/session/[sessionId]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        if (!sessionId) {
            return NextResponse.json(
                { error: "Session ID is required" },
                { status: 400 }
            );
        }

        const liveQuizManager = getLiveQuizManager();
        if (!liveQuizManager) {
            return NextResponse.json(
                { error: "Live quiz manager not initialized" },
                { status: 503 }
            );
        }

        const session = liveQuizManager.getSessionById(sessionId);
        if (!session) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Return session info without exposing correct answers (unless quiz is ended)
        const sessionInfo = {
            ...session,
            quiz: {
                ...session.quiz,
                questions: session.status === 'ended'
                    ? session.quiz.questions
                    : session.quiz.questions.map(q => ({
                        ...q,
                        options: q.options.map(o => ({
                            id: o.id,
                            text: o.text,
                            isCorrect: false
                        }))
                    }))
            }
        };

        return NextResponse.json({ session: sessionInfo });

    } catch (error) {
        console.error("Error fetching quiz session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}