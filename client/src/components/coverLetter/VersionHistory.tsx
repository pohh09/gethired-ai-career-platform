import { useState } from "react";
import { History, Clock, ArrowLeftRight, Check } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import type { CoverLetterVersion } from "../../types/coverLetter";

export interface VersionHistoryProps {
  versions: CoverLetterVersion[];
  activeVersionId: string;
  onSelectVersion: (version: CoverLetterVersion) => void;
  className?: string;
}

export default function VersionHistory({
  versions = [],
  activeVersionId,
  onSelectVersion,
  className = "",
}: VersionHistoryProps) {
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [compareTargetId, setCompareTargetId] = useState<string>("");

  if (versions.length <= 1) return null;

  const activeVersion =
    versions.find((v) => v.id === activeVersionId) || versions[0];
  const compareVersion =
    versions.find((v) => v.id === compareTargetId) ||
    versions.find((v) => v.id !== activeVersionId) ||
    versions[1];

  const handleOpenCompare = (targetId?: string) => {
    if (targetId) setCompareTargetId(targetId);
    else if (!compareTargetId) {
      const other = versions.find((v) => v.id !== activeVersionId);
      if (other) setCompareTargetId(other.id);
    }
    setIsComparing(true);
  };

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <History size={14} className="text-indigo-500" />
            <span>Version History ({versions.length})</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenCompare()}
            leftIcon={<ArrowLeftRight size={13} className="text-indigo-500" />}
            className="text-xs h-7 px-2.5 border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
          >
            Compare Versions
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {versions.map((ver, idx) => {
            const isActive = ver.id === activeVersionId;
            return (
              <button
                key={ver.id}
                type="button"
                onClick={() => onSelectVersion(ver)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 text-left space-y-0.5 ${isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300/80 shadow-2xs font-extrabold"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>Version {versions.length - idx}</span>
                  </div>
                  {isActive && (
                    <Check
                      size={12}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  )}
                </div>
                <p className="text-[10px] opacity-80 font-normal">
                  {ver.style} • {ver.length} • {ver.timestamp}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={isComparing}
        onClose={() => setIsComparing(false)}
        title={
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
            <ArrowLeftRight size={18} className="text-indigo-500" />
            <span>Version Comparison</span>
          </div>
        }
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <span>Comparing Active Version against:</span>
            <div className="flex items-center gap-2">
              <select
                value={compareTargetId}
                onChange={(e) => setCompareTargetId(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                {versions.map((v, idx) => (
                  <option key={v.id} value={v.id}>
                    Version {versions.length - idx} ({v.style} - {v.timestamp})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/50">
                <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Active Draft ({activeVersion.style})
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {
                    activeVersion.coverLetterText.split(/\s+/).filter(Boolean)
                      .length
                  }{" "}
                  words
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {activeVersion.coverLetterText}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  onSelectVersion(activeVersion);
                  setIsComparing(false);
                }}
              >
                Keep Active Draft
              </Button>
            </div>

            {compareVersion && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Version Comparison ({compareVersion.style})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {
                      compareVersion.coverLetterText
                        .split(/\s+/)
                        .filter(Boolean).length
                    }{" "}
                    words
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {compareVersion.coverLetterText}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    onSelectVersion(compareVersion);
                    setIsComparing(false);
                  }}
                >
                  Restore This Version
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
