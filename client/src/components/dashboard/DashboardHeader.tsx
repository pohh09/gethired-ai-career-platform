import { useMemo } from "react";
import { Plus, CalendarDays } from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

export interface DashboardHeaderProps {
  onAddJobClick?: () => void;
  className?: string;
}

const MORNING_PHRASES = [
  "Morning! How’s it going?",
  "A lovely morning to you.",
  "Wishing you a good start to the day.",
  "A fresh day, a fresh start.",
  "Here’s to a good day ahead.",
  "Hey! Glad you’re here.",
  "Hey, good to see you!",
];

const AFTERNOON_PHRASES = [
  "Hope your day’s treating you well.",
  "Hey! What are we getting into today?",
  "Hope today’s being kind to you.",
  "Sending a little good energy your way.",
  "Well, hello there.",
  "Hi hi! 👋",
  "Hey there 👋",
  "Hey, good to see you!",
];

const EVENING_PHRASES = [
  "Hope your day’s treating you well.",
  "Hey! Glad you’re here.",
  "Sending a little good energy your way.",
  "Hey, good to see you!",
  "Well, hello there.",
  "Hey there 👋",
];

const LATE_NIGHT_PHRASES = [
  "Late-night brain online. What’s up?",
  "The world’s asleep. We’re still working.",
  "Quiet hours. What are we solving tonight?",
  "Night mode: activated. 🌙",
  "It’s late, but I’m here. What’s on your mind?",
  "Another late-night mission?",
  "Alright, night owl. What’s the plan?",
  "Still up? 🌙",
  "A quiet night to you.",
  "Hope the night’s treating you gently.",
  "Late-night hello 🌙",
  "Good to see you at this hour.",
  "The night shift begins.",
  "Ah, a late-night visit.",
];

export default function DashboardHeader({
  onAddJobClick,
  className = "",
}: DashboardHeaderProps) {
  const { user } = useAuthStore();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let phraseList: string[];
    let subtitle = "Keep tracking your applications and stay consistent.";

    if (hour >= 5 && hour < 12) {
      phraseList = MORNING_PHRASES;
      subtitle = "Ready to conquer today's goals? Track applications and polish your skills.";
    } else if (hour >= 12 && hour < 18) {
      phraseList = AFTERNOON_PHRASES;
      subtitle = "Keep up the momentum. Follow up on recruiters and test your interview readiness.";
    } else if (hour >= 18 && hour < 22) {
      phraseList = EVENING_PHRASES;
      subtitle = "Review today's wins and line up tomorrow's career opportunities.";
    } else {
      phraseList = LATE_NIGHT_PHRASES;
      subtitle = "Building your future while others rest. We're right here with you.";
    }

    const randomIndex = Math.floor(Math.random() * phraseList.length);
    return {
      phrase: phraseList[randomIndex],
      subtitle,
    };
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const userName = user?.name || "Pooja";

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{greeting.phrase}</span>
              {userName && (
                <span className="text-blue-600 dark:text-cyan-400 font-black">
                  {userName}
                </span>
              )}
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {greeting.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <CalendarDays size={15} className="text-blue-600 dark:text-cyan-400" />
            <span>{formattedDate}</span>
          </div>

          {onAddJobClick && (
            <Button
              variant="primary"
              size="md"
              onClick={onAddJobClick}
              leftIcon={<Plus size={16} />}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20"
            >
              Add Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

