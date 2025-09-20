import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Return mock data for now (database setup is optional)
    const mockCategories = [
      {
        id: "1",
        name: "Web3 & Blockchain",
        description: "DeFi, smart contracts, and blockchain technology",
        image: "/categories/image--computer-science.svg"
      },
      {
        id: "2", 
        name: "AI & Machine Learning",
        description: "Artificial intelligence and machine learning algorithms",
        image: "/categories/image--technology.svg"
      },
      {
        id: "3",
        name: "AR/VR & Metaverse", 
        description: "Augmented reality, virtual reality, and immersive tech",
        image: "/categories/image--technology.svg"
      },
      {
        id: "4",
        name: "Software Development",
        description: "Modern programming and development frameworks", 
        image: "/categories/image--programming.svg"
      },
      {
        id: "5",
        name: "Cybersecurity",
        description: "Security protocols and ethical hacking",
        image: "/categories/image--data-structures.svg"
      },
      {
        id: "6",
        name: "Cloud Computing",
        description: "AWS, Azure, and distributed systems",
        image: "/categories/image--computer-science.svg"
      }
    ];

    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error("There was an error getting Categories: ", error);
    
    return NextResponse.json(
      { error: "There was an error getting Categories" },
      {
        status: 500,
      }
    );
  }
}
