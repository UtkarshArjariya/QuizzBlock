"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWeb3 } from "@/context/Web3Context";
import Leaderboard from "@/components/Leaderboard";
import Loader from "@/components/Loader";

interface LeaderboardData {
  sessionSummary: {
    sessionId: string;
    sessionCode: string;
    quizTitle: string;
    categoryId: string;
    totalQuestions: number;
    totalParticipants: number;
    status: string;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
  };
  leaderboard: Array<{
    id: string;
    walletAddress: string;
    username: string;
    score: number;
    questionsAttempted: number;
    correctAnswers: number;
    totalQuestions: number;
    accuracy: number;
    rank: number;
  }>;
}

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const { account, isConnected } = useWeb3();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsUpdating, setStatsUpdating] = useState(false);
  const [statsUpdated, setStatsUpdated] = useState(false);

  const sessionCode = searchParams.get("sessionCode");
  const isHost = searchParams.get("host") === "true";

  useEffect(() => {
    if (!sessionCode) {
      setError(
        "No session code provided. Please make sure you came from a completed quiz."
      );
      setLoading(false);
      return;
    }

    if (sessionCode === "undefined" || sessionCode === "null") {
      setError("Invalid session code. Please try completing the quiz again.");
      setLoading(false);
      return;
    }

    fetchLeaderboard();
  }, [sessionCode]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      console.log("Fetching leaderboard for session code:", sessionCode);

      const response = await fetch(
        `/api/quiz-sessions/leaderboard?sessionCode=${sessionCode}`
      );

      console.log("Leaderboard fetch response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Leaderboard fetch error:", errorText);
        throw new Error(`Failed to fetch leaderboard data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Leaderboard data received:", data);
      setLeaderboardData(data);

      // Auto-update participant stats if quiz is ended and we haven't updated yet
      if (data.sessionSummary.status === "ended" && !statsUpdated) {
        await updateParticipantStats();
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load leaderboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStats = async () => {
    try {
      setStatsUpdating(true);
      const response = await fetch("/api/quiz-sessions/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionCode }),
      });

      if (!response.ok) {
        throw new Error("Failed to update participant stats");
      }

      const result = await response.json();
      console.log("Stats update result:", result);
      setStatsUpdated(true);
    } catch (error) {
      console.error("Error updating participant stats:", error);
    } finally {
      setStatsUpdating(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">
            Connect Wallet
          </h1>
          <p className="text-gray-300">
            Please connect your wallet to view the leaderboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader />
          <p className="text-gray-400">Loading leaderboard...</p>
          {statsUpdating && (
            <p className="text-blue-400 text-sm">
              Updating participant statistics...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full"
            >
              Go Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
          <h1 className="text-2xl font-bold text-gray-300 mb-4">No Data</h1>
          <p className="text-gray-400">No leaderboard data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {statsUpdated && (
        <div className="max-w-4xl mx-auto px-6 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-green-700 text-sm">
              ✅ Participant statistics have been updated successfully!
            </p>
          </div>
        </div>
      )}

      <Leaderboard
        sessionSummary={leaderboardData.sessionSummary}
        leaderboard={leaderboardData.leaderboard}
        currentUserWallet={account}
        isHost={isHost}
      />
    </div>
  );
}
