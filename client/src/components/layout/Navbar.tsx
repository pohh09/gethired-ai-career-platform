import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import Breadcrumbs from "../common/Breadcrumbs";
import SearchBar from "./SearchBar";
import CommandPalette from "./CommandPalette";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Button from "../ui/Button";
import { useUIStore } from "../../store/uiStore";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/jobs": "Jobs Tracker",
  "/ai-workspace": "AI Workspace",
  "/resumes/builder": "Resume Builder",
  "/community": "Community",
  "/analytics": "Analytics",
  "/calendar": "Calendar",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleMobileDrawer } = useUIStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const currentPageTitle =
    ROUTE_LABELS[location.pathname] ||
    location.pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
    "Dashboard";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-colors select-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleMobileDrawer}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95"
            aria-label="Open navigation drawer"
          >
            <Menu size={20} />
          </button>

          {/* Desktop Breadcrumbs */}
          <div className="hidden md:block">
            <Breadcrumbs />
          </div>

          {/* Mobile Current Page Context Badge */}
          <div className="flex md:hidden items-center gap-1.5 min-w-0">
            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 capitalize truncate max-w-[110px] xs:max-w-[140px]">
              {currentPageTitle}
            </span>
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="flex-1 max-w-[140px] xs:max-w-xs sm:max-w-sm mx-2 sm:mx-3">
          <SearchBar onClick={() => setCommandPaletteOpen(true)} />
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop Quick Add */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/jobs")}
            leftIcon={<Plus size={15} />}
            className="hidden sm:inline-flex shadow-xs"
          >
            Quick Add
          </Button>

          {/* Mobile Quick Add Icon Button */}
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            aria-label="Quick Add Job"
            className="sm:hidden p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
          </button>

          <NotificationDropdown />

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <ProfileDropdown />
        </div>
      </header>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}

