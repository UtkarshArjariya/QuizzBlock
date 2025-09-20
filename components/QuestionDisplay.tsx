import React from 'react';
import { IQuestion } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuestionDisplayProps {
  question: IQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  showCorrectAnswer?: boolean;
  isHost?: boolean;
  onAnswerSelect?: (optionId: string) => void;
  onSubmitAnswer?: () => void;
  isAnswerSubmitted?: boolean;
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showCorrectAnswer = false,
  isHost = false,
  onAnswerSelect,
  onSubmitAnswer,
  isAnswerSubmitted = false
}: QuestionDisplayProps) {
  const getOptionColor = (option: any) => {
    if (showCorrectAnswer) {
      if (option.isCorrect) return 'bg-green-100 border-green-500 text-green-800';
      if (selectedAnswer === option.id && !option.isCorrect) return 'bg-red-100 border-red-500 text-red-800';
      return 'bg-gray-50 border-gray-200';
    }
    
    if (selectedAnswer === option.id) {
      return 'bg-blue-100 border-blue-500 text-blue-800';
    }
    
    return 'bg-white border-gray-200 hover:bg-gray-50';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Question {questionNumber} of {totalQuestions}</span>
                    <span className="text-sm font-normal text-gray-500">
            {question.difficulty || 'Medium'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.text}
        </div>

        {/* Answer Options */}
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => !isHost && !isAnswerSubmitted && onAnswerSelect?.(option.id)}
              disabled={isHost || isAnswerSubmitted}
              className={`
                w-full p-4 text-left border-2 rounded-lg transition-all duration-200
                ${getOptionColor(option)}
                ${!isHost && !isAnswerSubmitted ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                ${isHost ? 'opacity-75' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option.text}</span>
                {showCorrectAnswer && option.isCorrect && (
                  <div className="flex-shrink-0 text-green-600">
                    ✓ Correct
                  </div>
                )}
                {selectedAnswer === option.id && !showCorrectAnswer && (
                  <div className="flex-shrink-0 text-blue-600">
                    Selected
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button for Participants */}
        {!isHost && selectedAnswer && !isAnswerSubmitted && (
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onSubmitAnswer}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
            >
              Submit Answer
            </Button>
          </div>
        )}

        {/* Answer Status */}
        {!isHost && isAnswerSubmitted && (
          <div className="text-center text-green-600 font-medium">
            ✓ Answer submitted! Waiting for next question...
          </div>
        )}

        {/* Host View Message */}
        {isHost && (
          <div className="text-center text-gray-500 text-sm">
            This is the current question being displayed to participants
          </div>
        )}
      </CardContent>
    </Card>
  );
}