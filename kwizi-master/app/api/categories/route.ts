import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Return mock data for now (database setup is optional)
    const mockCategories = [
      {
        id: "1",
        name: "Computer Science",
        description: "Programming and computer science fundamentals",
        image: "/categories/image--computer-science.svg"
      },
      {
        id: "2", 
        name: "Physics",
        description: "Physics concepts and principles",
        image: "/categories/image--physics.svg"
      },
      {
        id: "3",
        name: "Chemistry", 
        description: "Chemical reactions and properties",
        image: "/categories/image--chemistry.svg"
      },
      {
        id: "4",
        name: "Biology",
        description: "Life sciences and biological processes", 
        image: "/categories/image--biology.svg"
      },
      {
        id: "5",
        name: "Data Structures",
        description: "Algorithms and data structure concepts",
        image: "/categories/image--data-structures.svg"
      },
      {
        id: "6",
        name: "Programming",
        description: "Programming languages and concepts",
        image: "/categories/image--programming.svg"
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
