/**
 * Category Page Component
 * 
 * This page displays all quizzes for a specific category, including:
 * - Live Quiz Events (with prizes and registration)
 * - Practice Quizzes (regular quiz content)
 * 
 * The page is organized into two main sections:
 * 1. Event Quizzes - Special quizzes with prizes and registration fees
 * 2. Practice Quizzes - Regular quizzes for learning and practice
 * 
 * @param params - Contains the categoryId from the URL
 * @returns JSX element for the category page
 */

import React from "react";
import { IQuiz } from "@/types/types";
import QuizCard from "@/components/quiz/QuizCard";
import EventQuizCard from "@/components/quiz/EventQuizCard";
import { getEventQuizzesByCategory } from "@/data/eventQuizzes";

async function page({ params }: any) {
  const { categoryId } = await params;

  if (!categoryId) {
    return null;
  }

  // Get event quizzes for this category
  const eventQuizzes = getEventQuizzesByCategory(categoryId);

  // Mock regular quiz data (database setup is optional)
  const mockQuizzes: IQuiz[] = [
    {
      id: "1",
      title: "Computer Science Basics",
      description: "Test your knowledge of fundamental computer science concepts",
      image: "/categories/image--computer-science.svg",
      categoryId: categoryId,
      questions: [
        {
          id: "1",
          text: "What is the time complexity of binary search?",
          difficulty: "medium",
          options: [
            { id: "1", text: "O(n)", isCorrect: false },
            { id: "2", text: "O(log n)", isCorrect: true },
            { id: "3", text: "O(n²)", isCorrect: false },
            { id: "4", text: "O(1)", isCorrect: false }
          ]
        },
        {
          id: "2", 
          text: "Which data structure follows LIFO principle?",
          difficulty: "easy",
          options: [
            { id: "1", text: "Queue", isCorrect: false },
            { id: "2", text: "Stack", isCorrect: true },
            { id: "3", text: "Array", isCorrect: false },
            { id: "4", text: "Linked List", isCorrect: false }
          ]
        }
      ]
    },
    {
      id: "2",
      title: "Programming Fundamentals",
      description: "Basic programming concepts and principles",
      image: "/categories/image--programming.svg",
      categoryId: categoryId,
      questions: [
        {
          id: "3",
          text: "What is a variable in programming?",
          difficulty: "easy",
          options: [
            { id: "1", text: "A function", isCorrect: false },
            { id: "2", text: "A storage location", isCorrect: true },
            { id: "3", text: "A loop", isCorrect: false },
            { id: "4", text: "A class", isCorrect: false }
          ]
        }
      ]
    }
  ];

  // Helper function to get category name
  const getCategoryName = (id: string) => {
    const categoryNames: { [key: string]: string } = {
      "1": "Physics & Science",
      "2": "Computer Science & Technology",
      "3": "Mathematics",
      "4": "Chemistry",
      "5": "Biology",
      "6": "Programming"
    };
    return categoryNames[id] || "Category";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">{getCategoryName(categoryId)} Quizzes</h1>

      {/* Event Quizzes Section */}
      {eventQuizzes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-purple-600">🎯 Live Quiz Events</h2>
          <p className="text-gray-600 mb-6">Join exciting quiz competitions with real prizes!</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {eventQuizzes.map((quiz) => (
              <EventQuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Quizzes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">📚 Practice Quizzes</h2>
        <p className="text-gray-600 mb-6">Test your knowledge with these practice quizzes</p>
        
        {mockQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-500">No practice quizzes available yet</h3>
            <p className="text-gray-400 mt-2">Check back later for new content!</p>
          </div>
        )}
      </div>

      {/* No quizzes message */}
      {eventQuizzes.length === 0 && mockQuizzes.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl text-gray-500">No quizzes found for this category</h2>
          <p className="text-gray-400 mt-2">Try exploring other categories!</p>
        </div>
      )}
    </div>
  );
}

export default page;
