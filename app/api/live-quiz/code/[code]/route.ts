import { NextRequest, NextResponse } from "next/server";
import { getLiveQuizManager } from "@/lib/liveQuizManager";

// GET /api/live-quiz/code/[code]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json(
                { error: "Quiz code is required" },
                { status: 400 }
            );
        }

        // Validate code format
        if (!/^[A-Z0-9]{6}$/.test(code)) {
            return NextResponse.json(
                { error: "Invalid quiz code format" },
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

        const session = liveQuizManager.getSessionByCode(code);
        if (!session) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            );
        }

        if (session.status === 'ended') {
            return NextResponse.json(
                { error: "Quiz has already ended" },
                { status: 410 }
            );
        }

        // Return basic session info for joining
        const sessionInfo = {
            id: session.id,
            code: session.code,
            quiz: {
                id: session.quiz.id,
                title: session.quiz.title,
                description: session.quiz.description,
                totalQuestions: session.quiz.questions.length
            },
            prizeAmount: session.prizeAmount,
            status: session.status,
            totalParticipants: session.participants.length,
            questionTimeLimit: session.questionTimeLimit
        };

        return NextResponse.json({ session: sessionInfo });

    } catch (error) {
        console.error("Error fetching quiz by code:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}