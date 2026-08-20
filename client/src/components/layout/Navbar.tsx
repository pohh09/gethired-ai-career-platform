import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Plus,
  Search,
  LayoutDashboard,
  Briefcase,
  Bot,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";
import Breadcrumbs from "../common/Breadcrumbs";
import SearchBar from "./SearchBar";
import CommandPalette from "./CommandPalette";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Button from "../ui/Button";
import { useUIStore } from "../../store/uiStore";

const ROUTE_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  "/": { label: "Dashboard", icon: LayoutDashboard },
  "/jobs": { label: "Jobs Tracker", icon: Briefcase },
  "/ai-workspace": { label: "AI Workspace", icon: Bot },
  "/resumes/builder": { label: "Resume Builder", icon: FileText },
  "/community": { label: "Community", icon: Users },
  "/analytics": { label: "Analytics", icon: TrendingUp },
  "/calendar": { label: "Calendar", icon: Calendar },
  "/profile": { label: "Profile", icon: UserIcon },
  "/settings": { label: "Settings", icon: SettingsIcon },
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleMobileDrawer } = useUIStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const currentRoute =
    ROUTE_CONFIG[location.pathname] || {
      label:
        location.pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
        "Dashboard",
      icon: LayoutDashboard,
    };

  const PageIcon = currentRoute.icon;

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
      <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-colors select-none">
        {/* Left Side: Mobile Drawer Toggle & Page Context / Desktop Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleMobileDrawer}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Open navigation drawer"
          >
            <Menu size={18} />
          </button>

          {/* Desktop Breadcrumbs */}
          <div className="hidden md:block">
            <Breadcrumbs />
          </div>

          {/* Mobile Current Page Context Badge with Icon */}
          <div className="flex md:hidden items-center gap-1.5 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 shrink-0">
              <PageIcon size={14} className="text-blue-600 dark:text-cyan-400 shrink-0" />
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 capitalize whitespace-nowrap">
                {currentRoute.label}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm mx-3">
          <SearchBar onClick={() => setCommandPaletteOpen(true)} />
        </div>

        {/* Right Side Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Search Icon Trigger Button */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer"
            aria-label="Search or jump to (Ctrl+K)"
          >
            <Search size={18} />
          </button>

          {/* Desktop Quick Add Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/jobs")}
            leftIcon={<Plus size={15} />}
            className="hidden md:inline-flex bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            Quick Add
          </Button>

          <NotificationDropdown />

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

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


