import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export default function DashboardLayout() {
  const location = useLocation();
  useNetworkStatus();

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full">
          <Navbar />

          <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden no-scrollbar w-full">
            <div className="max-w-7xl mx-auto space-y-6 w-full overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="w-full overflow-x-hidden"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
