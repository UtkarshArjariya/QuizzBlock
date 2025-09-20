import { NextRequest, NextResponse } from "next/server";
import { IQuiz } from "@/types/types";

// POST /api/live-quiz/create
export async function POST(req: NextRequest) {
    try {
        const { quiz, prizeAmount, hostWallet } = await req.json();

        if (!quiz || !prizeAmount || !hostWallet) {
            return NextResponse.json(
                { error: "Quiz, prize amount, and host wallet are required" },
                { status: 400 }
            );
        }

        // Validate quiz structure
        if (!quiz.questions || quiz.questions.length === 0) {
            return NextResponse.json(
                { error: "Quiz must have at least one question" },
                { status: 400 }
            );
        }

        // Validate prize amount
        if (prizeAmount <= 0) {
            return NextResponse.json(
                { error: "Prize amount must be greater than 0" },
                { status: 400 }
            );
        }

        // Return instructions to connect to WebSocket
        return NextResponse.json({
            message: "Quiz session creation initiated. Connect to WebSocket and emit 'host:create-quiz' event.",
            instructions: {
                endpoint: "/api/socket/io",
                event: "host:create-quiz",
                payload: { quiz, prizeAmount, hostWallet }
            }
        });

    } catch (error) {
        console.error("Error in live quiz creation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}