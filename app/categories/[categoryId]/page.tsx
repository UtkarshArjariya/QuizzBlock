import React from "react";
import { IQuiz } from "@/types/types";
import QuizCard from "@/components/quiz/QuizCard";

async function page({ params }: any) {
  const { categoryId } = await params;

  if (!categoryId) {
    return null;
  }

  // Mock quiz data (database setup is optional)
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

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">All Quizzes</h1>

      {mockQuizzes.length > 0 ? (
        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
          {mockQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <h1 className="text-2xl text-center mt-4">
          No quizzes found for this Category
        </h1>
      )}
    </div>
  );
}

export default page;
