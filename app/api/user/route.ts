import { NextRequest, NextResponse } from "next/server";
import { mongoUserStore } from "@/lib/mongoUserStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 401 });
    }

    // Get user from MongoDB
    let user = await mongoUserStore.getUserByWallet(walletAddress);

    // If user doesn't exist, create a new one
    if (!user) {
      user = await mongoUserStore.upsertUser(walletAddress, {
        walletAddress: walletAddress
      });
    }

    const userResponse = {
      id: walletAddress,
      walletAddress: user.walletAddress,
      username: user.username,
      role: "user",
      totalQuizzes: user.totalQuizzes,
      totalScore: user.totalScore,
      highestScore: user.highestScore,
      averageScore: user.averageScore,
      achievements: user.achievements,
      lastLoginAt: user.lastLoginAt,
      categoryStats: user.categoryStats || []
    };

    console.log("User retrieved from MongoDB:", walletAddress);
    return NextResponse.json(userResponse);
  } catch (error) {
    console.log("Error getting user: ", error);
    return NextResponse.json({ error: "Error getting user" }, { status: 500 });
  }
}
