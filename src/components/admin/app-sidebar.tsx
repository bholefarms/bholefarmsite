"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, PanelLeftClose, PanelLeft, Wheat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { adminNav } from "@/config/admin-nav";

interface AppSidebarProps {
  userName?: string;
  onSignOut: () => void;
}

export function AppSidebar({ userName, onSignOut }: AppSidebarProps) {
  const pathname = usePathname();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const isMobile = useMobile();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex items-center border-b px-4 py-3.5",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Wheat className="size-5 text-primary" />
            <span className="text-sm font-semibold">Bhole Farms</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin/dashboard">
            <Wheat className="size-5 text-primary" />
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {adminNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5 shrink-0", collapsed && "size-5")} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className={cn(
                    "absolute inset-0 rounded-lg bg-primary/10 -z-10",
                    collapsed ? "inset-x-1" : ""
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "border-t p-3",
        collapsed ? "flex flex-col items-center gap-2" : "space-y-2"
      )}>
        {userName && !collapsed && (
          <p className="truncate px-1 text-xs text-muted-foreground">{userName}</p>
        )}
        <button
          onClick={onSignOut}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors",
            collapsed
              ? "justify-center p-2.5"
              : "gap-3 px-3 py-2.5 w-full"
          )}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-full w-60 overflow-y-auto border-r bg-card shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "hidden md:flex h-screen flex-col overflow-hidden border-r bg-card shadow-sm",
        "sticky top-0"
      )}
    >
      {sidebarContent}
    </motion.aside>
  );
}
