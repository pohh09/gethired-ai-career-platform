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
import Modal from "../ui/Modal";

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    (status !== "All" ? 1 : 0) +
    (priority !== "All" ? 1 : 0) +
    (location !== "All" ? 1 : 0) +
    (dateRange !== "All" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const totalActiveCount = (search ? 1 : 0) + activeFiltersCount;

  return (
    <div className="sticky top-0 z-20 space-y-3 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-all select-none">
      {/* Mobile Streamlined Layout (< sm screens) */}
      <div className="sm:hidden space-y-2.5">
        {/* Full-width Search Input */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="Search company, role, location..."
            className="w-full pl-9 pr-8 py-2.5 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {internalSearch && (
            <button
              type="button"
              onClick={() => {
                setInternalSearch("");
                onSearchChange("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile Action Buttons Row */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFilterOpen(true)}
            leftIcon={<SlidersHorizontal size={13} />}
            className="flex-1 justify-center text-xs font-bold py-2 bg-slate-50/80 dark:bg-slate-800/80"
          >
            Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
          </Button>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              leftIcon={
                <RotateCcw
                  size={13}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              }
              className="px-3 text-xs"
              title="Refresh applications"
            >
              Refresh
            </Button>
          )}

          {onExportCSV && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportCSV}
              leftIcon={<Download size={13} />}
              className="px-3 text-xs"
              title="Export CSV"
            >
              CSV
            </Button>
          )}
        </div>

        {/* Active Filter Chips (if any active) */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {status !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200/60 dark:border-blue-800/60">
                Status: {status}
                <button
                  type="button"
                  onClick={() => onStatusChange("All")}
                  className="hover:text-rose-500"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {priority !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200/60 dark:border-amber-800/60">
                Priority: {priority}
                <button
                  type="button"
                  onClick={() => onPriorityChange("All")}
                  className="hover:text-rose-500"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {location !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200/60 dark:border-purple-800/60">
                Location: {location}
                <button
                  type="button"
                  onClick={() => onLocationChange("All")}
                  className="hover:text-rose-500"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {dateRange !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                Date: {dateRange}
                <button
                  type="button"
                  onClick={() => onDateRangeChange("All")}
                  className="hover:text-rose-500"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 hover:underline px-1"
              >
                Reset All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Search & Filter Layout (>= sm screens) */}
      <div className="hidden sm:block space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search company, role, or location..."
              className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

          <div className="flex items-center gap-2 shrink-0">
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

          {totalActiveCount > 0 && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Reset ({totalActiveCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {isMobileFilterOpen && (
        <Modal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filter Applications"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Date Applied
              </label>
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {DATE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {onResetFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                >
                  Reset All
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsMobileFilterOpen(false)}
                className="ml-auto bg-blue-600 hover:bg-blue-500 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

