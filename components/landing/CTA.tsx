import React from 'react';
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
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
}
