import { NextRequest, NextResponse } from "next/server";
import { mongoUserStore } from "@/lib/mongoUserStore";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, username } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // Validate wallet address format (basic Ethereum address validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
    }

    // Create or update user in MongoDB
    const user = await mongoUserStore.upsertUser(walletAddress, {
      walletAddress: walletAddress,
      username: username
    });

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
      categoryStats: []
    };

    console.log("User registered in MongoDB:", walletAddress);
    return NextResponse.json(userResponse);
  } catch (error) {
    console.log("Error registering user: ", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
