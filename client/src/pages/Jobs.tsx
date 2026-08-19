import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Briefcase,
  Compass,
  Bookmark,
  Archive,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/dashboard/EmptyState";
import TableToolbar from "../components/jobs/TableToolbar";
import DataTable from "../components/jobs/DataTable";
import JobCard from "../components/jobs/JobCard";
import JobModal from "../components/jobs/JobModal";
import JobDetailModal from "../components/jobs/JobDetailModal";
import DeleteModal from "../components/jobs/DeleteModal";
import ImportJobModal from "../components/jobs/ImportJobModal";
import DiscoverToolbar from "../components/jobs/DiscoverToolbar";
import DiscoverJobCard from "../components/jobs/DiscoverJobCard";
import SavedJobCard from "../components/jobs/SavedJobCard";
import { SkeletonTableRow, SkeletonCard } from "../components/ui/Skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "../components/ui/Table";
import KanbanBoard from "../components/jobs/KanbanBoard";
import { useJobs } from "../hooks/useJobs";
import { useCreateJob } from "../hooks/useCreateJob";
import { useDeleteJob } from "../hooks/useDeleteJob";
import { useUpdateJob } from "../hooks/useUpdateJob";
import {
  searchDiscoverJobs,
  type DiscoverJobFilters,
} from "../services/jobSearchService";
import type {
  Job,
  DiscoverJob,
  JobSortOption,
  CreateJobRequest,
} from "../types/job";

type WorkspaceTab = "applications" | "discover" | "saved" | "archived";

const SAVED_JOBS_KEY = "jobflow_saved_jobs_v1";

