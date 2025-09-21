"use client";
import { useEffect, useState } from "react";

export default function SimpleLeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [sessionCode, setSessionCode] = useState<string>("");
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("sessionCode");
      if (code && code !== "undefined") {
        setSessionCode(code);
        setMessage(
          `Quiz session ${code} has ended! Check back later for detailed results.`
        );
      } else {
        setMessage("No valid session code found.");
      }
    }
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
