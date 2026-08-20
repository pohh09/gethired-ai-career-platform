import { useNavigate } from "react-router-dom";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { useCommunityStore } from "../../store/communityStore";

export default function StreakCard() {
  const navigate = useNavigate();
  const { myStreak } = useCommunityStore();

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 shadow-2xs space-y-4 hover:border-amber-500/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Flame size={20} className="fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {myStreak.currentStreak} Day Search Streak
              </h4>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                🔥 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal Best: {myStreak.longestStreak} days
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/community")}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Cohort</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Week Progress Dots */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, idx) => {
            const isDone = idx < 4;
            return (
              <div
                key={idx}
                className={`py-1.5 rounded-lg text-center text-[10px] font-bold border transition-all ${
                  isDone
                    ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles size={12} className="text-amber-600 shrink-0" />
            Active streak logs your momentum!
          </span>
          <span className="font-bold">4 / 7 Days</span>
        </div>
      </div>
    </div>
  );
}
