import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // Validate wallet address format (basic Ethereum address validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
    }

    // For now, just return a mock user object (database setup is optional)
    const mockUser = {
      id: "mock-user-id",
      walletAddress: walletAddress,
      role: "user",
      categoryStats: []
    };

    console.log("User registered (mock):", walletAddress);
    return NextResponse.json(mockUser);
  } catch (error) {
    console.log("Error registering user: ", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
