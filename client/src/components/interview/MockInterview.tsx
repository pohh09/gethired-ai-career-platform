import { useState } from "react";
import { CheckCircle2, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import ProgressBar from "./ProgressBar";
import type { InterviewQuestion } from "../../types/interview";

export interface MockInterviewProps {
  questions: InterviewQuestion[];
  onSaveSession?: (responses: Record<string, string>) => void;
  className?: string;
}

export default function MockInterview({
  questions = [],
  onSaveSession,
  className = "",
}: MockInterviewProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentResponseText, setCurrentResponseText] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const mockQuestions = questions.slice(0, 10);

  if (mockQuestions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        No mock interview questions available.
      </div>
    );
  }

  const currentQ = mockQuestions[currentIndex];
  const isLast = currentIndex === mockQuestions.length - 1;

  const handleNext = () => {
    const updated = { ...responses, [currentQ.id]: currentResponseText };
    setResponses(updated);

    if (isLast) {
      setIsCompleted(true);
      if (onSaveSession) onSaveSession(updated);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setCurrentResponseText(
        updated[mockQuestions[currentIndex + 1]?.id] || "",
      );
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResponses({});
    setCurrentResponseText("");
    setIsCompleted(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {!isCompleted ? (
        <>
          <ProgressBar
            current={currentIndex + 1}
            total={mockQuestions.length}
            label={`Mock Interview Round ${currentIndex + 1} of ${mockQuestions.length}`}
          />

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 uppercase tracking-wider">
                  {currentQ.type} Question
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                  {currentQ.difficulty}
                </span>
              </div>

              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                "{currentQ.question}"
              </h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Answer Response Notes
              </label>
              <Textarea
                rows={5}
                value={currentResponseText}
                onChange={(e) => setCurrentResponseText(e.target.value)}
                placeholder="Type your response notes using the STAR method (Situation, Task, Action, Result)..."
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">
                {Object.keys(responses).length} of {mockQuestions.length}{" "}
                Answered
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={
                  isLast ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />
                }
              >
                {isLast ? "Complete Mock Interview" : "Next Question"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold shadow-xs">
            <Trophy size={36} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Mock Interview Completed! 🎉
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You answered all 10 mock interview rounds. Review your answer
              notes and saved session metrics below.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={handleRestart}
              leftIcon={<RotateCcw size={16} />}
            >
              Start New Mock Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
