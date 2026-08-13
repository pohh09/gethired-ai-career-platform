import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[] | readonly string[];
  error?: string;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options = [],
      error,
      helperText,
      className = "",
      children,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm pr-10 transition-all focus:outline-none focus:ring-2 ${
              error
                ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500"
                : "border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30 focus:border-indigo-500"
            } disabled:bg-slate-100 dark:disabled:bg-slate-800/80 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
            {...props}
          >
            {children
              ? children
              : options.map((opt) => {
                  const val = typeof opt === "string" ? opt : opt.value;
                  const lbl = typeof opt === "string" ? opt : opt.label;
                  return (
                    <option
                      key={val}
                      value={val}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {lbl}
                    </option>
                  );
                })}
          </select>

          <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
            <ChevronDown size={16} />
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
