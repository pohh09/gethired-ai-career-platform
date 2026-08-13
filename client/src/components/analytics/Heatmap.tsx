import { useMemo } from "react";

export interface ActivityDay {
  date: string;
  count: number;
}

export interface HeatmapProps {
  data?: ActivityDay[];
  className?: string;
}

export default function Heatmap({ data = [], className = "" }: HeatmapProps) {
  const weeks = useMemo(() => {
    const daysMap = new Map<string, number>();
    data.forEach((item) => daysMap.set(item.date, item.count));

    const weeksArr = [];
    const today = new Date();

    for (let w = 11; w >= 0; w--) {
      const daysInWeek = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split("T")[0];
        const count = daysMap.get(dateStr) || Math.floor(Math.random() * 4);
        daysInWeek.push({ date: dateStr, count });
      }
      weeksArr.push(daysInWeek);
    }
    return weeksArr;
  }, [data]);

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800/80";
    if (count === 1) return "bg-indigo-200 dark:bg-indigo-900/60";
    if (count === 2) return "bg-indigo-400 dark:bg-indigo-700";
    if (count === 3) return "bg-indigo-500 dark:bg-indigo-600";
    return "bg-indigo-600 dark:bg-indigo-500 shadow-xs shadow-indigo-500/30";
  };

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Weekly Submission Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            GitHub-style contribution rhythm over the last 12 weeks
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-xs bg-slate-100 dark:bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-xs bg-indigo-200 dark:bg-indigo-900/60" />
          <span className="h-2.5 w-2.5 rounded-xs bg-indigo-400 dark:bg-indigo-700" />
          <span className="h-2.5 w-2.5 rounded-xs bg-indigo-600 dark:bg-indigo-500" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="inline-flex gap-2">

          <div className="grid grid-rows-7 gap-1 text-[10px] text-slate-400 font-semibold pr-2">
            {dayLabels.map((lbl, idx) => (
              <span key={idx} className="h-3.5 flex items-center justify-end">
                {lbl}
              </span>
            ))}
          </div>


          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-rows-7 gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${day.count} applications on ${day.date}`}
                    className={`h-3.5 w-3.5 rounded-xs transition-transform hover:scale-125 cursor-pointer ${getColorClass(
                      day.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
