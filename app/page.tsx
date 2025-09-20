"use client";

import HomeCard from "@/components/quiz/HomeCard";
import EventQuizCard from "@/components/quiz/EventQuizCard";
import { useGlobalContext } from "@/context/globalContext";
import { useWeb3 } from "@/context/Web3Context";
import { ICategory } from "@/types/types";
import { Button } from "@/components/ui/button";
import { eventQuizzes } from "@/data/eventQuizzes";

export default function Home() {
  const { categories } = useGlobalContext();
  const { isConnected, connectWallet, isMetaMaskInstalled } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* Top Navigation */}
      {/* ...existing code... */}
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 gap-12 flex-1">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight">
            Unlock Knowledge. <br /> Earn Rewards.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Kwizi is your gateway to fun, interactive quizzes on the Avalanche network. Challenge yourself, learn new things, and earn crypto rewards instantly!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Quiz Catalog</h1>
      <p className="text-gray-400 mt-2">Choose a category to start your quiz journey</p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {categories.map((category: ICategory) => (
          <HomeCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
