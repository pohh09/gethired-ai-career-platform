import { useState, useMemo, type ChangeEvent } from "react";
import { Plus, Search, LayoutGrid, List, X, Filter } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/dashboard/EmptyState";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import CompanyCard from "../components/companies/CompanyCard";
import CompanyTable from "../components/companies/CompanyTable";
import AddCompanyModal from "../components/companies/AddCompanyModal";
import CompanySkeleton from "../components/companies/CompanySkeleton";
import { useCompanyStore } from "../store/companyStore";
import type { Company } from "../types/company";

const INDUSTRY_OPTIONS = [
  "All Industries",
  "Software / SaaS",
  "Fintech & Payments",
  "Developer Tools",
  "AI / Machine Learning",
  "Productivity & Software",
  "E-Commerce",
  "Healthcare",
];

const SIZE_OPTIONS = [
  "All Sizes",
  "1 - 50 employees",
  "50 - 200 employees",
  "200 - 1,000 employees",
  "1,000 - 5,000 employees",
  "5,000+ employees",
];

const WORKPLACE_OPTIONS = ["All Models", "Remote", "Hybrid", "Onsite"];
const STATUS_OPTIONS = ["All Statuses", "Cold", "Warm", "Active", "Referral"];

const STANDARD_TAGS = [
  "All Tags",
  "Dream Company",
  "Referral",
  "Startup",
  "MNC",
  "Remote",
  "Priority",
];

export default function Companies() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    companies,
    filters,
    isLoading,
    setSearchQuery,
    setIndustryFilter,
    setSizeFilter,
    setWorkplaceFilter,
    setStatusFilter,
    setTagFilter,
    resetFilters,
    addCompany,
  } = useCompanyStore();

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const query = filters.searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query) ||
        c.headquarters.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query)) ||
        (c.recruiters &&
          c.recruiters.some(
            (r) =>
              r.name.toLowerCase().includes(query) ||
              r.role.toLowerCase().includes(query) ||
              (r.email && r.email.toLowerCase().includes(query)),
          ));

      const matchesIndustry =
        filters.industry === "All Industries" ||
        c.industry === filters.industry;

      const matchesSize =
        filters.size === "All Sizes" || c.size === filters.size;

      const matchesWorkplace =
        filters.workplaceType === "All Models" ||
        c.workplaceType === filters.workplaceType;

      const matchesTag =
        filters.selectedTag === "All Tags" ||
        (c.tags && c.tags.includes(filters.selectedTag));

      const matchesStatus =
        filters.relationshipStatus === "All Statuses" ||
        (c.recruiters &&
          c.recruiters.some(
            (r) => r.relationshipStatus === filters.relationshipStatus,
          ));

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesSize &&
        matchesWorkplace &&
        matchesTag &&
        matchesStatus
      );
    });
  }, [companies, filters]);

  const hasActiveFilters =
    filters.searchQuery ||
    filters.industry !== "All Industries" ||
    filters.size !== "All Sizes" ||
    filters.workplaceType !== "All Models" ||
    filters.relationshipStatus !== "All Statuses" ||
    filters.selectedTag !== "All Tags";

  const handleAddCompany = (newComp: Partial<Company>) => {
    addCompany(newComp);
  };

  const handleTagClick = (tag: string) => {
    if (filters.selectedTag === tag) {
      setTagFilter("All Tags");
    } else {
      setTagFilter(tag);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Companies"
        subtitle="Manage companies and recruiter relationships."
        action={
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus size={18} />}
          >
            Add Company
          </Button>
        }
      />

      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search companies, recruiters, industry, or headquarters..."
              value={filters.searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              leftIcon={<Search size={16} className="text-slate-400" />}
              aria-label="Search companies and recruiters"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X size={14} />
                <span>Reset Filters</span>
              </button>
            )}

            <div
              className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80"
              role="group"
              aria-label="View mode toggle"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title="Grid Card View"
                aria-label="Switch to Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title="Table List View"
                aria-label="Switch to Table view"
                aria-pressed={viewMode === "table"}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <Select
            options={INDUSTRY_OPTIONS}
            value={filters.industry}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setIndustryFilter(e.target.value)
            }
            aria-label="Filter by Industry"
          />

          <Select
            options={SIZE_OPTIONS}
            value={filters.size}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSizeFilter(e.target.value)
            }
            aria-label="Filter by Company Size"
          />

          <Select
            options={WORKPLACE_OPTIONS}
            value={filters.workplaceType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setWorkplaceFilter(e.target.value)
            }
            aria-label="Filter by Workplace Model"
          />

          <Select
            options={STATUS_OPTIONS}
            value={filters.relationshipStatus}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value)
            }
            aria-label="Filter by Recruiter Relationship Status"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter size={12} /> Tags:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {STANDARD_TAGS.map((t) => {
              const isSelected = filters.selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTagFilter(t)}
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-slate-50 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400"
                  }`}
                  aria-pressed={isSelected}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading ? (
        <CompanySkeleton variant={viewMode} count={6} />
      ) : filteredCompanies.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "No Matching Companies Found"
              : "No Target Companies in Directory"
          }
          description={
            hasActiveFilters
              ? "Try broadening your search query or clearing active industry, size, workplace, or tag filters."
              : "Add target companies to track recruiter relationships, rich notes, communication logs, and hiring pipeline progress."
          }
          actionText={
            hasActiveFilters ? "Clear All Filters" : "Add Target Company"
          }
          onAction={
            hasActiveFilters ? resetFilters : () => setIsAddModalOpen(true)
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((comp) => (
            <CompanyCard
              key={comp._id}
              company={comp}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 shadow-sm">
          <CompanyTable
            companies={filteredCompanies}
            onTagClick={handleTagClick}
          />
        </div>
      )}

      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCompany}
      />
    </div>
  );
}
