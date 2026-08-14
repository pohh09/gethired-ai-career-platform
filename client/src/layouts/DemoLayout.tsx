import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Bot,
  BarChart3,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  X,
  Menu,
  Sun,
  Moon,
  Bell,
  LogOut,
  UserPlus,
} from "lucide-react";

import { useUIStore } from "../store/uiStore";
import { DEMO_USER } from "../data/demoData";

const DEMO_NAV_LINKS = [
  { name: "Dashboard", path: "/demo", icon: LayoutDashboard },
  { name: "Jobs Discovery", path: "/demo/jobs", icon: Briefcase, badge: "10+ Live" },
  { name: "Application Tracker", path: "/demo/applications", icon: Layers, badge: "Kanban" },
  { name: "AI Workspace", path: "/demo/ai-workspace", icon: Bot, badge: "AI Hub" },
  { name: "Analytics", path: "/demo/analytics", icon: BarChart3, badge: "Pro" },
  { name: "Interview Calendar", path: "/demo/calendar", icon: CalendarIcon },
];

export default function DemoLayout() {
  const location = useLocation();
  const { theme, setTheme } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white px-3 sm:px-6 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <p className="font-semibold truncate">
            <span className="font-extrabold text-amber-300 mr-1.5">🎉 Demo Mode:</span>
            <span className="hidden sm:inline">You're exploring GetHired using sample data. Sign up to unlock live AI tools and save progress!</span>
            <span className="sm:hidden">Exploring with sample data.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/register"
            className="px-3.5 py-1.5 rounded-xl bg-white text-indigo-950 font-extrabold hover:bg-slate-100 transition-all shadow-sm flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
          >
            <span>Create Account</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/landing"
            className="px-2.5 py-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-bold"
          >
            Exit Demo
          </Link>
        </div>
      </div>

      <header className="h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/demo" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-indigo-500/20">
              <Sparkles size={16} />
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight hidden xs:inline-block">
              Get<span className="text-indigo-600 dark:text-indigo-400">Hired</span>
            </span>
          </Link>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Demo
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {DEMO_NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={14} />
                <span>{item.name}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      Notifications (Demo)
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold">2 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-0.5">
                      <p className="font-extrabold text-indigo-900 dark:text-indigo-200">
                        Interview Tomorrow @ 10:00 AM
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Stripe — Technical System Design Round
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-0.5">
                      <p className="font-extrabold text-emerald-900 dark:text-emerald-200">
                        ATS Resume Scan Complete
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Score: 94/100 (Grade A+)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <img
                src={DEMO_USER.avatar}
                alt={DEMO_USER.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="text-left hidden xl:block">
                <span className="text-xs font-extrabold block text-slate-900 dark:text-slate-100 leading-tight">
                  {DEMO_USER.name}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Demo User</span>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <img
                      src={DEMO_USER.avatar}
                      alt={DEMO_USER.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {DEMO_USER.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                        {DEMO_USER.email}
                      </p>
                      <span className="inline-block mt-0.5 text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                        Demo Account
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/register"
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                    >
                      <UserPlus size={14} />
                      <span>Create Real Account</span>
                    </Link>
                    <Link
                      to="/landing"
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Back to Landing Page</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1.5 shrink-0 z-30"
          >
            {DEMO_NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden no-scrollbar w-full">
        <div className="max-w-[1750px] mx-auto space-y-6 w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="w-full overflow-x-hidden"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
