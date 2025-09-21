import React from "react";
import { Trophy, Medal, Award, Target, CheckCircle } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  walletAddress: string;
  username: string;
  score: number;
  questionsAttempted: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  rank: number;
}

interface SessionSummary {
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
}

interface LeaderboardProps {
  sessionSummary: SessionSummary;
  leaderboard: LeaderboardEntry[];
  currentUserWallet?: string;
  isHost?: boolean;
}

const formatDuration = (milliseconds: number | null) => {
  if (!milliseconds) return "N/A";
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
          #{rank}
        </span>
      );
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300";
    case 2:
      return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300";
    case 3:
      return "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300";
    default:
      return "bg-white border-gray-200";
  }
};

export default function Leaderboard({
  sessionSummary,
  leaderboard,
  currentUserWallet,
  isHost = false,
}: LeaderboardProps) {
  const currentUserEntry = leaderboard.find(
    (entry) => entry.walletAddress === currentUserWallet
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-900">
            {sessionSummary.quizTitle}
          </h2>
          <div className="flex justify-center items-center gap-6 mt-2 text-sm text-blue-700">
            <span>
              Code: <strong>{sessionSummary.sessionCode}</strong>
            </span>
            <span>
              Questions: <strong>{sessionSummary.totalQuestions}</strong>
            </span>
            <span>
              Participants: <strong>{sessionSummary.totalParticipants}</strong>
            </span>
            {sessionSummary.duration && (
              <span>
                Duration:{" "}
                <strong>{formatDuration(sessionSummary.duration)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Current User Highlight (for participants) */}
      {!isHost && currentUserEntry && (
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRankIcon(currentUserEntry.rank)}
              <div>
                <h3 className="font-semibold text-blue-900">Your Result</h3>
                <p className="text-sm text-blue-700">
                  Rank {currentUserEntry.rank} of{" "}
                  {sessionSummary.totalParticipants}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {currentUserEntry.score} pts
              </div>
              <div className="text-sm text-blue-700">
                {currentUserEntry.correctAnswers}/
                {currentUserEntry.questionsAttempted} correct (
                {currentUserEntry.accuracy}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </h3>

        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.id}
              className={`
                border-2 rounded-lg p-4 transition-all hover:shadow-md
                ${getRankColor(entry.rank)}
                ${
                  entry.walletAddress === currentUserWallet
                    ? "ring-2 ring-blue-400"
                    : ""
                }
              `}
            >
              <div className="flex items-center justify-between">
                {/* Left: Rank and User Info */}
                <div className="flex items-center gap-4">
                  {getRankIcon(entry.rank)}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {entry.username}
                      {entry.walletAddress === currentUserWallet && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.walletAddress.slice(0, 6)}...
                      {entry.walletAddress.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Center: Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>Attempted</span>
                    </div>
                    <div className="font-semibold">
                      {entry.questionsAttempted}/{entry.totalQuestions}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Correct</span>
                    </div>
                    <div className="font-semibold text-green-700">
                      {entry.correctAnswers}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-gray-600">Accuracy</div>
                    <div className="font-semibold">{entry.accuracy}%</div>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {entry.score}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Quiz Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {leaderboard.length > 0
                ? Math.max(...leaderboard.map((l) => l.score))
                : 0}
            </div>
            <div className="text-gray-600">Highest Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {leaderboard.length > 0
                ? Math.round(
                    leaderboard.reduce((sum, l) => sum + l.accuracy, 0) /
                      leaderboard.length
                  )
                : 0}
              %
            </div>
            <div className="text-gray-600">Avg Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {leaderboard.length > 0
                ? Math.round(
                    leaderboard.reduce(
                      (sum, l) => sum + l.questionsAttempted,
                      0
                    ) / leaderboard.length
                  )
                : 0}
            </div>
            <div className="text-gray-600">Avg Attempted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                leaderboard.filter(
                  (l) => l.questionsAttempted === l.totalQuestions
                ).length
              }
            </div>
            <div className="text-gray-600">Completed All</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        {isHost ? (
          <button
            onClick={() => (window.location.href = "/live-quiz")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Host Another Quiz
          </button>
        ) : (
          <>
            <button
              onClick={() => (window.location.href = "/stats")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              View My Stats
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Take Another Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
