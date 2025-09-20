import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 401 });
    }

    // Return mock user data (database setup is optional)
    const mockUser = {
      id: "mock-user-id",
      walletAddress: walletAddress,
      role: "user",
      categoryStats: []
    };

    console.log("User retrieved (mock):", walletAddress);
    return NextResponse.json(mockUser);
  } catch (error) {
    console.log("Error getting user: ", error);
    return NextResponse.json({ error: "Error getting user" }, { status: 500 });
  }
}
