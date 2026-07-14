"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardSectionProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function CardSection({ title, description, action, children, className }: CardSectionProps) {
  return (
    <div className={cn("rounded-xl border bg-card shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
