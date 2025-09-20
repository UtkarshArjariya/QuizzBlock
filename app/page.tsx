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
  const { isConnected, isInitialized, connectWallet, isMetaMaskInstalled } = useWeb3();

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">Welcome to Kwizi</h1>
          <p className="text-gray-300 mb-6">
            Connect your MetaMask wallet to start taking quizzes on the Avalanche network.
          </p>
          {isMetaMaskInstalled() ? (
            <Button
              onClick={connectWallet}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-red-400 mb-4">MetaMask not detected</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Install MetaMask
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Event Quizzes Section */}
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
    </div>
  );
}
