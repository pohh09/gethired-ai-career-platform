import { useState, useEffect } from "react";
import {
  Video,
  Play,
  Award,
  Sparkles,
  AlertTriangle,
  BarChart2,
  ArrowRight,
  RotateCcw,
  Check,
  HelpCircle as QuestionIcon,
  Clock,
  SkipForward,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Select from "../../ui/Select";
import { useResumeStore } from "../../../store/resumeStore";
import * as aiService from "../../../services/aiWorkspaceService";

interface SessionHistoryItem {
  question: string;
  userAnswer: string;
  score: number;
  verdict: string;
  accuracy: number;
  communication: number;
  correctness: number;
  relevanceScore: number;
  missingConcepts: string[];
  strengths: string[];
  betterAnswer?: string;
  idealAnswer?: string;
  timestamp: string;
}

const FEATURED_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "React Developer",
  "Angular Developer",
  "Node.js Developer",
  "Flutter Developer",
  "Python Developer",
  "Java Developer",
  "QA Engineer",
  "DevOps Developer",
  "Data Analyst",
  "AI Engineer",
];

export default function InterviewWorkspace() {
  const { activeResumeText, activeResumeFileName } = useResumeStore();

  const [jobTitle, setJobTitle] = useState("Full Stack Developer");
  const [roundType, setRoundType] = useState("technical");
  const [difficulty, setDifficulty] = useState("Standard");
  const [jobDescription, setJobDescription] = useState("");

  const [sessionStep, setSessionStep] = useState<"setup" | "active" | "report">("setup");
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>([]);
  const [finalReport, setFinalReport] = useState<any | null>(null);

  const [secondsRemaining, setSecondsRemaining] = useState(200);

  useEffect(() => {
    let interval: any = null;
    if (sessionStep === "active" && !evaluation) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStep, evaluation]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  const handleStartInterview = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please select a target job role");
      return;
    }
    setIsProcessing(true);
    try {
      const qData = await aiService.startInterviewSession({
        role: jobTitle,
        roundType,
        difficulty,
        resumeText: activeResumeText,
        jobDescription,
        count: 12,
      });

      if (!qData || qData.length === 0) {
        toast.error("No questions returned for this role and round.");
        return;
      }

      setQuestionsList(qData);
      setCurrentIndex(0);
      setUserAnswer("");
      setEvaluation(null);
      setSessionHistory([]);
      setFinalReport(null);
      setSecondsRemaining(200);
      setSessionStep("active");
      toast.success(`Started 12-Question ${difficulty} ${roundType.toUpperCase()} Interview!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to initialize interview session");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentQuestionObj = questionsList[currentIndex] || null;

  const handleSubmitAnswer = async () => {
    if (!currentQuestionObj) return;

    setIsProcessing(true);
    try {
      const evalResult = await aiService.evaluateInterviewAnswer({
        question: currentQuestionObj.question,
        userAnswer,
        role: jobTitle,
        roundType,
        difficulty,
        expectedTopics: currentQuestionObj.expectedTopics,
        strongAnswerContains: currentQuestionObj.strongAnswerContains,
        importantPoints: currentQuestionObj.importantPoints,
        commonMistakes: currentQuestionObj.commonMistakes,
        scoringRubric: currentQuestionObj.scoringRubric,
        resumeText: activeResumeText,
      });

      setEvaluation(evalResult);

      const scoreVal = evalResult.score ?? evalResult.overallScore ?? evalResult.correctness ?? 0;
      const verdict = evalResult.verdict || (scoreVal >= 75 ? "Correct" : scoreVal >= 40 ? "Partially Correct" : "Incorrect");

      if (verdict === "Correct") {
        toast.success(`Strong Answer! Score: ${scoreVal}/100`);
      } else if (verdict === "Partially Correct") {
        toast.error(`Partially Correct (${scoreVal}/100). Review missing points below.`);
      } else {
        toast.error(`Incorrect Answer (${scoreVal}/100). Review model answer below.`);
      }

      setSessionHistory((prev) => [
        ...prev,
        {
          question: currentQuestionObj.question,
          userAnswer: userAnswer || "[Empty Answer]",
          score: scoreVal,
          verdict,
          accuracy: evalResult.technicalAccuracyScore ?? scoreVal,
          communication: evalResult.communicationScore ?? 70,
          correctness: evalResult.correctness ?? scoreVal,
          relevanceScore: evalResult.relevanceScore ?? scoreVal,
          missingConcepts: evalResult.missingPoints || evalResult.missingConcepts || [],
          strengths: evalResult.strengths || [],
          betterAnswer: evalResult.betterAnswer || evalResult.idealAnswer || currentQuestionObj.strongAnswerContains,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to evaluate answer");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipQuestion = () => {
    setUserAnswer("[Skipped Question]");
    setEvaluation({
      score: 0,
      verdict: "Incorrect",
      technicalAccuracyScore: 0,
      completeness: 0,
      communicationScore: 0,
      strengths: ["Question was skipped"],
      missingPoints: ["No answer was provided"],
      betterAnswer: currentQuestionObj?.strongAnswerContains || "A complete response should explain architectural principles and state mechanisms.",
    });
    toast.error("Question skipped");
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questionsList.length) {
      const lastScore = evaluation?.score ?? evaluation?.overallScore ?? 80;
      try {
        const adaptiveRes = await aiService.generateAdaptiveNextQuestion({
          previousQuestion: currentQuestionObj.question,
          previousAnswer: userAnswer,
          previousScore: lastScore,
          currentDifficulty: difficulty,
          role: jobTitle,
          type: roundType,
          questionNumber: currentIndex + 1,
          totalQuestions: questionsList.length,
        });

        if (adaptiveRes?.nextQuestion) {
          const updated = [...questionsList];
          updated[currentIndex + 1] = adaptiveRes.nextQuestion;
          setQuestionsList(updated);
        }
      } catch (_e) {}

      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setEvaluation(null);
      setSecondsRemaining(200);
    } else {
      handleFinishSession();
    }
  };

  const handleFinishSession = async () => {
    setIsProcessing(true);
    try {
      const report = await aiService.generateFinalInterviewReport({
        sessionHistory,
        role: jobTitle,
        type: roundType,
      });
      setFinalReport(report);
      setSessionStep("report");
      toast.success("Interview session complete! Final performance report generated.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to generate final report");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* 1. HEADER & SETUP CARD */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0 shadow-2xs">
              <Video size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Interactive Mock Interview Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                12-question progressive rounds dynamically generated based on role, round type, and job description.
              </p>
            </div>
          </div>

          {activeResumeFileName && (
            <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 shrink-0">
              ✓ Active: {activeResumeFileName}
            </div>
          )}
        </div>

        {/* SETUP SCREEN */}
        {sessionStep === "setup" && (
          <div className="space-y-8 w-full">
            {/* 3-COLUMN EQUAL-WIDTH FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
              <Select
                label="Target Job Role"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full"
              >
                {FEATURED_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>

              <Select
                label="Interview Round"
                value={roundType}
                onChange={(e) => setRoundType(e.target.value)}
                className="w-full"
              >
                <option value="hr">HR & Culture Fit</option>
                <option value="behavioral">Behavioral (STAR)</option>
                <option value="technical">Technical Round</option>
                <option value="coding">Live Coding & Algorithms</option>
                <option value="system_design">System Design & Architecture</option>
                <option value="managerial">Managerial & Leadership</option>
                <option value="final">Final Round</option>
                <option value="leadership">Executive Leadership</option>
              </Select>

              <Select
                label="Difficulty Level"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full"
              >
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Standard">Standard (Mid-Level)</option>
                <option value="Advanced">Advanced (Senior)</option>
                <option value="Expert">Expert (Staff / Principal)</option>
              </Select>
            </div>

            <div className="w-full">
              <Textarea
                label="Job Description Context (Optional)"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description context to customize question focus..."
                className="w-full"
              />
            </div>

            {/* ACTION & SESSION INFORMATION CARD */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartInterview}
                isLoading={isProcessing}
                leftIcon={<Play size={18} />}
                className="bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 w-full sm:w-auto"
              >
                Start 12-Question Mock Interview
              </Button>

              {/* SESSION INFORMATION SUMMARY */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center w-full">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Questions</span>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 block mt-1">12 Questions</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Time</span>
                  <span className="text-sm font-black text-amber-600 block mt-1">25 Mins</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Difficulty</span>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 block mt-1">{difficulty}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Role Focus</span>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 truncate block mt-1">{jobTitle}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Round Focus</span>
                  <span className="text-sm font-black text-amber-600 uppercase block mt-1">{roundType}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE QUESTION SIMULATOR SCREEN */}
        {sessionStep === "active" && currentQuestionObj && (
          <div className="space-y-8 w-full">
            {/* TOP PROGRESS TRACK & CONTEXT HEADER */}
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide block">
                    {roundType.toUpperCase()} INTERVIEW • {jobTitle}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Category: <strong className="text-slate-800 dark:text-slate-200">{currentQuestionObj.category || jobTitle}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold font-mono">
                    <Clock size={14} className="text-amber-400" /> {formatTimer(secondsRemaining)}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-600 text-white text-xs font-black">
                    Question {currentIndex + 1} of {questionsList.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSessionStep("setup")}
                    className="text-xs text-slate-500 hover:underline font-bold"
                  >
                    Exit
                  </button>
                </div>
              </div>

              {/* PROGRESS BAR TRACK */}
              <div className="w-full bg-amber-200/60 dark:bg-amber-950 rounded-full h-2.5 overflow-hidden flex">
                {questionsList.map((_, i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 border-r border-amber-500/20 transition-all ${
                      i < currentIndex
                        ? "bg-emerald-600"
                        : i === currentIndex
                        ? "bg-amber-600 animate-pulse"
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* VISUALLY DOMINANT QUESTION DISPLAY CARD */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl relative overflow-hidden w-full">
              <div className="flex items-center justify-between text-xs font-black text-amber-400">
                <span className="flex items-center gap-2 uppercase tracking-wider">
                  <QuestionIcon size={16} /> Question {currentIndex + 1} of {questionsList.length}
                </span>
                <span className="text-slate-400 text-xs">
                  Difficulty: <strong className="text-white">{currentQuestionObj.difficulty || difficulty}</strong>
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white leading-relaxed">
                {currentQuestionObj.question}
              </h3>
              {currentQuestionObj.expectedTopics && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold">Expected Topics:</span>
                  {(currentQuestionObj.expectedTopics || []).map((t: string) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ANSWER INPUT AREA */}
            <div className="space-y-4 w-full">
              <Textarea
                label="Your Technical Answer"
                rows={7}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your structured answer here (explain principles, tradeoffs, implementation details)..."
                disabled={evaluation !== null}
                className="w-full"
              />

              {!evaluation ? (
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmitAnswer}
                    isLoading={isProcessing}
                    leftIcon={<Award size={18} />}
                    className="bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 w-full sm:w-auto"
                  >
                    Submit Answer for Evaluation
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSkipQuestion}
                    leftIcon={<SkipForward size={16} />}
                    className="w-full sm:w-auto"
                  >
                    Skip Question
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextQuestion}
                  isLoading={isProcessing}
                  rightIcon={<ArrowRight size={18} />}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 w-full sm:w-auto"
                >
                  {currentIndex + 1 < questionsList.length
                    ? `Proceed to Question ${currentIndex + 2} of ${questionsList.length}`
                    : "View Final Performance Report"}
                </Button>
              )}
            </div>

            {/* EVALUATION RESULTS CARD */}
            {evaluation && (
              <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 w-full">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <Sparkles size={20} className="text-amber-500" />
                    Answer Rubric Evaluation
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase ${
                      evaluation.verdict === "Correct" ? "bg-emerald-100 text-emerald-800" :
                      evaluation.verdict === "Partially Correct" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      Verdict: {evaluation.verdict || (evaluation.score >= 75 ? "Correct" : evaluation.score >= 40 ? "Partially Correct" : "Incorrect")}
                    </span>
                    <div className={`px-3.5 py-1 rounded-full text-xs font-black text-white ${
                      evaluation.score >= 75 ? "bg-emerald-600" : evaluation.score >= 40 ? "bg-amber-600" : "bg-rose-600"
                    }`}>
                      Score: {evaluation.score ?? evaluation.overallScore}/100
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Overall Score</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 my-1">{evaluation.score ?? evaluation.overallScore}/100</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Tech Accuracy</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 my-1">{evaluation.technicalAccuracyScore ?? evaluation.correctness}%</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">Completeness</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 my-1">{evaluation.completeness}%</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">Communication</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 my-1">{evaluation.communicationScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 block flex items-center gap-2 uppercase tracking-wider">
                      <Check size={16} className="text-emerald-600" /> ✓ What You Did Well:
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {(evaluation.strengths || ["Answered the prompt"]).map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2.5">
                    <span className="text-xs font-black text-rose-900 dark:text-rose-200 block flex items-center gap-2 uppercase tracking-wider">
                      <AlertTriangle size={16} className="text-rose-600" /> ⚠ Missing Points / Errors:
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-rose-800 dark:text-rose-200 font-medium">
                      {(evaluation.missingPoints || evaluation.missingConcepts || ["No additional missing points"]).map((m: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(evaluation.betterAnswer || evaluation.idealAnswer) && (
                  <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                    <span className="text-xs font-black text-amber-900 dark:text-amber-200 block uppercase tracking-wider">
                      💡 Ideal Model Answer:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      "{evaluation.betterAnswer || evaluation.idealAnswer}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* FINAL PERFORMANCE REPORT DASHBOARD */}
        {sessionStep === "report" && finalReport && (
          <div className="space-y-8 pt-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                  <BarChart2 size={22} className="text-amber-500" />
                  Interview Complete — Final Performance Report
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{jobTitle} • {roundType.toUpperCase()} Session Summary ({sessionHistory.length} Questions)</p>
              </div>

              <span className="text-sm font-black px-5 py-2 rounded-full bg-amber-600 text-white shadow-md shrink-0">
                Overall Grade: {finalReport.grade}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Overall Score</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 my-1.5">{finalReport.overallScore}/100</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Technical Score</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 my-1.5">{finalReport.technicalScore}%</span>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">Communication</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 my-1.5">{finalReport.communicationScore}%</span>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">Role Relevance</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 my-1.5">{finalReport.roleRelevanceScore || finalReport.accuracyScore}%</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setSessionStep("setup")}
              leftIcon={<RotateCcw size={18} />}
              className="bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 w-full sm:w-auto"
            >
              Start New Mock Interview Session
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
