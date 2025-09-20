"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { IQuiz } from "@/types/types";

interface Props {
  quiz: IQuiz;
}

function EventQuizCard({ quiz }: Props) {
  const router = useRouter();
  const { setSelectedQuiz } = useGlobalContext();

  const handleClick = () => {
    setSelectedQuiz(quiz);
    router.push(`/quiz/setup/${quiz.id}`);
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Registering for quiz:", quiz.id);
  };

  const slotsPercentage = quiz.totalSlots && quiz.slotsLeft 
    ? ((quiz.totalSlots - quiz.slotsLeft) / quiz.totalSlots) * 100 
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md mx-auto overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {quiz.creator?.charAt(0) || "K"}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm">{quiz.creator || "Krayonnz"}</h3>
            <p className="text-xs text-gray-500">
              {quiz.followers || "0.11M"} Followers • 2w
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-12 left-12 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-12 right-12 w-1 h-1 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <p className="text-sm opacity-80">{quiz.date}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                {quiz.title.split(":")[0] || quiz.title}
              </h1>
              {quiz.title.includes(":") && (
                <p className="text-sm text-white/80">
                  {quiz.title.split(":")[1]?.trim()}
                </p>
              )}
            </div>

            <div className="bg-yellow-400 text-black px-3 py-1 rounded-md text-center">
              <span className="font-bold">MAX PRIZE POOL ₹{quiz.prize || 2500}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">🏆</span>
            <span className="font-semibold">₹{quiz.prize || 2500}</span>
            <span className="text-blue-500 text-sm cursor-pointer">Details</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-400">📅</span>
          <span>{quiz.date}, {quiz.time}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-400">⏰</span>
          <span>{quiz.duration} | {quiz.questions?.length || 10} questions</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <span className="text-green-600">💡</span>
            {quiz.difficulty || "Beginner Brainiac"}
          </span>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="mb-2">{quiz.description}</p>
          <span className="text-blue-500 text-sm cursor-pointer">Read More</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{quiz.slotsLeft || 180} Slots Left</span>
            <span className="text-gray-600">{quiz.totalSlots || 350} Slots</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${100 - slotsPercentage}%` }}
            ></div>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Register for ₹{quiz.registrationFee || 10}
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <span className="text-lg">👍</span>
              <span className="text-sm">1 liked</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <span className="text-lg">💬</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <span className="text-lg">↗️</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-blue-600">
              <span className="text-lg">🎁</span>
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              <span className="text-lg">🔖</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventQuizCard;
