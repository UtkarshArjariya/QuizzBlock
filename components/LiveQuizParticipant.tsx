"use client";

import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocketAPI";
import { useWeb3 } from "@/context/SimpleWeb3Context";
import {
  ILiveQuizSession,
  ILiveParticipant,
  IQuestion,
  ILiveAnswer,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuestionDisplay from "@/components/QuestionDisplay";
import toast from "react-hot-toast";

interface LiveQuizParticipantProps {
  onClose: () => void;
}

export default function LiveQuizParticipant({
  onClose,
}: LiveQuizParticipantProps) {
  const { isConnected, account } = useWeb3();
  const {
    isConnected: socketConnected,
    joinQuiz,
    submitAnswer,
    leaveQuiz,
    onQuizStarted,
    onQuestionChanged,
    onQuizEnded,
    onParticipantJoined,
    onError,
  } = useWebSocket();

  const [quizCode, setQuizCode] = useState("");
  const [username, setUsername] = useState("");
  const [session, setSession] = useState<ILiveQuizSession | null>(null);
  const [participant, setParticipant] = useState<ILiveParticipant | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [participants, setParticipants] = useState<ILiveParticipant[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  useEffect(() => {
    onParticipantJoined(
      (data: { participant: ILiveParticipant; session?: ILiveQuizSession }) => {
        if (data.session && data.participant.walletAddress === account) {
          setSession(data.session);
          setParticipant(data.participant);
          toast.success(`Joined quiz: ${data.session.quiz.title}`);
        }
      }
    );

    onQuizStarted(
      (data: {
        sessionId: string;
        currentQuestion: IQuestion;
        timeLimit: number;
      }) => {
        setCurrentQuestion(data.currentQuestion);
        setCurrentQuestionIndex(0);
        setHasAnswered(false);
        setSelectedOption("");
        setQuestionStartTime(Date.now());
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
        setCurrentQuestionIndex(data.questionIndex);
        setHasAnswered(false);
        setSelectedOption("");
        setQuestionStartTime(Date.now());
      }
    );

    onQuizEnded((data: { results: any }) => {
      toast.success("Quiz ended! Redirecting to results...");
      // Redirect to results page for participants
      setTimeout(() => {
        window.location.href = "/results";
      }, 1500);
    });

    onError((data: { message: string; code?: string }) => {
      toast.error(data.message);
    });
  }, [participant, account]);

  // Polling for quiz status and current question updates
  useEffect(() => {
    if (!session?.code) return;

    const pollForQuizUpdates = async () => {
      try {
        const response = await fetch(`/api/quiz-sessions/${session.code}`);
        if (!response.ok) return;

        const data = await response.json();
        if (data.success && data.session) {
          const updatedSession = data.session;

          // Update session state
          setSession(updatedSession);

          // Check if quiz status changed
          if (
            updatedSession.status === "active" &&
            session.status === "waiting"
          ) {
            toast.success("Quiz started!");
          }

          // Update current question if quiz is active
          if (
            updatedSession.status === "active" &&
            updatedSession.currentQuestionIndex >= 0
          ) {
            const currentQ =
              updatedSession.quiz.questions[
                updatedSession.currentQuestionIndex
              ];
            if (currentQ && currentQ.id !== currentQuestion?.id) {
              setCurrentQuestion(currentQ);
              setCurrentQuestionIndex(updatedSession.currentQuestionIndex);
              setHasAnswered(false);
              setSelectedOption("");
              setQuestionStartTime(Date.now());

              if (currentQuestion) {
                toast("New question available!");
              }
            }
          }

          // Check if quiz ended
          if (updatedSession.status === "ended" && session.status !== "ended") {
            toast.success("Quiz ended! Check results.");
            setCurrentQuestion(null);
          }
        }
      } catch (error) {
        console.error("Error polling for quiz updates:", error);
      }
    };

    // Poll every 2 seconds
    const pollInterval = setInterval(pollForQuizUpdates, 2000);

    // Initial poll
    const initialPoll = setTimeout(pollForQuizUpdates, 500);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(initialPoll);
    };
  }, [session?.code, session?.status, currentQuestion?.id]);

  const handleJoinQuiz = () => {
    if (!isConnected || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!quizCode || quizCode.length !== 6) {
      toast.error("Please enter a valid 6-character quiz code");
      return;
    }

    joinQuiz(quizCode.toUpperCase(), account, username);
  };

  const handleSubmitAnswer = async () => {
    if (!session || !participant || !currentQuestion || !selectedOption) {
      return;
    }

    try {
      const response = await fetch("/api/quiz-sessions/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          participantId: participant.id,
          questionId: currentQuestion.id,
          optionId: selectedOption,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHasAnswered(true);
        // Update participant score
        setParticipant((prev) =>
          prev ? { ...prev, score: data.score } : null
        );

        if (data.isCorrect) {
          toast.success("Correct answer! 🎉");
        } else {
          toast("Answer submitted!");
        }
      } else {
        toast.error(data.error || "Failed to submit answer");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    }
  };

  const handleLeaveQuiz = () => {
    if (session && participant) {
      leaveQuiz(session.id, participant.id);
    }
    onClose();
  };

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to join a live quiz.</p>
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
        <h1 className="text-3xl font-bold">Join Live Quiz</h1>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>Join Quiz Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quizCode">Quiz Code</Label>
              <Input
                id="quizCode"
                type="text"
                maxLength={6}
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="uppercase"
              />
            </div>

            <div>
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <Button onClick={handleJoinQuiz} disabled={!quizCode}>
              Join Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{session.quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Status:</strong> {session.status}
                    </p>
                    <p>
                      <strong>Prize:</strong> {session.prizeAmount} AVAX
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Your Score:</strong> {participant?.score || 0}
                    </p>
                    <p>
                      <strong>Your Rank:</strong> {participant?.rank || "-"}
                    </p>
                  </div>
                </div>

                {session.status === "waiting" && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-800">
                      Waiting for host to start the quiz...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Question */}
            {currentQuestion && (
              <QuestionDisplay
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={session.quiz.questions.length}
                selectedAnswer={selectedOption}
                onAnswerSelect={setSelectedOption}
                onSubmitAnswer={handleSubmitAnswer}
                isAnswerSubmitted={hasAnswered}
              />
            )}
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {participants.slice(0, 10).map((p, index) => (
                  <div
                    key={p.id}
                    className={`flex justify-between items-center p-2 rounded ${
                      p.id === participant?.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">
                          {p.username || `${p.walletAddress.slice(0, 6)}...`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{p.score}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  onClick={handleLeaveQuiz}
                  variant="outline"
                  className="w-full"
                >
                  Leave Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
