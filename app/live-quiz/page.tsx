"use client";

import { useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LiveQuizHost from "@/components/LiveQuizHost";
import LiveQuizParticipant from "@/components/LiveQuizParticipant";
import CustomQuizCreator from "@/components/CustomQuizCreator";
import { IQuiz, ICategory } from "@/types/types";
import { allAvailableQuizzes } from "@/data/allQuizzesSimple";

type ViewMode =
  | "menu"
  | "host"
  | "participant"
  | "select-quiz"
  | "create-custom"
  | "select-template";

// Fallback quiz in case import fails
const fallbackQuiz: IQuiz = {
  id: "sample-quiz",
  title: "Sample Quiz",
  description: "A basic quiz for testing live quiz functionality",
  image: "/categories/image--computer-science.svg",
  categoryId: "general",
  questions: [
    {
      id: "q1",
      text: "What is 2 + 2?",
      difficulty: "easy",
      options: [
        { id: "q1-opt1", text: "3", isCorrect: false },
        { id: "q1-opt2", text: "4", isCorrect: true },
        { id: "q1-opt3", text: "5", isCorrect: false },
        { id: "q1-opt4", text: "6", isCorrect: false },
      ],
    },
    {
      id: "q2",
      text: "What is the capital of France?",
      difficulty: "easy",
      options: [
        { id: "q2-opt1", text: "London", isCorrect: false },
        { id: "q2-opt2", text: "Berlin", isCorrect: false },
        { id: "q2-opt3", text: "Paris", isCorrect: true },
        { id: "q2-opt4", text: "Madrid", isCorrect: false },
      ],
    },
  ],
  isEvent: false,
  difficulty: "Easy",
};

export default function LiveQuizPage() {
  const { categories } = useGlobalContext();
  const [viewMode, setViewMode] = useState<ViewMode>("menu");
  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [customPrizeAmount, setCustomPrizeAmount] = useState<number>(0);

  // Use all available quizzes for live quiz hosting with fallback
  let availableQuizzes: IQuiz[] = [];
  try {
    availableQuizzes = allAvailableQuizzes || [];
  } catch (error) {
    console.error("Error loading quizzes:", error);
    availableQuizzes = [];
  }

  // If no quizzes loaded, use fallback
  if (availableQuizzes.length === 0) {
    availableQuizzes = [fallbackQuiz];
  }

  const allQuizzes = availableQuizzes.filter((quiz: IQuiz) => {
    return (
      quiz &&
      quiz.id &&
      quiz.title &&
      quiz.questions &&
      quiz.questions.length > 0
    );
  });

  const handleHostQuiz = () => {
    setViewMode("select-quiz");
  };

  const handleCreateCustomQuiz = () => {
    setViewMode("create-custom");
  };

  const handleSelectQuiz = (quiz: IQuiz) => {
    setSelectedQuiz(quiz);
    setViewMode("host");
  };

  const handleCustomQuizCreated = (quiz: IQuiz, prizeAmount: number) => {
    setSelectedQuiz(quiz);
    setCustomPrizeAmount(prizeAmount);
    setViewMode("host");
  };

  const handleJoinQuiz = () => {
    setViewMode("participant");
  };

  const handleBack = () => {
    setViewMode("menu");
    setSelectedQuiz(null);
    setCustomPrizeAmount(0);
  };

  if (viewMode === "host" && selectedQuiz) {
    return (
      <LiveQuizHost
        quiz={selectedQuiz}
        customPrizeAmount={customPrizeAmount}
        onClose={handleBack}
      />
    );
  }

  if (viewMode === "participant") {
    return <LiveQuizParticipant onClose={handleBack} />;
  }

  if (viewMode === "create-custom") {
    return (
      <CustomQuizCreator
        onQuizCreated={(quiz, prizeAmount) =>
          handleCustomQuizCreated(quiz, prizeAmount)
        }
        onBack={handleBack}
      />
    );
  }

  if (viewMode === "select-quiz") {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Choose Quiz Option</h1>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        </div>

        {/* Quiz Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-blue-700">
                Create Custom Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                Create your own quiz with custom questions, set your prize
                amount, and host immediately.
              </p>
              <Button onClick={handleCreateCustomQuiz} className="w-full">
                Create Custom Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-green-700">
                Use Template Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                Choose from pre-made quiz templates on various topics and set
                your prize amount.
              </p>
              <Button
                onClick={() => setViewMode("select-template")}
                className="w-full"
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (viewMode === "select-template") {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Select Quiz Template</h1>
          <Button variant="outline" onClick={() => setViewMode("select-quiz")}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allQuizzes.length > 0 ? (
            allQuizzes.map((quiz: IQuiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {quiz.description || "No description available"}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{quiz.questions?.length || 0} questions</span>
                    <span>{quiz.difficulty || "Medium"}</span>
                  </div>
                  <Button
                    onClick={() => handleSelectQuiz(quiz)}
                    className="w-full"
                  >
                    Host This Quiz
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  No Quizzes Available
                </h3>
                <p>
                  No quizzes are currently available for hosting. Please check
                  back later or create some quizzes first.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">
            Live Quiz Arena
          </h1>
          <p className="text-xl text-gray-700">
            Host or join real-time quiz competitions with crypto rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Host a Quiz */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-700">
                Host a Live Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-6">
                  Create a live quiz session, set prize amounts, and control the
                  quiz flow in real-time.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ Set custom prize amounts</li>
                  <li>✓ Control question timing</li>
                  <li>✓ Real-time participant tracking</li>
                  <li>✓ Automatic result generation</li>
                </ul>
                <Button
                  onClick={handleHostQuiz}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Host a Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Join a Quiz */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-purple-700">
                Join a Live Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-6">
                  Enter a quiz code to join a live competition and compete for
                  crypto prizes!
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ Real-time synchronization</li>
                  <li>✓ Live leaderboards</li>
                  <li>✓ Instant scoring</li>
                  <li>✓ Win crypto rewards</li>
                </ul>
                <Button
                  onClick={handleJoinQuiz}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Join a Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-700">
                <div>
                  <strong>1. Create/Join</strong>
                  <br />
                  Host creates a quiz with prize amount or participants join
                  with code
                </div>
                <div>
                  <strong>2. Play Together</strong>
                  <br />
                  All participants answer questions in sync with the host's
                  timing
                </div>
                <div>
                  <strong>3. Win Prizes</strong>
                  <br />
                  Top performers win crypto rewards based on score and speed
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
