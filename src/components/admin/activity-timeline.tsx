"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
  emptyMessage?: string;
}

const dotColors: Record<string, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function ActivityTimeline({ events, className, emptyMessage }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
        <Clock className="size-6" />
        <p>{emptyMessage || "No recent activity"}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < events.length - 1 && (
            <div className="absolute left-[11px] top-5 h-full w-px bg-border" />
          )}
          <div className={cn(
            "relative mt-1.5 size-[22px] shrink-0 rounded-full ring-4 ring-white",
            dotColors[event.variant || "default"]
          )}>
            {event.icon && (
              <span className="absolute inset-0 flex items-center justify-center text-white">
                {event.icon}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{event.title}</p>
            {event.description && (
              <p className="text-xs text-muted-foreground">{event.description}</p>
            )}
            <p className="text-[11px] text-muted-foreground">{event.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
