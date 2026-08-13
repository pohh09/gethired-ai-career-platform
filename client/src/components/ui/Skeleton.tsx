export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export default function Skeleton({
  className = "",
  width,
  height,
  circle = false,
}: SkeletonProps) {
  const style = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${
        circle ? "rounded-full" : "rounded-xl"
      } ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton width="40%" height={16} />
        <Skeleton circle width={36} height={36} />
      </div>
      <Skeleton width="60%" height={28} />
      <Skeleton width="80%" height={12} />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60">
      <td className="p-4">
        <Skeleton width="120px" height={16} />
      </td>
      <td className="p-4">
        <Skeleton width="100px" height={16} />
      </td>
      <td className="p-4">
        <Skeleton width="80px" height={16} />
      </td>
      <td className="p-4">
        <Skeleton width="70px" height={24} />
      </td>
      <td className="p-4">
        <Skeleton width="60px" height={24} />
      </td>
      <td className="p-4">
        <Skeleton width="90px" height={16} />
      </td>
      <td className="p-4">
        <Skeleton width="80px" height={28} />
      </td>
    </tr>
  );
}
