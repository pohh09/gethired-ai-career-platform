import { useState } from "react";
import {
  Pin,
  Plus,
  FileText,
  Trash2,
  Bold,
  Italic,
  Code,
  List,
  Quote,
} from "lucide-react";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import type { CompanyNote } from "../../types/company";

export interface NotesPanelProps {
  companyId: string;
  notes?: CompanyNote[];
  onAddNote?: (content: string, isPinned: boolean) => void;
  onTogglePin?: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
  className?: string;
}

export default function NotesPanel({
  notes = [],
  onAddNote,
  onTogglePin,
  onDeleteNote,
  className = "",
}: NotesPanelProps) {
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = "") => {
    setNewContent((prev) => `${prev}${prefix}text${suffix}`);
  };

  const handleAdd = () => {
    if (!newContent.trim()) return;
    if (onAddNote) {
      onAddNote(newContent.trim(), isPinned);
    }
    setNewContent("");
    setIsPinned(false);
  };

  const sortedNotes = [...notes].sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0),
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Rich Note Editor
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              title="Bold text"
              aria-label="Bold text"
            >
              <Bold size={13} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              title="Italic text"
              aria-label="Italic text"
            >
              <Italic size={13} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("`", "`")}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              title="Inline code"
              aria-label="Inline code"
            >
              <Code size={13} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n- ")}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              title="Bullet list"
              aria-label="Bullet list"
            >
              <List size={13} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n> ")}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              title="Blockquote"
              aria-label="Blockquote"
            >
              <Quote size={13} />
            </button>
          </div>
        </div>

        <Textarea
          placeholder="Write rich notes about interview prep, culture feedback, tech stack details, or referral follow-ups..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={4}
        />

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setIsPinned((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isPinned
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 shadow-2xs"
                : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
            aria-label={isPinned ? "Unpin note" : "Pin note to top"}
          >
            <Pin
              size={13}
              className={isPinned ? "fill-amber-500 text-amber-500" : ""}
            />
            <span>{isPinned ? "Pinned to Top" : "Pin Note to Top"}</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAdd}
            disabled={!newContent.trim()}
            leftIcon={<Plus size={14} />}
          >
            Add Note
          </Button>
        </div>
      </div>

      {sortedNotes.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/90 dark:bg-slate-900/90">
          <FileText
            size={32}
            className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
          />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Notes Added Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Store key insights, tech stack details, and recruiter guidance for
            quick reference.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.isPinned
                  ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs"
                  : "border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90"
              }`}
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {n.author}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    • {n.createdAt}
                  </span>

                  {n.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-300/50">
                      <Pin
                        size={10}
                        className="fill-amber-600 text-amber-600"
                      />{" "}
                      Pinned
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {n.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onTogglePin && (
                  <button
                    type="button"
                    onClick={() => onTogglePin(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                    title={n.isPinned ? "Unpin note" : "Pin note"}
                    aria-label={n.isPinned ? "Unpin note" : "Pin note"}
                  >
                    <Pin
                      size={14}
                      className={
                        n.isPinned ? "fill-amber-500 text-amber-500" : ""
                      }
                    />
                  </button>
                )}

                {onDeleteNote && (
                  <button
                    type="button"
                    onClick={() => onDeleteNote(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Delete note"
                    aria-label="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
