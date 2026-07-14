import { useState, useEffect } from "react";

export default function GenerationLoader() {
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <h3 className="text-xl font-medium text-gray-900">
        {timeLeft > 0 ? "Generating your question paper..." : "Still generating your question paper..."}
      </h3>
      {timeLeft > 0 && (
        <div className="text-2xl font-bold text-primary-600 font-mono">
          {formattedTime}
        </div>
      )}
      <p className="text-gray-500 text-sm text-center max-w-md">
        Our AI is analyzing the material and structuring the questions based on your requirements.
      </p>
    </div>
  );
}
