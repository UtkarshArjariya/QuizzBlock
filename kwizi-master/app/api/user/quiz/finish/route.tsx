import { NextRequest, NextResponse } from "next/server";

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

    // Return mock category stat (database setup is optional)
    const mockStat = {
      id: "mock-stat-id",
      userId: "mock-user-id",
      categoryId: categoryId,
      attempts: 1,
      completed: 1,
      averageScore: score,
      lastAttempt: new Date().toISOString()
    };

    console.log("Quiz finished (mock):", { walletAddress, categoryId, score });
    return NextResponse.json(mockStat);
  } catch (error) {
    console.log("Error finishing quiz: ", error);
    return NextResponse.json(
      { error: "Error finishing quiz" },
      { status: 500 }
    );
  }
}
