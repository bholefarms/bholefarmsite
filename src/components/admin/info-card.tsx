"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function InfoCard({ label, value, icon, className }: InfoCardProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border bg-card p-4", className)}>
      {icon && (
        <div className="mt-0.5 rounded-md bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
