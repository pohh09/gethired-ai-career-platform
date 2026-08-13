import { useJobs } from "../../hooks/useJobs";
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
import type { Job } from "../../types/job";

export default function RecentJobs() {
  const { data, isLoading } = useJobs({ page: 1, limit: 5, sortBy: "newest" });

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
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
    <div className="mt-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 dark:border-slate-800 p-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Recent Applications
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data.map((job: Job) => (
            <TableRow key={job._id}>
              <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                {job.company}
              </TableCell>
              <TableCell>{job.role}</TableCell>
              <TableCell>
                <Badge variant={job.status} dot>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={job.priority}>{job.priority}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
