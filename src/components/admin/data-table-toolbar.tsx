"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps {
  children?: ReactNode;
  className?: string;
}

export function DataTableToolbar({ children, className }: DataTableToolbarProps) {
  if (!children) return null;
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      {children}
    </div>
  );
}
