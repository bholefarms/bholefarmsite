"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarMenuProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  onSignOut: () => void;
  className?: string;
}

export function AvatarMenu({ name, email, avatarUrl, onSignOut, className }: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="size-8 rounded-full object-cover" />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        )}
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight">{name}</p>
          {email && <p className="text-[11px] text-muted-foreground">{email}</p>}
        </div>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-lg border bg-popover py-1 shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="size-4" />
            Settings
          </button>
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
