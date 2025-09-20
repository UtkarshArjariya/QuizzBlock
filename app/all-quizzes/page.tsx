/**
 * All Quizzes Page Component
 * 
 * This page displays all quizzes from all categories in one place, including:
 * - All Live Quiz Events (with prizes and registration)
 * - All Practice Quizzes (regular quiz content)
 * 
 * The page is organized into two main sections:
 * 1. Event Quizzes - All special quizzes with prizes and registration fees
 * 2. Practice Quizzes - All regular quizzes for learning and practice
 * 
 * @returns JSX element for the all quizzes page
 */

import React from "react";
import { IQuiz } from "@/types/types";
import QuizCard from "@/components/quiz/QuizCard";
import EventQuizCard from "@/components/quiz/EventQuizCard";
import { getAllEventQuizzes } from "@/data/eventQuizzes";

async function AllQuizzesPage() {
  // Get all event quizzes
  const eventQuizzes = getAllEventQuizzes();

  // Mock regular quiz data for all categories (database setup is optional)
  const mockQuizzes: IQuiz[] = [
    // Physics & Science quizzes
    {
      id: "physics-1",
      title: "Physics Fundamentals",
      description: "Test your knowledge of basic physics concepts",
      image: "/categories/image--physics.svg",
      categoryId: "1",
      questions: [
        {
          id: "p1",
          text: "What is the SI unit of force?",
          difficulty: "easy",
          options: [
            { id: "pa1", text: "Newton", isCorrect: true },
            { id: "pa2", text: "Joule", isCorrect: false },
            { id: "pa3", text: "Watt", isCorrect: false },
            { id: "pa4", text: "Pascal", isCorrect: false }
          ]
        }
      ]
    },
    {
      id: "physics-2",
      title: "Quantum Mechanics Basics",
      description: "Explore the fascinating world of quantum physics",
      image: "/categories/image--science.svg",
      categoryId: "1",
      questions: [
        {
          id: "q1",
          text: "What is the uncertainty principle?",
          difficulty: "medium",
          options: [
            { id: "qa1", text: "Heisenberg's principle", isCorrect: true },
            { id: "qa2", text: "Einstein's principle", isCorrect: false },
            { id: "qa3", text: "Newton's principle", isCorrect: false },
            { id: "qa4", text: "Schrodinger's principle", isCorrect: false }
          ]
        }
      ]
    },
    // Computer Science & Technology quizzes
    {
      id: "cs-1",
      title: "Computer Science Basics",
      description: "Test your knowledge of fundamental computer science concepts",
      image: "/categories/image--computer-science.svg",
      categoryId: "2",
      questions: [
        {
          id: "c1",
          text: "What is the time complexity of binary search?",
          difficulty: "medium",
          options: [
            { id: "ca1", text: "O(n)", isCorrect: false },
            { id: "ca2", text: "O(log n)", isCorrect: true },
            { id: "ca3", text: "O(n²)", isCorrect: false },
            { id: "ca4", text: "O(1)", isCorrect: false }
          ]
        }
      ]
    },
    {
      id: "cs-2",
      title: "Programming Fundamentals",
      description: "Basic programming concepts and principles",
      image: "/categories/image--programming.svg",
      categoryId: "2",
      questions: [
        {
          id: "c2",
          text: "What is a variable in programming?",
          difficulty: "easy",
          options: [
            { id: "cb1", text: "A function", isCorrect: false },
            { id: "cb2", text: "A storage location", isCorrect: true },
            { id: "cb3", text: "A loop", isCorrect: false },
            { id: "cb4", text: "A class", isCorrect: false }
          ]
        }
      ]
    },
    // Mathematics quizzes
    {
      id: "math-1",
      title: "Calculus Basics",
      description: "Test your calculus knowledge",
      image: "/categories/image--mathematics.svg",
      categoryId: "3",
      questions: [
        {
          id: "m1",
          text: "What is the derivative of x²?",
          difficulty: "easy",
          options: [
            { id: "ma1", text: "2x", isCorrect: true },
            { id: "ma2", text: "x", isCorrect: false },
            { id: "ma3", text: "x²", isCorrect: false },
            { id: "ma4", text: "2", isCorrect: false }
          ]
        }
      ]
    },
    // Chemistry quizzes
    {
      id: "chem-1",
      title: "Chemical Reactions",
      description: "Learn about different types of chemical reactions",
      image: "/categories/image--chemistry.svg",
      categoryId: "4",
      questions: [
        {
          id: "ch1",
          text: "What is the chemical formula for water?",
          difficulty: "easy",
          options: [
            { id: "cha1", text: "H2O", isCorrect: true },
            { id: "cha2", text: "CO2", isCorrect: false },
            { id: "cha3", text: "NaCl", isCorrect: false },
            { id: "cha4", text: "O2", isCorrect: false }
          ]
        }
      ]
    },
    // Biology quizzes
    {
      id: "bio-1",
      title: "Cell Biology",
      description: "Test your knowledge of cell structures and functions",
      image: "/categories/image--biology.svg",
      categoryId: "5",
      questions: [
        {
          id: "b1",
          text: "What is the powerhouse of the cell?",
          difficulty: "easy",
          options: [
            { id: "ba1", text: "Mitochondria", isCorrect: true },
            { id: "ba2", text: "Nucleus", isCorrect: false },
            { id: "ba3", text: "Ribosome", isCorrect: false },
            { id: "ba4", text: "Golgi apparatus", isCorrect: false }
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          All Quizzes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore all available quizzes across all subjects. Join live events with real prizes 
          or practice with our extensive question banks covering Physics, Computer Science, 
          Mathematics, Chemistry, Biology, and more!
        </p>
      </div>

      {/* Event Quizzes Section */}
      {eventQuizzes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-600 mb-2">🎯 Live Quiz Events</h2>
              <p className="text-gray-600">Join exciting quiz competitions with real cash prizes!</p>
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
              {eventQuizzes.length} Events
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {eventQuizzes.map((quiz) => (
              <EventQuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      )}

      {/* Practice Quizzes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-2">📚 Practice Quizzes</h2>
            <p className="text-gray-600">Test your knowledge with these practice quizzes across all subjects</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
            {mockQuizzes.length} Quizzes
          </div>
        </div>
        
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

      {/* Summary Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quiz Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">{eventQuizzes.length}</div>
              <div className="text-gray-600">Live Events</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">{mockQuizzes.length}</div>
              <div className="text-gray-600">Practice Quizzes</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹{eventQuizzes.reduce((total, quiz) => total + (quiz.prize || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Prize Pool</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllQuizzesPage;
