import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { walletAddress, categoryId } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 401 });
  }

  try {
    // Return mock category stat (database setup is optional)
    const mockStat = {
      id: "mock-stat-id",
      userId: "mock-user-id",
      categoryId: categoryId,
      attempts: 1,
      completed: 0,
      averageScore: null,
      lastAttempt: new Date().toISOString()
    };

    console.log("Quiz started (mock):", { walletAddress, categoryId });
    return NextResponse.json(mockStat);
  } catch (error) {
    console.log("Error starting quiz: ", error);
    return NextResponse.json({ error: "Error starting quiz" }, { status: 500 });
  }
}
