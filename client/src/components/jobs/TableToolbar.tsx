import { useState, useEffect } from "react";
import {
  Search,
  RotateCcw,
  Download,
  SlidersHorizontal,
  X,
} from "lucide-react";
import FilterDropdown, { type FilterOption } from "./FilterDropdown";
import Button from "../ui/Button";

export interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  onRefresh?: () => void;
  onExportCSV?: () => void;
  onResetFilters?: () => void;
  isRefreshing?: boolean;
}

const STATUS_OPTIONS: FilterOption[] = [
  { label: "All Statuses", value: "All" },
  { label: "Applied", value: "Applied" },
  { label: "Screening", value: "Screening" },
  { label: "Assessment", value: "Assessment" },
  { label: "Interview", value: "Interview" },
  { label: "HR Round", value: "HR Round" },
  { label: "Offer", value: "Offer" },
  { label: "Rejected", value: "Rejected" },
  { label: "Ghosted", value: "Ghosted" },
  { label: "Wishlist", value: "Wishlist" },
];

const PRIORITY_OPTIONS: FilterOption[] = [
  { label: "All Priorities", value: "All" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

const LOCATION_OPTIONS: FilterOption[] = [
  { label: "All Locations", value: "All" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Onsite", value: "Onsite" },
];

const DATE_OPTIONS: FilterOption[] = [
  { label: "All Time", value: "All" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
];

const SORT_OPTIONS: FilterOption[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Company (A-Z)", value: "company-asc" },
  { label: "Company (Z-A)", value: "company-desc" },
  { label: "Highest Salary", value: "salary-desc" },
  { label: "Lowest Salary", value: "salary-asc" },
];

export default function TableToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  location,
  onLocationChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortByChange,
  onRefresh,
  onExportCSV,
  onResetFilters,
  isRefreshing = false,
}: TableToolbarProps) {
  const [internalSearch, setInternalSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(internalSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [internalSearch, onSearchChange]);

  useEffect(() => {
    setInternalSearch(search);
  }, [search]);

  const activeFiltersCount =
    (search ? 1 : 0) +
    (status !== "All" ? 1 : 0) +
    (priority !== "All" ? 1 : 0) +
    (location !== "All" ? 1 : 0) +
    (dateRange !== "All" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  return (
    <div className="sticky top-0 z-30 space-y-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="Search company, role, or location..."
            className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {internalSearch && (
            <button
              type="button"
              onClick={() => {
                setInternalSearch("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 justify-end">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              leftIcon={
                <RotateCcw
                  size={14}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              }
            >
              Refresh
            </Button>
          )}

          {onExportCSV && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportCSV}
              leftIcon={<Download size={14} />}
            >
              Export CSV
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <FilterDropdown
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
        />

        <FilterDropdown
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={onPriorityChange}
        />

        <FilterDropdown
          label="Location"
          options={LOCATION_OPTIONS}
          value={location}
          onChange={onLocationChange}
        />

        <FilterDropdown
          label="Date"
          options={DATE_OPTIONS}
          value={dateRange}
          onChange={onDateRangeChange}
        />

        <FilterDropdown
          label="Sort"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={onSortByChange}
        />

        {activeFiltersCount > 0 && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Reset ({activeFiltersCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
