import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import { DEMO_APPLICATIONS, type DemoApplication } from "../../data/demoData";

const COLUMNS: { id: DemoApplication["status"]; label: string; color: string; badge: string }[] = [
  { id: "saved", label: "Saved", color: "border-slate-300 dark:border-slate-700", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { id: "applied", label: "Applied", color: "border-blue-300 dark:border-blue-700", badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  { id: "interview", label: "Interview", color: "border-amber-300 dark:border-amber-700", badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  { id: "offer", label: "Offer", color: "border-emerald-300 dark:border-emerald-700", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "rejected", label: "Rejected", color: "border-rose-300 dark:border-rose-700", badge: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" },
];

export default function DemoApplications() {
  const [applications, setApplications] = useState<DemoApplication[]>(DEMO_APPLICATIONS);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<DemoApplication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDragStart = (id: string) => {
    setDraggedAppId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: DemoApplication["status"]) => {
    if (!draggedAppId) return;

    setApplications((prev) =>
      prev.map((app) => (app.id === draggedAppId ? { ...app, status: columnId } : app))
    );

    const movedApp = applications.find((a) => a.id === draggedAppId);
    toast.success(`Moved ${movedApp?.company} application to ${columnId.toUpperCase()} (Local Demo)`);
    setDraggedAppId(null);
  };

  const moveStatus = (appId: string, newStatus: DemoApplication["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    toast.success(`Status updated (Local Demo)`);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Layers size={22} className="text-blue-600 dark:text-cyan-400" />
            <span>Interactive Application Tracker (Kanban)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Drag cards between columns to test local stage progression. Changes update live in memory.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={15} />}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20"
          >
            Add Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start w-full overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className={`p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border ${col.color} border-t-4 space-y-3 min-h-[500px] flex flex-col`}
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colApps.map((app) => (
                  <motion.div
                    key={app.id}
                    layoutId={app.id}
                    draggable
                    onDragStart={() => handleDragStart(app.id)}
                    onClick={() => setSelectedApp(app)}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2 select-none group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`h-7 w-7 rounded-lg text-white flex items-center justify-center font-black text-[10px] shrink-0 ${app.color}`}
                        >
                          {app.logo}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                          {app.company}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-md">
                        {app.matchScore}%
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {app.role}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {app.location} • {app.salary}
                      </p>
                    </div>

                    {app.nextStep && (
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">
                        ⏳ {app.nextStep}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span>{app.appliedDate}</span>
                      <span className="font-bold text-blue-500 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </div>
                  </motion.div>
                ))}

                {colApps.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 z-10"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl text-white flex items-center justify-center font-black text-xs ${selectedApp.color}`}>
                    {selectedApp.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                      {selectedApp.role}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedApp.company} • {selectedApp.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <span className="font-extrabold text-blue-600 dark:text-cyan-400 uppercase mt-0.5 block">{selectedApp.status}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Salary</span>
                  <span className="font-extrabold text-emerald-600 mt-0.5 block truncate">{selectedApp.salary}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Profile Fit</span>
                  <span className="font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5 block">{selectedApp.matchScore}% Match</span>
                </div>
              </div>

              {selectedApp.notes && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Application Notes</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    {selectedApp.notes}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Quick Status Switch (Local Demo)</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {COLUMNS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        moveStatus(selectedApp.id, c.id);
                        setSelectedApp({ ...selectedApp, status: c.id });
                      }}
                      className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        selectedApp.status === c.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4 z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-cyan-800">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                Create Live Applications
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                You're exploring GetHired in Demo Mode. Sign up to track your own real-world job applications, manage automated follow-up reminders, and sync company hiring stages.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all block text-center"
                >
                  Create Free Account
                </Link>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Continue in Demo Mode
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
