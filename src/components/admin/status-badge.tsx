"use client";

import { cn } from "@/lib/utils";

type StatusVariant =
  | "default" | "success" | "warning" | "danger" | "info"
  | "active" | "inactive" | "pending" | "completed" | "cancelled" | "contacted" | "draft" | "published";

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  info: "bg-blue-50 text-blue-700 ring-blue-600/20",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  inactive: "bg-gray-100 text-gray-600 ring-gray-500/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  contacted: "bg-blue-50 text-blue-700 ring-blue-600/20",
  draft: "bg-gray-100 text-gray-600 ring-gray-500/20",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

interface StatusBadgeProps {
  variant?: StatusVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant = "default", label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantStyles[variant],
        className
      )}
    >
      {label || variant}
    </span>
  );
}
