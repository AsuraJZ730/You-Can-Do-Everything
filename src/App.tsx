import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Home } from "./components/Home";
import { Quiz } from "./components/Quiz";
import { Result } from "./components/Result";
import { questions } from "./data/questions";

type ViewState = "home" | "quiz" | "result";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleStart = () => {
    setCurrentView("quiz");
  };

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    // Calculate scores
    const newScores: Record<string, number> = {
      TF: 0, GM: 0, AU: 0, SE: 0, EC: 0, SV: 0, CH: 0, LS: 0
    };

    questions.forEach((q) => {
      const score = answers[q.id] || 0;
      newScores[q.type] += score;
    });

    setScores(newScores);
    setCurrentView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setScores({});
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {currentView === "home" && <Home key="home" onStart={handleStart} />}
        {currentView === "quiz" && (
          <Quiz
            key="quiz"
            currentIndex={currentIndex}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
          />
        )}
        {currentView === "result" && (
          <Result key="result" scores={scores} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
