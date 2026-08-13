import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import ActivityTimeline from "../components/activity/ActivityTimeline";
import Select from "../components/ui/Select";

export default function Activity() {
  const [filter, setFilter] = useState("All Actions");

  const filterOptions = [
    "All Actions",
    "Job Added",
    "Status Changed",
    "Interview Scheduled",
    "Salary Updated",
    "Notes Added",
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Activity Timeline"
        subtitle="Complete audit trail of all workspace actions and job search progression events."
        action={
          <div className="w-48">
            <Select
              options={filterOptions}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        }
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        <ActivityTimeline />
      </div>
    </div>
  );
}
