import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutDashboard } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav
      className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
      >
        <LayoutDashboard
          size={14}
          className="text-slate-400 dark:text-slate-500"
        />
        <span>Dashboard</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={name} className="flex items-center gap-1.5">
            <ChevronRight
              size={12}
              className="text-slate-300 dark:text-slate-600"
            />
            {isLast ? (
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formattedName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                {formattedName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
