import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import Breadcrumbs from "../common/Breadcrumbs";
import SearchBar from "./SearchBar";
import CommandPalette from "./CommandPalette";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Button from "../ui/Button";
import { useUIStore } from "../../store/uiStore";

export default function Navbar() {
  const navigate = useNavigate();
  const { toggleMobileDrawer } = useUIStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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
      <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileDrawer}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block">
            <Breadcrumbs />
          </div>
        </div>

        <div className="flex-1 max-w-xs sm:max-w-sm mx-3">
          <SearchBar onClick={() => setCommandPaletteOpen(true)} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/jobs")}
            leftIcon={<Plus size={15} />}
            className="hidden sm:inline-flex"
          >
            Quick Add
          </Button>

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
