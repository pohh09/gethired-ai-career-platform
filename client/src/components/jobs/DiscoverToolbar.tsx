import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  Briefcase,
  Code,
  Building,
  MapPin,
  Search,
} from "lucide-react";
import FilterDropdown, { type FilterOption } from "./FilterDropdown";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import type { DiscoverJobFilters } from "../../services/jobSearchService";

export interface DiscoverToolbarProps {
  filters: DiscoverJobFilters;
  onChange: (filters: DiscoverJobFilters) => void;
  onReset: () => void;
  isSearching?: boolean;
}

const WORKPLACE_OPTIONS: FilterOption[] = [
  { label: "All Workplace Types", value: "All" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Onsite", value: "Onsite" },
];

const EMPLOYMENT_OPTIONS: FilterOption[] = [
  { label: "All Job Types", value: "All" },
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
];

const SORT_OPTIONS: FilterOption[] = [
  { label: "Newest", value: "Newest" },
  { label: "Relevant", value: "Relevant" },
];

export default function DiscoverToolbar({
  filters,
  onChange,
  onReset,
  isSearching = false,
}: DiscoverToolbarProps) {
  const [query, setQuery] = useState(filters.query || "");
  const [role, setRole] = useState(filters.role || "");
  const [skill, setSkill] = useState(filters.skill || "");
  const [company, setCompany] = useState(filters.company || "");
  const [location, setLocation] = useState(filters.location || "");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSearchTrigger = () => {
    onChange({
      ...filters,
      query,
      role,
      skill,
      company,
      location,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchTrigger();
    }
  };

  const activeCount =
    (query ? 1 : 0) +
    (role ? 1 : 0) +
    (skill ? 1 : 0) +
    (company ? 1 : 0) +
    (location ? 1 : 0) +
    (filters.workplaceType && filters.workplaceType !== "All" ? 1 : 0) +
    (filters.employmentType && filters.employmentType !== "All" ? 1 : 0);

  const handleClearAll = () => {
    setQuery("");
    setRole("");
    setSkill("");
    setCompany("");
    setLocation("");
    onReset();
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-all select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Keywords (e.g. Developer)..."
            className="w-full pl-9 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="relative">
          <Briefcase
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Job Title (e.g. Frontend)..."
            className="w-full pl-9 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {role && (
            <button
              type="button"
              onClick={() => setRole("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="relative">
          <Code
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skill (e.g. React, Python)..."
            className="w-full pl-9 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {skill && (
            <button
              type="button"
              onClick={() => setSkill("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="relative">
          <Building
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Company (e.g. Stripe)..."
            className="w-full pl-9 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {company && (
            <button
              type="button"
              onClick={() => setCompany("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Location (e.g. SF, Remote)..."
              className="w-full pl-9 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSearchTrigger}
            isLoading={isSearching}
            leftIcon={<Search size={14} />}
            className="shrink-0"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <FilterDropdown
            label="Workplace"
            options={WORKPLACE_OPTIONS}
            value={filters.workplaceType || "All"}
            onChange={(val) => onChange({ ...filters, workplaceType: val })}
          />

          <FilterDropdown
            label="Job Type"
            options={EMPLOYMENT_OPTIONS}
            value={filters.employmentType || "All"}
            onChange={(val) => onChange({ ...filters, employmentType: val })}
          />

          <FilterDropdown
            label="Sort By"
            options={SORT_OPTIONS}
            value={filters.sortBy || "Relevant"}
            onChange={(val) => onChange({ ...filters, sortBy: val })}
          />
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Reset Filters ({activeCount})</span>
          </button>
        )}
      </div>

      <div className="sm:hidden flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileDrawerOpen(true)}
          leftIcon={<SlidersHorizontal size={14} />}
          className="w-full"
        >
          Filters & Sort {activeCount > 0 ? `(${activeCount})` : ""}
        </Button>
      </div>

      {isMobileDrawerOpen && (
        <Modal
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          title="Filter & Sort Live Jobs"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Workplace Type
              </label>
              <select
                value={filters.workplaceType || "All"}
                onChange={(e) =>
                  onChange({ ...filters, workplaceType: e.target.value })
                }
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {WORKPLACE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Employment Type
              </label>
              <select
                value={filters.employmentType || "All"}
                onChange={(e) =>
                  onChange({ ...filters, employmentType: e.target.value })
                }
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {EMPLOYMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sort Order
              </label>
              <select
                value={filters.sortBy || "Relevant"}
                onChange={(e) =>
                  onChange({ ...filters, sortBy: e.target.value })
                }
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleClearAll();
                  setIsMobileDrawerOpen(false);
                }}
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsMobileDrawerOpen(false)}
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
