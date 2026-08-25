import React from "react";

export interface GetHiredLogoProps {
  size?: number | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "dark-tile" | "light-tile";
  showText?: boolean;
  showTagline?: boolean;
  taglineText?: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  textClassName?: string;
  iconOnly?: boolean;
  stacked?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 60,
  "2xl": 80,
};

export const GetHiredLogoIcon: React.FC<{
  size?: number | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "dark-tile" | "light-tile";
  className?: string;
}> = ({ size = 40, variant = "default", className = "" }) => {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 40;
  const uniqueId = React.useId().replace(/:/g, "");

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-label="GetHired Logo"
    >
      <defs>
        {/* Main Ribbon Gradient: Rich purple to electric blue to vibrant cyan */}
        <linearGradient
          id={`gh-ribbon-${uniqueId}`}
          x1="18%"
          y1="88%"
          x2="85%"
          y2="15%"
        >
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="25%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="80%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>

        {/* Top Cyan Arch Highlight */}
        <linearGradient
          id={`gh-top-cyan-${uniqueId}`}
          x1="10%"
          y1="80%"
          x2="95%"
          y2="20%"
        >
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="75%" stopColor="#00C4FA" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Upward Career Arrow Gradient */}
        <linearGradient
          id={`gh-arrow-${uniqueId}`}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#00C4FA" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Bottom Arc Gradient */}
        <linearGradient
          id={`gh-bottom-${uniqueId}`}
          x1="0%"
          y1="20%"
          x2="100%"
          y2="80%"
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="35%" stopColor="#6366F1" />
          <stop offset="70%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* 3D Fold Inner Shadow */}
        <linearGradient
          id={`gh-fold-shadow-${uniqueId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </linearGradient>

        {/* Dark Navy Professional Tie Gradient */}
        <linearGradient
          id={`gh-tie-grad-${uniqueId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Tie Royal Blue Sheen */}
        <linearGradient
          id={`gh-tie-sheen-${uniqueId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.15" />
        </linearGradient>

        {/* Dark Squircle Background */}
        <linearGradient
          id={`gh-dark-tile-bg-${uniqueId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#090D16" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Light Squircle Background */}
        <linearGradient
          id={`gh-light-tile-bg-${uniqueId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>

        {/* Drop Shadow for Glyphs */}
        <filter
          id={`gh-glyph-shadow-${uniqueId}`}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="#0284C7"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {/* Optional Dark Squircle Background */}
      {variant === "dark-tile" && (
        <>
          <rect
            x="4"
            y="4"
            width="120"
            height="120"
            rx="32"
            fill={`url(#gh-dark-tile-bg-${uniqueId})`}
          />
          <rect
            x="4"
            y="4"
            width="120"
            height="120"
            rx="32"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      )}

      {/* Optional Light Squircle Background */}
      {variant === "light-tile" && (
        <>
          <rect
            x="4"
            y="4"
            width="120"
            height="120"
            rx="32"
            fill={`url(#gh-light-tile-bg-${uniqueId})`}
          />
          <rect
            x="4"
            y="4"
            width="120"
            height="120"
            rx="32"
            stroke="rgba(15, 23, 42, 0.08)"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      )}

      {/* Main Logo Glyph Group */}
      <g filter={variant === "default" ? `url(#gh-glyph-shadow-${uniqueId})` : undefined}>
        {/* 1. Bottom & Right Body of 'G' */}
        <path
          d="M 58 102
             C 36 102 21 87 21 66
             C 21 57 25 48 30 42
             L 43 51
             C 40 55 38 60 38 66
             C 38 78 46 87 58 87
             C 69 87 77 79 79 70
             L 62 70
             L 62 57
             L 94 57
             C 95 61 95 66 94 71
             C 90 89 75 102 58 102 Z"
          fill={`url(#gh-bottom-${uniqueId})`}
        />

        {/* 2. Left & Top Sweeping 3D Ribbon */}
        <path
          d="M 21 66
             C 21 43 37 24 60 24
             C 73 24 83 29 91 37
             L 79 47
             C 74 42 67 38 60 38
             C 45 38 37 50 37 65
             C 37 71 39 77 42 82
             L 28 92
             C 23 84 21 76 21 66 Z"
          fill={`url(#gh-ribbon-${uniqueId})`}
        />

        {/* 3. Top Cyan Arch & Highlighting */}
        <path
          d="M 40 33
             C 46 27 52 24 60 24
             C 75 24 87 30 94 39
             L 82 49
             C 77 43 69 38 60 38
             C 52 38 46 42 40 47
             L 30 38
             C 33 36 36 34 40 33 Z"
          fill={`url(#gh-top-cyan-${uniqueId})`}
        />

        {/* 4. 3D Overlapping Fold Shadow */}
        <path
          d="M 28 92
             C 32 96 37 99 44 101
             L 49 88
             C 46 86 43 83 40 80
             L 28 92 Z"
          fill={`url(#gh-fold-shadow-${uniqueId})`}
        />

        {/* 5. Upward Career Ascent Arrow */}
        <path
          d="M 77 41
             L 93 25
             L 86 20
             L 108 17
             L 106 39
             L 99 33
             L 84 48 Z"
          fill={`url(#gh-arrow-${uniqueId})`}
        />

        {/* 6. Arrow Specular Highlight */}
        <path
          d="M 93 25
             L 108 17
             L 99 33 Z"
          fill="white"
          fillOpacity="0.32"
        />

        {/* 7. Center Necktie - Knot */}
        <polygon
          points="58,56 68,56 69,63 57,63"
          fill={`url(#gh-tie-grad-${uniqueId})`}
        />
        <polygon
          points="58,56 68,56 69,63 57,63"
          fill={`url(#gh-tie-sheen-${uniqueId})`}
        />

        {/* 8. Center Necktie - Body with sharp point */}
        <polygon
          points="57,64 69,64 71,79 63,90 55,79"
          fill={`url(#gh-tie-grad-${uniqueId})`}
        />
        <polygon
          points="57,64 63,64 63,90 55,79"
          fill={`url(#gh-tie-sheen-${uniqueId})`}
        />
      </g>
    </svg>
  );
};

export default function GetHiredLogo({
  size = "md",
  variant = "default",
  showText = true,
  showTagline = false,
  taglineText = "JOBS • SKILLS • YOUR FUTURE",
  showBadge = false,
  badgeText = "AI OS",
  className = "",
  textClassName = "",
  iconOnly = false,
  stacked = false,
}: GetHiredLogoProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 40;

  if (iconOnly || !showText) {
    return <GetHiredLogoIcon size={pixelSize} variant={variant} className={className} />;
  }

  if (stacked) {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <GetHiredLogoIcon size={pixelSize} variant={variant} />
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Get
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent ml-0.5">
                Hired
              </span>
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mt-1.5">
              {taglineText}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <GetHiredLogoIcon size={pixelSize} variant={variant} />

      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black text-slate-900 dark:text-white tracking-tight flex items-center ${
              textClassName || (pixelSize >= 44 ? "text-xl sm:text-2xl" : pixelSize >= 36 ? "text-lg sm:text-xl" : "text-base")
            }`}
          >
            Get
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent ml-0.5">
              Hired
            </span>
          </span>

          {showBadge && (
            <span className="inline-flex items-center text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-cyan-300 border border-blue-200/80 dark:border-cyan-800/40 shrink-0">
              {badgeText}
            </span>
          )}
        </div>

        {showTagline ? (
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.16em] uppercase mt-1">
            {taglineText}
          </span>
        ) : pixelSize >= 36 ? (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
            Career OS
          </span>
        ) : null}
      </div>
    </div>
  );
}
