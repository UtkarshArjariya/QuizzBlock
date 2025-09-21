import { NextRequest, NextResponse } from "next/server";
import { mongoUserStore } from "@/lib/mongoUserStore";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, categoryId, quizId, score, responses } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 401 });
    }

    // validate the fields
    if (
      !categoryId ||
      !quizId ||
      typeof score !== "number" ||
      !Array.isArray(responses)
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Record the quiz completion in MongoDB
    await mongoUserStore.recordQuizCompletion(walletAddress, {
      categoryId,
      quizId,
      score,
      responses,
      completedAt: new Date()
    });

    console.log("Quiz finished and recorded:", { walletAddress, categoryId, score });

    // Return the recorded data
    return NextResponse.json({
      success: true,
      walletAddress,
      categoryId,
      score,
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    console.log("Error finishing quiz: ", error);
    return NextResponse.json(
      { error: "Error finishing quiz" },
      { status: 500 }
    );
  }
}
