/**
 * Home Page Component
 * 
 * This is the main landing page of the Kwizi application. It provides:
 * - Welcome message and app introduction
 * - Category selection grid for users to choose subjects
 * - Feature highlights (Live Events, Practice Quizzes, Progress Tracking)
 * 
 * The page handles Web3 wallet connection and displays different content
 * based on connection status.
 * 
 * @returns JSX element for the home page
 */

"use client";

import HomeCard from "@/components/quiz/HomeCard";
import { useGlobalContext } from "@/context/globalContext";
import { useWeb3 } from "@/context/Web3Context";
import { ICategory } from "@/types/types";
import { Button } from "@/components/ui/button";

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
    <div>
      {/* Main Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to Kwizi
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Test your knowledge across various subjects with our interactive quizzes. 
          Join live events with real prizes or practice with our extensive question banks!
        </p>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Subject</h2>
        <p className="text-gray-400 mb-8 text-center">
          Explore quizzes by category - each category contains both practice quizzes and exciting live events!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: ICategory) => (
            <HomeCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Live Events</h3>
          <p className="text-gray-600">Join exciting quiz competitions with real cash prizes!</p>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">Practice Quizzes</h3>
          <p className="text-gray-600">Test your knowledge with our extensive question banks.</p>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-gray-600">Monitor your performance and improve over time.</p>
        </div>
      </div>
    </div>
  );
}
