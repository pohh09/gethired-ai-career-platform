import { useState } from "react";
import { Target, CheckCircle2, Circle, Plus } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import type { CareerGoal } from "../../types/careerCoach";

export interface GoalTrackerProps {
  initialGoals: CareerGoal[];
  className?: string;
}

export default function GoalTracker({
  initialGoals = [],
  className = "",
}: GoalTrackerProps) {
  const [goals, setGoals] = useState<CareerGoal[]>(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("10");
  const [newUnit, setNewUnit] = useState("jobs");

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }

    const createdGoal: CareerGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      target: Number(newTarget) || 1,
      current: 0,
      unit: newUnit.trim() || "tasks",
      completed: false,
    };

    setGoals((prev) => [createdGoal, ...prev]);
    setNewTitle("");
    setNewTarget("10");
    setNewUnit("jobs");
    setIsModalOpen(false);
    toast.success("New career goal added!");
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <>
      <div
        className={`p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-4 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Target size={18} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Active Weekly Career Goals
              </h4>
              <p className="text-xs text-slate-500">
                {completedCount} of {goals.length} Goals Completed
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={14} className="text-indigo-500" />}
            className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold"
          >
            + Add Goal
          </Button>
        </div>

        <div className="space-y-2.5">
          {goals.map((g) => {
            const pct = Math.min(
              100,
              Math.round((g.current / (g.target || 1)) * 100),
            );
            return (
              <div
                key={g.id}
                onClick={() => toggleGoal(g.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${g.completed
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 text-slate-500"
                  : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-indigo-200"
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button type="button" className="shrink-0">
                    {g.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle
                        size={18}
                        className="text-slate-300 dark:text-slate-600"
                      />
                    )}
                  </button>

                  <span
                    className={`text-xs font-bold truncate ${g.completed ? "line-through text-slate-400" : ""
                      }`}
                  >
                    {g.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] font-extrabold text-slate-500">
                    {g.current} / {g.target} {g.unit}
                  </span>
                  <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${g.completed ? "bg-emerald-500" : "bg-indigo-500"
                        } rounded-full`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
            <Target size={18} className="text-indigo-500" />
            <span>Set New Career Goal</span>
          </div>
        }
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. Apply to 20 jobs this week, Learn Docker, Attend 2 interviews"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Number"
              type="number"
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              required
            />
            <Input
              label="Unit / Label"
              placeholder="e.g. jobs, interviews, score, modules"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
