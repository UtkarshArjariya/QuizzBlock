"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuiz, IQuestion, IOption } from "@/types/types";
import toast from "react-hot-toast";

interface CustomQuizCreatorProps {
  onQuizCreated: (quiz: IQuiz, prizeAmount: number) => void;
  onBack: () => void;
}

export default function CustomQuizCreator({
  onQuizCreated,
  onBack,
}: CustomQuizCreatorProps) {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [prizeAmount, setPrizeAmount] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      toast.error("Please enter a question");
      return;
    }

    const filledOptions = currentQuestion.options.filter((opt) =>
      opt.text.trim()
    );
    if (filledOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    const hasCorrectAnswer = currentQuestion.options.some(
      (opt) => opt.isCorrect && opt.text.trim()
    );
    if (!hasCorrectAnswer) {
      toast.error("Please mark at least one correct answer");
      return;
    }

    const newQuestion: IQuestion = {
      id: `custom-q${questions.length + 1}`,
      text: currentQuestion.text,
      difficulty: "medium",
      options: currentQuestion.options
        .filter((opt) => opt.text.trim())
        .map((opt, index) => ({
          id: `custom-q${questions.length + 1}-opt${index + 1}`,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      text: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    toast.success("Question added!");
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateCurrentQuestionText = (text: string) => {
    setCurrentQuestion({ ...currentQuestion, text });
  };

  const updateCurrentQuestionOption = (index: number, text: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], text };
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      isCorrect: !updatedOptions[index].isCorrect,
    };
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const createQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    if (prizeAmount <= 0) {
      toast.error("Please set a prize amount greater than 0");
      return;
    }

    const quiz: IQuiz = {
      id: `custom-${Date.now()}`,
      title: quizTitle,
      description: quizDescription || "Custom created quiz",
      categoryId: "custom",
      questions,
      isEvent: false,
      difficulty: "Mixed",
    };

    onQuizCreated(quiz, prizeAmount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Custom Quiz</h1>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quizTitle">Quiz Title</Label>
              <Input
                id="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <Label htmlFor="quizDescription">Description (Optional)</Label>
              <Input
                id="quizDescription"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Enter quiz description"
              />
            </div>

            <div>
              <Label htmlFor="prizeAmount">Prize Amount (AVAX)</Label>
              <Input
                id="prizeAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={isNaN(prizeAmount) ? "" : prizeAmount.toString()}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setPrizeAmount(isNaN(value) ? 0 : value);
                }}
                placeholder="Enter prize amount"
              />
            </div>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">Quiz Summary</h3>
              <p className="text-sm text-gray-600">
                Questions: {questions.length}
              </p>
              <p className="text-sm text-gray-600">Prize: {prizeAmount} AVAX</p>
            </div>

            {questions.length > 0 && (
              <Button onClick={createQuiz} className="w-full mt-4">
                Create Quiz & Host Live Session
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Question Creator */}
        <Card>
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="questionText">Question</Label>
              <Input
                id="questionText"
                value={currentQuestion.text}
                onChange={(e) => updateCurrentQuestionText(e.target.value)}
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-3">
              <Label>Answer Options</Label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.text}
                    onChange={(e) =>
                      updateCurrentQuestionOption(index, e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <button
                    onClick={() => toggleCorrectAnswer(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      option.isCorrect ? "bg-green-500" : "bg-gray-300"
                    }`}
                    title={
                      option.isCorrect ? "Correct answer" : "Mark as correct"
                    }
                  >
                    ✓
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-500">
                Click the ✓ button to mark correct answers. You can mark
                multiple correct answers.
              </p>
            </div>

            <Button onClick={addQuestion} className="w-full">
              Add Question
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">
                        {index + 1}. {question.text}
                      </h4>
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={option.id}
                            className={`text-sm p-2 rounded ${
                              option.isCorrect
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                            {option.isCorrect && " ✓"}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
