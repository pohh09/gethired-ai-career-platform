import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  HelpCircle,
  MessageSquare,
  LogOut,
  Bot,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  FileText,
} from "lucide-react";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import UserCard from "./UserCard";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileDrawerOpen,
    setMobileDrawerOpen,
  } = useUIStore();
  const { logout } = useAuthStore();

  const handleLinkClick = (isMobile: boolean) => {
    if (isMobile) setMobileDrawerOpen(false);
  };

  const renderContent = (isMobile = false) => {
    const isCollapsed = !isMobile && sidebarCollapsed;

    return (
      <div className="flex flex-col h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-none shadow-xs">
        <div className="relative">
          <WorkspaceSwitcher collapsed={isCollapsed} />

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-5 h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center shadow-xs transition-transform hover:scale-110 z-40"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={13} />
              ) : (
                <ChevronLeft size={13} />
              )}
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute right-3 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin">
          <SidebarSection title="Menu" collapsed={isCollapsed}>
            <SidebarItem
              name="Dashboard"
              path="/"
              icon={LayoutDashboard}
              collapsed={isCollapsed}
              onClick={() => handleLinkClick(isMobile)}
            />
            <SidebarItem
              name="Jobs"
              path="/jobs"
              icon={Briefcase}
              badge="Tracker"
              collapsed={isCollapsed}
              onClick={() => handleLinkClick(isMobile)}
            />
            <SidebarItem
              name="Resumes & Docs"
              path="/resumes"
              icon={FileText}
              collapsed={isCollapsed}
              onClick={() => handleLinkClick(isMobile)}
            />
            <SidebarItem
              name="Interview Prep"
              path="/interview-prep"
              icon={Bot}
              badge="AI"
              collapsed={isCollapsed}
              onClick={() => handleLinkClick(isMobile)}
            />
            <SidebarItem
              name="Community"
              path="/community"
              icon={Users}
              badge="New"
              collapsed={isCollapsed}
              onClick={() => handleLinkClick(isMobile)}
            />
            <SidebarItem
              name="Settings"
              path="/settings"
              icon={Settings}
              collapsed={isCollapsed}
              onClick={() => handleLinkClick(isMobile)}
            />
          </SidebarSection>
        </nav>

        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleLinkClick(isMobile)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <HelpCircle size={18} className="text-slate-400 shrink-0" />
              {!isCollapsed && <span>Help & Support</span>}
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick(isMobile)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <MessageSquare size={18} className="text-slate-400 shrink-0" />
              {!isCollapsed && <span>Send Feedback</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                handleLinkClick(isMobile);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>

          <UserCard collapsed={isCollapsed} />
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block h-screen sticky top-0 z-30 shrink-0 overflow-hidden"
      >
        {renderContent(false)}
      </motion.aside>

      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-72 h-full z-10"
            >
              {renderContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
