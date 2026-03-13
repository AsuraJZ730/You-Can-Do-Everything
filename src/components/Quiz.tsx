import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { questions } from "../data/questions";

interface QuizProps {
  currentIndex: number;
  answers: Record<number, number>;
  onAnswer: (questionId: number, score: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  key?: string;
}

export function Quiz({
  currentIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onSubmit,
}: QuizProps) {
  const question = questions[currentIndex];
  const currentAnswer = answers[question.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col h-[100dvh] max-w-md mx-auto w-full p-4 sm:p-6"
    >
      {/* Header & Progress */}
      <div className="mb-4 sm:mb-8 shrink-0">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 text-[14px] px-3 py-2 sm:px-4 rounded-full transition-all ${
              currentIndex === 0
                ? "text-[#a0aec0] opacity-50 cursor-not-allowed"
                : "text-[#4a5568] neu-btn"
            }`}
          >
            <ChevronLeft className="w-4 h-4 -ml-1" />
            <span>上一题</span>
          </button>
          <span className="text-[14px] font-medium neu-text-primary neu-pressed-sm px-4 py-1.5 rounded-full">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-4 neu-pressed rounded-full p-1">
          <motion.div
            className="h-full bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="neu-flat p-6 sm:p-8 rounded-[24px] w-full"
        >
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#2d3748] leading-[1.5] text-center mb-6 sm:mb-10">
            {question.text}
          </h2>

          {/* Rating Selector */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between px-2 text-[12px] text-[#718096] font-medium">
              <span>完全不同意</span>
              <span>完全同意</span>
            </div>
            
            <div className="neu-pressed rounded-[32px] p-1.5 sm:p-2 flex justify-between items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6].map((score) => {
                const isSelected = currentAnswer === score;
                return (
                  <button
                    key={score}
                    onClick={() => onAnswer(question.id, score)}
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[14px] sm:text-[16px] font-bold transition-all duration-300 ${
                      isSelected 
                        ? "neu-flat neu-text-primary" 
                        : "text-[#718096] hover:neu-flat-sm"
                    }`}
                  >
                    <span className="relative z-10">{score}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 pb-4 sm:pb-6 shrink-0">
        <button
          onClick={isLast ? onSubmit : onNext}
          disabled={!currentAnswer}
          className={`w-full py-3.5 sm:py-4 px-8 rounded-[28px] text-[16px] sm:text-[18px] font-bold flex items-center justify-center transition-all duration-300 ${
            currentAnswer
              ? "neu-btn neu-text-primary"
              : "neu-pressed text-[#a0aec0] cursor-not-allowed"
          }`}
        >
          {isLast ? "查看结果" : "下一题"}
          {!isLast && <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </motion.div>
  );
}
