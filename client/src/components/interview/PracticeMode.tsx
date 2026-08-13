import { useState } from "react";
import { ArrowRight, Eye, RefreshCw } from "lucide-react";
import Button from "../ui/Button";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import type { InterviewQuestion } from "../../types/interview";

export interface PracticeModeProps {
  questions: InterviewQuestion[];
  className?: string;
}

export default function PracticeMode({
  questions = [],
  className = "",
}: PracticeModeProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        No practice questions available.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        label={`Question ${currentIndex + 1} of ${questions.length}`}
      />

      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-6">
        <QuestionCard
          question={currentQuestion}
          initiallyExpanded={isAnswerRevealed}
        />

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
            leftIcon={<Eye size={14} />}
          >
            {isAnswerRevealed ? "Hide Answer" : "Reveal Answer"}
          </Button>

          {isLast ? (
            <Button
              variant="success"
              size="sm"
              onClick={handleReset}
              leftIcon={<RefreshCw size={14} />}
            >
              Restart Practice
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight size={14} />}
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
