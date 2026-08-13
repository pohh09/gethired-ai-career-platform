import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/Table";
import Badge from "../ui/Badge";
import { SkeletonTableRow } from "../ui/Skeleton";
import { Eye, Edit2, Trash2 } from "lucide-react";
import type { Job } from "../../types/job";

export interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  onView?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

export default function JobTable({
  jobs,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: JobTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Applied Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job._id}>
            <TableCell className="font-bold text-slate-900 dark:text-slate-100">
              {job.company}
            </TableCell>
            <TableCell className="font-medium text-slate-800 dark:text-slate-200">
              {job.role}
            </TableCell>
            <TableCell>{job.location || "Remote"}</TableCell>
            <TableCell className="font-mono text-xs">
              {job.salary ? `$${job.salary.toLocaleString()}` : "N/A"}
            </TableCell>
            <TableCell>
              <Badge variant={job.status} dot>
                {job.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={job.priority}>{job.priority}</Badge>
            </TableCell>
            <TableCell className="text-xs text-slate-500 whitespace-nowrap">
              {new Date(job.appliedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {onView && (
                  <button
                    onClick={() => onView(job)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(job)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit application"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(job)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete application"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
