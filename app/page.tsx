"use client";

import HomeCard from "@/components/quiz/HomeCard";
import EventQuizCard from "@/components/quiz/EventQuizCard";
import { useGlobalContext } from "@/context/globalContext";
import { useWeb3 } from "@/context/Web3Context";
import { ICategory } from "@/types/types";
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
      </section>

      {/* Event Quizzes Section */}
      <section className="px-8 py-12 space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold">Live Quiz Events</h1>
              <p className="text-gray-400 mt-2">Join exciting quiz competitions with real prizes!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
            {eventQuizzes.map((quiz) => (
              <EventQuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>

        {/* Regular Categories Section */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Quiz Categories</h2>
          <p className="text-gray-400 mb-6">Choose a category to start your quiz journey</p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {categories.map((category: ICategory) => (
              <HomeCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Catalog Section */}
      <section className="px-8 py-12 bg-white/60">
        <h2 className="text-4xl font-bold text-center mb-4">Quiz Catalog</h2>
        <p className="text-gray-500 text-center mb-8">Choose a category to start your quiz journey</p>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {categories.map((category: ICategory) => (
            <HomeCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Features Section (placeholder for next step) */}
      {/* <section className="..."> ... </section> */}

      {/* Footer (placeholder for next step) */}
      {/* <footer className="..."> ... </footer> */}
    </div>
  );
}
