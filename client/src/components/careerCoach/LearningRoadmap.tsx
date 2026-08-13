import { Calendar, BookOpen } from "lucide-react";
import type { RoadmapItem } from "../../types/careerCoach";

export interface LearningRoadmapProps {
  roadmap: RoadmapItem[];
  className?: string;
}

export default function LearningRoadmap({
  roadmap = [],
  className = "",
}: LearningRoadmapProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
        <Calendar size={14} className="text-indigo-500" />
        <span>Personalized 4-Week Learning Roadmap</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roadmap.map((item, idx) => (
          <div
            key={item.week}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50 uppercase tracking-wider">
                  {item.week}
                </span>

                <span className="text-[10px] font-mono text-slate-400">
                  Step 0{idx + 1}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                {item.topic}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.resources.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <BookOpen size={11} />
                  <span>Resources</span>
                </span>
                <ul className="text-[11px] text-indigo-600 dark:text-indigo-400 space-y-0.5">
                  {item.resources.map((r, rIdx) => (
                    <li key={rIdx} className="truncate">
                      • {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
