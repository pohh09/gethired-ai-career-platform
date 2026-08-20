import { useNavigate } from "react-router-dom";
import { PartyPopper, ArrowRight } from "lucide-react";
import { useCommunityStore } from "../../store/communityStore";

export default function SuccessFeedSnippet() {
  const navigate = useNavigate();
  const { successStories, cheerStory } = useCommunityStore();

  const topStory = successStories[0];
  if (!topStory) return null;

  const hasCheered = topStory.congrats?.includes("user-current");

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 shadow-2xs space-y-3.5 hover:border-emerald-500/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-200/40 shrink-0">
            <PartyPopper size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Win 🎉
            </h4>
            <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
              {topStory.role} @ {topStory.company}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/community")}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Feed</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
        "{topStory.story}"
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-[11px] text-slate-400">
          by <strong>{topStory.authorName}</strong>
        </span>

        <button
          type="button"
          onClick={() => cheerStory(topStory._id)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            hasCheered
              ? "bg-emerald-600 text-white shadow-2xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <PartyPopper size={12} />
          <span>{topStory.congratsCount || 0} Congrats</span>
        </button>
      </div>
    </div>
  );
}
