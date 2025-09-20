import { NextRequest, NextResponse } from "next/server";

// POST /api/live-quiz/join
export async function POST(req: NextRequest) {
    try {
        const { code, walletAddress, username } = await req.json();

        if (!code || !walletAddress) {
            return NextResponse.json(
                { error: "Quiz code and wallet address are required" },
                { status: 400 }
            );
        }

        // Validate code format (6 alphanumeric characters)
        if (!/^[A-Z0-9]{6}$/.test(code)) {
            return NextResponse.json(
                { error: "Invalid quiz code format" },
                { status: 400 }
            );
        }

        // Return instructions to connect to WebSocket
        return NextResponse.json({
            message: "Quiz join initiated. Connect to WebSocket and emit 'participant:join' event.",
            instructions: {
                endpoint: "/api/socket/io",
                event: "participant:join",
                payload: { code, walletAddress, username }
            }
        });

    } catch (error) {
        console.error("Error in quiz join:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}