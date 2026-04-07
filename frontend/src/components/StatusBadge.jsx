import React from "react";

const STATUS_COLORS = {
  Applied: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Screened: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Shortlisted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Interview Scheduled": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Offered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  closed: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export default function StatusBadge({ status }) {
  const classes = STATUS_COLORS[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize ${classes}`}>
      {status}
    </span>
  );
}
