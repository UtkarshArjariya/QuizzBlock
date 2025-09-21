"use client";
import React from "react";
import UserStats from "@/components/UserStats";
import { useWeb3 } from "@/context/SimpleWeb3Context";
import { useEffect, useState } from "react";

function StatsPage() {
  const { account, isConnected } = useWeb3();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user?walletAddress=${account}`);
        if (response.ok) {
          const user = await response.json();
          setUserStats(user);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [account, isConnected]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">Connect Wallet</h1>
          <p className="text-gray-300">
            Please connect your wallet to view your statistics.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">No Stats Found</h1>
          <p className="text-gray-300">
            You haven't taken any quizzes yet. Start taking quizzes to see your statistics!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserStats userStats={userStats} />
    </div>
  );
}

export default StatsPage;