export default function Jobs() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("applications");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [location, setLocation] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState(1);

  const [discoverFilters, setDiscoverFilters] = useState<DiscoverJobFilters>(
    {},
  );
  const [discoverJobs, setDiscoverJobs] = useState<DiscoverJob[]>([]);
  const [isDiscoverLoading, setIsDiscoverLoading] = useState<boolean>(false);

  const [savedJobs, setSavedJobs] = useState<DiscoverJob[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_JOBS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (_e) {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDuplicateMode, setIsDuplicateMode] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState<Job | DiscoverJob | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
    } catch (_e) {
    }
  }, [savedJobs]);

  useEffect(() => {
    let isMounted = true;
    if (activeTab === "discover") {
      setIsDiscoverLoading(true);
      searchDiscoverJobs(discoverFilters)
        .then((res) => {
          if (isMounted) setDiscoverJobs(res);
        })
        .finally(() => {
          if (isMounted) setIsDiscoverLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, discoverFilters]);

  const backendSortBy: JobSortOption =
    sortBy === "oldest" || sortBy === "company-asc" || sortBy === "company-desc"
      ? sortBy
      : "newest";

  const { data, isLoading, isError, refetch, isRefetching } = useJobs({
    search,
    status,
    priority,
    sortBy: backendSortBy,
    page,
    limit: 10,
  });

  const createMutation = useCreateJob();
  const deleteMutation = useDeleteJob();
  const updateMutation = useUpdateJob();

  const activeApplications = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((j) => j.status !== "Rejected");
  }, [data?.data]);

  const archivedApplications = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((j) => j.status === "Rejected");
  }, [data?.data]);

  const processedApplications = useMemo(() => {
    let result = [...activeApplications];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (j) =>
          (j.company || "").toLowerCase().includes(q) ||
          (j.role || "").toLowerCase().includes(q) ||
          (j.location || "Remote").toLowerCase().includes(q),
      );
    }

    if (location !== "All") {
      result = result.filter((j) =>
        (j.location || "Remote").toLowerCase().includes(location.toLowerCase()),
      );
    }

    if (dateRange !== "All") {
      const now = new Date().getTime();
      const daysLimit =
        dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90;
      const cutoff = now - daysLimit * 24 * 60 * 60 * 1000;
      result = result.filter((j) => {
        const time = new Date(j.appliedDate || j.createdAt).getTime();
        return time >= cutoff;
      });
    }

    if (sortBy === "salary-desc") {
      result.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    } else if (sortBy === "salary-asc") {
      result.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    }

    return result;
  }, [activeApplications, search, location, dateRange, sortBy]);

  const handleOpenAdd = () => {
    setEditingJob(null);
    setIsDuplicateMode(false);
    setIsModalOpen(true);
  };

  const handleImportJobSubmit = (jobData: CreateJobRequest) => {
    createMutation.mutate(jobData, {
      onSuccess: () => {
        toast.success(
          `Successfully imported job for ${jobData.company} into My Applications!`,
        );
        refetch();
      },
      onError: () => {
        toast.error(
          "Failed to import job. Please check details and try again.",
        );
      },
    });
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setIsDuplicateMode(false);
    setIsModalOpen(true);
  };

  const handleOpenDuplicate = (job: Job) => {
    setEditingJob(job);
    setIsDuplicateMode(true);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (job: Job | DiscoverJob) => {
    setViewingJob(job);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (job: Job) => {
    setDeletingJob(job);
    setIsDeleteOpen(true);
  };

  const handleArchive = (job: Job) => {
    updateMutation.mutate(
      { id: job._id, data: { status: "Rejected" } },
      {
        onSuccess: () => {
          toast.success(`Archived application for ${job.company}`);
        },
        onError: () => {
          toast.error("Failed to archive application.");
        },
      },
    );
  };

  const handleStatusChange = (job: Job, newStatus: string) => {
    updateMutation.mutate(
      { id: job._id, data: { status: newStatus as any } },
      {
        onSuccess: () => {
          toast.success(`Moved ${job.company} (${job.role}) to ${newStatus}`);
        },
        onError: () => {
          toast.error("Failed to update application status.");
        },
      },
    );
  };

  const handleRestore = (job: Job) => {
    updateMutation.mutate(
      { id: job._id, data: { status: "Applied" } },
      {
        onSuccess: () => {
          toast.success(
            `Restored application for ${job.company} to My Applications`,
          );
        },
        onError: () => {
          toast.error("Failed to restore application.");
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingJob) return;
    deleteMutation.mutate(deletingJob._id, {
      onSuccess: () => {
        toast.success(`Deleted application for ${deletingJob.company}`);
        setIsDeleteOpen(false);
        setDeletingJob(null);
      },
      onError: () => {
        toast.error("Failed to delete application.");
      },
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("All");
    setPriority("All");
    setLocation("All");
    setDateRange("All");
    setSortBy("newest");
    setPage(1);
  };

  const handleSaveDiscoverJob = (job: DiscoverJob) => {
    const isAlreadyTracked = activeApplications.some(
      (app: Job) =>
        app.company.toLowerCase() === job.company.toLowerCase() &&
        app.role.toLowerCase() === job.role.toLowerCase(),
    );

    if (isAlreadyTracked || savedJobs.some((j) => j.id === job.id)) {
      toast.error(`${job.company} - ${job.role} is already saved or tracked!`);
      return;
    }

    setSavedJobs((prev) => [job, ...prev]);

    createMutation.mutate(
      {
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary || null,
        status: "Applied",
        priority: "High",
        jobLink: job.jobLink,
        notes: job.description,
        appliedDate: new Date().toISOString().split("T")[0],
      },
      {
        onSuccess: () => {
          toast.success(
            `Saved and added ${job.role} at ${job.company} to My Applications!`,
          );
        },
        onError: () => {
          toast.success(`Saved ${job.role} at ${job.company} to Saved Jobs!`);
        },
      },
    );
  };

  const handleDeleteSavedJob = (job: DiscoverJob) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== job.id));
    toast.success(`Removed ${job.company} from saved jobs.`);
  };

  const handleMoveSavedToApplications = (job: DiscoverJob) => {
    createMutation.mutate(
      {
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary || null,
        status: "Applied",
        priority: "High",
        jobLink: job.jobLink,
        notes: job.description,
        appliedDate: new Date().toISOString().split("T")[0],
      },
      {
        onSuccess: () => {
          toast.success(
            `Moved ${job.role} at ${job.company} to My Applications!`,
          );
          handleDeleteSavedJob(job);
        },
        onError: () => {
          toast.error("Failed to move job to My Applications.");
        },
      },
    );
  };

  const handleExportCSV = () => {
    if (processedApplications.length === 0) {
      toast.error("No applications found to export.");
      return;
    }

    const headers = [
      "Company",
      "Role",
      "Location",
      "Salary",
      "Status",
      "Priority",
      "Applied Date",
      "Job Link",
      "Notes",
    ];

    const rows = processedApplications.map((j) => [
      `"${(j.company || "").replace(/"/g, '""')}"`,
      `"${(j.role || "").replace(/"/g, '""')}"`,
      `"${(j.location || "Remote").replace(/"/g, '""')}"`,
      `"${j.salary || ""}"`,
      `"${j.status}"`,
      `"${j.priority}"`,
      `"${j.appliedDate ? new Date(j.appliedDate).toISOString().split("T")[0] : ""}"`,
      `"${(j.jobLink || "").replace(/"/g, '""')}"`,
      `"${(j.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvData = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n",
    );
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `gethired_applications_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported CSV successfully!");
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Jobs Workspace"
        subtitle="Discover target roles from multiple providers, import online job postings, save opportunities, and optimize applications with AI."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              leftIcon={
                <Sparkles size={16} className="text-purple-500 animate-pulse" />
              }
              className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
            >
              Import Job
            </Button>
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              leftIcon={<Plus size={18} />}
            >
              Add Application
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 overflow-x-auto no-scrollbar shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "applications"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
            }`}
        >
          <Briefcase size={15} />
          <span>My Applications</span>
          <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-bold border border-blue-200/50">
            {activeApplications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("discover")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "discover"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
            }`}
        >
          <Compass size={15} />
          <span>Discover Jobs</span>
          <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-200/50 animate-pulse">
            Multi-Provider
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "saved"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
            }`}
        >
          <Bookmark size={15} />
          <span>Saved Jobs</span>
          <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200/50">
            {savedJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("archived")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "archived"
              ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
            }`}
        >
          <Archive size={15} />
          <span>Archived</span>
          <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
            {archivedApplications.length}
          </span>
        </button>
      </div>

      {activeTab === "applications" && (
        <div className="space-y-4">
          <TableToolbar
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            status={status}
            onStatusChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
            priority={priority}
            onPriorityChange={(val) => {
              setPriority(val);
              setPage(1);
            }}
            location={location}
            onLocationChange={(val) => {
              setLocation(val);
              setPage(1);
            }}
            dateRange={dateRange}
            onDateRangeChange={(val) => {
              setDateRange(val);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortByChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
            onRefresh={() => refetch()}
            onExportCSV={handleExportCSV}
            onResetFilters={handleResetFilters}
            isRefreshing={isRefetching}
          />

          {isError ? (
            <div className="p-8 text-center rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 space-y-3">
              <p className="font-semibold">Failed to load job applications.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry Request
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company & Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                  </TableBody>
                </Table>
              </div>
              <div className="block sm:hidden space-y-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          ) : processedApplications.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Applications ({processedApplications.length})
                </span>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewMode("kanban")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "kanban"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-2xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                  >
                    Kanban Board
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "table"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-2xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                  >
                    List Table
                  </button>
                </div>
              </div>

              {viewMode === "kanban" ? (
                <KanbanBoard
                  jobs={processedApplications}
                  onView={handleOpenDetail}
                  onEdit={handleOpenEdit}
                  onStatusChange={handleStatusChange}
                  onDelete={handleOpenDelete}
                />
              ) : (
                <>
                  <div className="hidden sm:block">
                    <DataTable
                      jobs={processedApplications}
                      onView={handleOpenDetail}
                      onEdit={handleOpenEdit}
                      onDuplicate={handleOpenDuplicate}
                      onArchive={handleArchive}
                      onDelete={handleOpenDelete}
                    />
                  </div>

                  <div className="block sm:hidden space-y-3">
                    {processedApplications.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onView={handleOpenDetail}
                        onEdit={handleOpenEdit}
                        onDuplicate={handleOpenDuplicate}
                        onArchive={handleArchive}
                        onDelete={handleOpenDelete}
                      />
                    ))}
                  </div>
                </>
              )}

              <Pagination
                currentPage={data?.currentPage || 1}
                totalPages={data?.totalPages || 1}
                totalItems={data?.totalJobs || processedApplications.length}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          ) : (
            <EmptyState
              title="No applications yet"
              description="Start tracking your job applications or import jobs directly from online sources."
              actionText={
                search ||
                  status !== "All" ||
                  priority !== "All" ||
                  location !== "All" ||
                  dateRange !== "All"
                  ? "Reset Filters"
                  : "Add Your First Application"
              }
              onAction={
                search ||
                  status !== "All" ||
                  priority !== "All" ||
                  location !== "All" ||
                  dateRange !== "All"
                  ? handleResetFilters
                  : handleOpenAdd
              }
            />
          )}
        </div>
      )}

      {activeTab === "discover" && (
        <div className="space-y-6">
          <DiscoverToolbar
            filters={discoverFilters}
            onChange={(f) => setDiscoverFilters(f)}
            onReset={() => setDiscoverFilters({})}
          />

          {isDiscoverLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-sky-400 bg-sky-500/10 border border-sky-500/20 px-4 py-3 rounded-lg animate-pulse">
                <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                <span>Searching across multiple job providers...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          ) : discoverJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discoverJobs.map((job) => (
                <DiscoverJobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.some((j) => j.id === job.id)}
                  onViewDetails={handleOpenDetail}
                  onSaveJob={handleSaveDiscoverJob}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-100">
                  No jobs found for your search
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Try adjusting your search criteria or explore popular search
                  queries below.
                </p>
              </div>
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-400 mb-2">
                  Try searching for:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    "React",
                    "Frontend",
                    "Software Engineer",
                    "MERN Developer",
                  ].map((sug) => (
                    <button
                      key={sug}
                      onClick={() =>
                        setDiscoverFilters({ ...discoverFilters, query: sug })
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-6">
          {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJobs.map((job) => (
                <SavedJobCard
                  key={job.id}
                  job={job}
                  onMoveToApplications={handleMoveSavedToApplications}
                  onDelete={handleDeleteSavedJob}
                  onViewDetails={handleOpenDetail}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved jobs yet"
              description="Explore the Discover Jobs tab to save prospective tech roles, analyze them with AI, or move them directly to your application tracking pipeline."
              actionText="Explore Discover Jobs"
              onAction={() => setActiveTab("discover")}
            />
          )}
        </div>
      )}

      {activeTab === "archived" && (
        <div className="space-y-4">
          {archivedApplications.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-5 font-bold">Company & Role</th>
                    <th className="py-4 px-5 font-bold">Location</th>
                    <th className="py-4 px-5 font-bold">Status</th>
                    <th className="py-4 px-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {archivedApplications.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {job.company.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">
                              {job.company}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-xs block">
                              {job.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300 font-medium">
                        {job.location || "Remote"}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
                          Archived / Rejected
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(job)}
                          leftIcon={<RotateCcw size={13} />}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDelete(job)}
                          className="text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        >
                          Delete Permanently
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No archived applications"
              description="Completed or archived job applications will be safely stored here for historical reference."
            />
          )}
        </div>
      )}

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingJob}
        isDuplicate={isDuplicateMode}
      />

      <ImportJobModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportJobSubmit}
        isSubmitting={createMutation.isPending}
      />

      <JobDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        job={viewingJob}
        onEdit={(job) => {
          setIsDetailOpen(false);
          handleOpenEdit(job);
        }}
        onDelete={(job) => {
          setIsDetailOpen(false);
          handleOpenDelete(job);
        }}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingJob(null);
        }}
        onConfirm={handleConfirmDelete}
        job={deletingJob}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
