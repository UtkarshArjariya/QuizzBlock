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
import { useWeb3 } from "@/context/SimpleWeb3Context";
import { ICategory } from "@/types/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { categories } = useGlobalContext();
  const { isConnected, isInitialized, connectWallet, isWalletInstalled } = useWeb3();

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Main Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to QuizBlock
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Master Web3, Blockchain, and cutting-edge technology with our interactive quizzes. 
          Join live events with real prizes or practice with our comprehensive tech question banks!
        </p>
      </div>


      {/* Upcoming Money Quizzes Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-center">Upcoming Money Quizzes</h2>
        <p className="text-gray-400 mb-8 text-center">
          Join these exciting quiz competitions and win real cash prizes!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quiz 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Crypto Mastery</h3>
                  <p className="text-sm text-gray-600">Blockchain & DeFi</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$500</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">Dec 15, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">7:00 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">15 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-red-600">$5</span>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Register Now
            </Button>
          </div>

          {/* Quiz 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">AI & Machine Learning</h3>
                  <p className="text-sm text-gray-600">Artificial Intelligence</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$750</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">Dec 18, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">8:30 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">20 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-red-600">$8</span>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Register Now
            </Button>
          </div>

          {/* Quiz 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Web3 Development</h3>
                  <p className="text-sm text-gray-600">Smart Contracts & DApps</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$1000</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">Dec 22, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">6:00 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">25 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-red-600">$10</span>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Register Now
            </Button>
          </div>

          {/* Quiz 4 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Cybersecurity</h3>
                  <p className="text-sm text-gray-600">Security & Privacy</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$300</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">Dec 25, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">9:00 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">12 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-red-600">$3</span>
              </div>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              Register Now
            </Button>
          </div>

          {/* Quiz 5 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">NFT & Metaverse</h3>
                  <p className="text-sm text-gray-600">Digital Assets</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$600</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">Dec 28, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">7:30 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">18 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-red-600">$6</span>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Register Now
            </Button>
          </div>

          {/* Quiz 6 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Cloud Computing</h3>
                  <p className="text-sm text-gray-600">AWS, Azure, GCP</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$400</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">Dec 30, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">8:00 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">16 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-red-600">$4</span>
              </div>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Register Now
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-center">Practice Categories</h2>
        <p className="text-gray-400 mb-8 text-center">
          Explore cutting-edge Web3 and tech quizzes - each category contains both practice quizzes and exciting live events with real prizes!
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
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">Web3 Events</h3>
          <p className="text-gray-600">Join blockchain and DeFi quiz competitions with real crypto prizes!</p>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-xl font-bold mb-2">Tech Quizzes</h3>
          <p className="text-gray-600">Master AR/VR, AI, and software development with our tech-focused questions.</p>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-gray-600">Monitor your Web3 and tech knowledge growth over time.</p>
        </div>
      </div>
    </div>
  );
}
