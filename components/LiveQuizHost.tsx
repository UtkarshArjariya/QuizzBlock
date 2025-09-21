"use client";

import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocketAPI";
import { useWeb3 } from "@/context/SimpleWeb3Context";
import {
  ILiveQuizSession,
  IQuiz,
  IQuestion,
  ILiveParticipant,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuestionDisplay from "@/components/QuestionDisplay";
import toast from "react-hot-toast";

interface LiveQuizHostProps {
  quiz: IQuiz;
  customPrizeAmount?: number;
  onClose: () => void;
}

export default function LiveQuizHost({
  quiz,
  customPrizeAmount,
  onClose,
}: LiveQuizHostProps) {
  const { isConnected, account } = useWeb3();
  const {
    isConnected: socketConnected,
    createQuiz,
    startQuiz,
    nextQuestion,
    endQuiz,
    onQuizCreated,
    onQuizStarted,
    onQuestionChanged,
    onQuizEnded,
    onParticipantJoined,
    onParticipantLeft,
    onError,
  } = useWebSocket();

  const [prizeAmount, setPrizeAmount] = useState<number>(
    customPrizeAmount || 0
  );
  const [session, setSession] = useState<ILiveQuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(
    null
  );
  const [participants, setParticipants] = useState<ILiveParticipant[]>([]); // Polling to check for new participants
  useEffect(() => {
    if (!session?.code) {
      console.log("No session code available for polling");
      return;
    }

    console.log("Starting polling for session:", session.code);
    let previousParticipantCount = participants.length;
    let retryCount = 0;
    const maxRetries = 3;

    const pollForParticipants = async () => {
      try {
        console.log("Polling for participants with code:", session.code);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`/api/quiz-sessions/${session.code}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(`Polling failed with status: ${response.status}`);
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error("Max retries reached for polling");
          }
          return;
        }

        const data = await response.json();

        if (data.success && data.session) {
          const newParticipants = data.session.participants;
          setParticipants(newParticipants);

          // Check for new participants and show toast
          if (newParticipants.length > previousParticipantCount) {
            const newCount = newParticipants.length - previousParticipantCount;
            toast.success(`${newCount} new participant(s) joined!`);
          }
          previousParticipantCount = newParticipants.length;

          // Update session with latest data
          setSession(data.session);

          // Reset retry count on success
          retryCount = 0;
        } else {
          console.log("Session not found or invalid response:", data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Polling request timed out");
        } else {
          console.error("Error polling for participants:", error);
        }
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error("Max retries reached, stopping polling for this cycle");
        }
      }
    };

    // Poll every 3 seconds
    const pollInterval = setInterval(pollForParticipants, 3000);

    // Initial poll after a short delay
    const initialPoll = setTimeout(pollForParticipants, 1000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(initialPoll);
    };
  }, [session?.code]); // Only depend on session code

  useEffect(() => {
    onQuizCreated((data: { session: ILiveQuizSession }) => {
      setSession(data.session);
      setParticipants(data.session.participants);
      toast.success(`Quiz created! Code: ${data.session.code}`);
    });

    onQuizStarted(
      (data: {
        sessionId: string;
        currentQuestion: IQuestion;
        timeLimit: number;
      }) => {
        setCurrentQuestion(data.currentQuestion);
        toast.success("Quiz started!");
      }
    );

    onQuestionChanged(
      (data: {
        questionIndex: number;
        question: IQuestion;
        timeLimit: number;
        timeLeft: number;
      }) => {
        setCurrentQuestion(data.question);
      }
    );

    onQuizEnded((data: { results: any }) => {
      toast.success("Quiz ended! Redirecting to results...");
      // Redirect to results page for host
      setTimeout(() => {
        window.location.href = "/results";
      }, 1500);
    });

    onParticipantJoined(
      (data: { participant: ILiveParticipant; session?: ILiveQuizSession }) => {
        setParticipants((prev) => {
          const existing = prev.find((p) => p.id === data.participant.id);
          if (existing) return prev;
          return [...prev, data.participant];
        });
        toast.success(
          `${data.participant.walletAddress.slice(0, 6)}... joined!`
        );
      }
    );

    onParticipantLeft(
      (data: { participantId: string; totalParticipants: number }) => {
        setParticipants((prev) =>
          prev.filter((p) => p.id !== data.participantId)
        );
      }
    );

    onError((data: { message: string; code?: string }) => {
      toast.error(data.message);
    });
  }, []);

  const handleCreateQuiz = () => {
    if (!isConnected || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (prizeAmount <= 0) {
      toast.error("Prize amount must be greater than 0");
      return;
    }

    createQuiz(quiz, prizeAmount, account);
  };

  const handleStartQuiz = () => {
    if (!session) return;
    startQuiz(session.id, session.hostWallet);
  };

  const handleNextQuestion = () => {
    if (!session) return;
    nextQuestion(session.id, session.hostWallet);
  };

  const handleEndQuiz = () => {
    if (!session) return;
    endQuiz(session.id, session.hostWallet);
  };

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to host a live quiz.</p>
        </CardContent>
      </Card>
    );
  }

  if (!socketConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connecting...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connecting to quiz server...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Host Live Quiz</h1>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Live Quiz Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
              <p className="text-sm text-gray-500">
                {quiz.questions.length} questions
              </p>
            </div>

            <div>
              <Label htmlFor="prizeAmount">Prize Amount (AVAX)</Label>
              <Input
                id="prizeAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={isNaN(prizeAmount) ? "" : prizeAmount.toString()}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setPrizeAmount(isNaN(value) ? 0 : value);
                }}
                placeholder="Enter prize amount"
              />
            </div>

            <Button onClick={handleCreateQuiz} disabled={!prizeAmount}>
              Create Quiz Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Current Question Display */}
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={(session?.currentQuestionIndex || 0) + 1}
              totalQuestions={session?.quiz.questions.length || 0}
              isHost={true}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quiz Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p>
                    <strong>Quiz Code:</strong> {session.code}
                  </p>
                  <p>
                    <strong>Status:</strong> {session.status}
                  </p>
                  <p>
                    <strong>Prize:</strong> {session.prizeAmount} AVAX
                  </p>
                  <p>
                    <strong>Participants:</strong>{" "}
                    <span
                      className={`font-bold ${
                        participants.length > 0
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {participants.length}
                    </span>
                    {participants.length === 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Waiting for participants...)
                      </span>
                    )}
                  </p>
                  {session.status === "active" && (
                    <p>
                      <strong>Progress:</strong> Question{" "}
                      {(session.currentQuestionIndex || 0) + 1} of{" "}
                      {session.quiz.questions.length}
                    </p>
                  )}
                </div>

                {session.status === "waiting" && (
                  <Button
                    onClick={handleStartQuiz}
                    disabled={participants.length === 0}
                    className={
                      participants.length > 0
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {participants.length === 0
                      ? "Waiting for Participants..."
                      : `Start Quiz (${participants.length} participant${
                          participants.length > 1 ? "s" : ""
                        })`}
                  </Button>
                )}

                {session.status === "active" && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full"
                      disabled={!currentQuestion}
                    >
                      {(session.currentQuestionIndex || 0) + 1 >=
                      session.quiz.questions.length
                        ? "Finish Quiz"
                        : "Next Question"}
                    </Button>
                    <Button
                      onClick={handleEndQuiz}
                      variant="destructive"
                      className="w-full"
                    >
                      End Quiz Early
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card>
              <CardHeader>
                <CardTitle>Participants ({participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">
                          {participant.username ||
                            `${participant.walletAddress.slice(
                              0,
                              6
                            )}...${participant.walletAddress.slice(-4)}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Score: {participant.score}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Rank: {participant.rank || "-"}
                        </p>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            participant.isConnected
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  {participants.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No participants yet. Share the quiz code:{" "}
                      <strong>{session.code}</strong>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
