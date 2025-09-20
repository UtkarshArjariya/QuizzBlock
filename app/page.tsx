"use client";

import HomeCard from "../components/quiz/HomeCard";
import { useGlobalContext } from "../context/globalContext";
import { useWeb3 } from "../context/Web3Context";
import { ICategory } from "@/types/types";
import { Button } from "@/components/ui/button";

// Inline SVG icons for the Features Grid
const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M11.54 22.351A2.454 2.454 0 0 1 11.54 18v-2.731a5.613 5.613 0 0 0-4.73 1.258A2.455 2.455 0 0 1 3 16.5V9.457c0-1.285.673-2.454 1.79-3.111l4.98-2.876a4.582 4.582 0 0 1 4.59 0l4.98 2.876c1.117.657 1.79 1.826 1.79 3.111V16.5c0 .762-.31 1.48-.845 2.012a2.455 2.455 0 0 1-4.73 1.258V18a2.454 2.454 0 0 1-.035 4.351Z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H2.25ZM.75 8.625a.75.75 0 0 1 .75-.75h14.25a.75.75 0 0 1 .75.75v10.375a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1-.75-.75V8.625ZM1.5 8.625h14.25V19.5H1.5V8.625Z" />
    <path d="M12.625 15.75a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a5.25 5.25 0 0 0 10.5 0v-3c0-2.9-2.35-5.25-5.25-5.25ZM3 16.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-3Z" clipRule="evenodd" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" />
    <path d="M12 1.5a.75.75 0 0 1 .75.75v19.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Z" />
    <path d="M1.5 12a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-1.5Z" />
  </svg>
);

const features = [
  {
    icon: <AwardIcon />,
    title: "Instant Rewards",
    description: "Winners receive crypto prizes directly to their wallet, powered by smart contracts on Avalanche.",
  },
  {
    icon: <LockIcon />,
    title: "On-Chain & Transparent",
    description: "All quizzes, scores, and prize pools are stored on the blockchain for verifiable fairness.",
  },
  {
    icon: <CommunityIcon />,
    title: "Community-Powered",
    description: "Anyone can create and host quizzes, turning their knowledge into a rewarding experience.",
  },
  {
    icon: <WalletIcon />,
    title: "Secure & Decentralized",
    description: "Kwizi is built for Web3, giving you full control over your assets with no central authority.",
  },
];

// Final CTA component merged into this file
const FinalCTA = () => (
  <section className="bg-blue-600 text-white py-20 px-8 text-center rounded-3xl mx-auto my-12 shadow-2xl max-w-7xl">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
        Ready to Start Your On-Chain Quizzing Journey?
      </h2>
      <p className="text-xl opacity-80 mb-10">
        Connect your wallet and dive into the world of decentralized knowledge.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <Button className="px-10 py-4 text-xl rounded-full font-bold bg-white text-blue-600 hover:bg-gray-200 transition-colors duration-300">
          Connect Wallet to Play
        </Button>
        <Button className="px-10 py-4 text-xl rounded-full font-bold border-2 border-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors duration-300">
          Become a Quiz Host
        </Button>
      </div>
    </div>
  </section>
);

const upcomingQuizzes = [
  { id: 1, title: 'Web3 Fundamentals', description: 'Test your knowledge on the basics of blockchain, crypto, and decentralized finance.', image: 'https://placehold.co/800x600/5050C8/FFFFFF?text=Web3+Quiz' },
  { id: 2, title: 'Avalanche Ecosystem', description: 'Dive deep into the Avalanche network and its key projects.', image: 'https://placehold.co/800x600/A567EA/FFFFFF?text=AVAX+Quiz' },
  { id: 3, title: 'Ethereum History', description: 'A fun quiz covering the key milestones in Ethereum\'s history.', image: 'https://placehold.co/800x600/9898E1/FFFFFF?text=ETH+Quiz' },
];

export default function Home() {
  const { categories } = useGlobalContext();
  const { isConnected, connectWallet, isMetaMaskInstalled } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* Top Navigation - Keep your existing code here */}

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-20 gap-12 flex-1">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight">
            Unlock Knowledge.<br />Earn Rewards.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Kwizi is your gateway to fun, interactive quizzes on the Avalanche network. Play quizzes to earn on-chain rewards or create your own to monetize your expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              onClick={connectWallet}
              disabled={isConnected}
              className="px-8 py-3 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 shadow-md disabled:bg-gray-400"
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
            <Button
              className="px-8 py-3 rounded-full text-lg font-bold bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors duration-300"
              onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
        {/* <div className="relative w-full max-w-lg h-64 md:h-96 lg:h-auto lg:w-1/2">
          <img
            src="https://placehold.co/800x600/E5E7EB/4B5563?text=Quiz+Hero+Image"
            alt="Quiz platform hero image"
            className="w-full h-full object-contain"
          />
        </div> */}
      </section>

      {/* Features Grid Section */}
      <section id="features-section" className="px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-4">Why Kwizi?</h2>
          <p className="text-lg text-gray-600 mb-12">The next generation of on-chain quizzing.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
                <div className="text-blue-600 mb-4 flex justify-center text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Catalog Section - Updated to Upcoming Quizzes */}
      <section id="catalog-section" className="px-8 py-12 bg-white/60">
        <h2 className="text-4xl font-bold text-center mb-4">Our Upcoming Quizzes</h2>
        <p className="text-gray-500 text-center mb-8">Get ready to play these exciting new quizzes launching soon!</p>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {upcomingQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
              <img src={quiz.image} alt={quiz.title} className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <Button className="w-full py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Final CTA Section - Placed after the Quiz Catalog */}
      <FinalCTA />
    </div>
  );
}
