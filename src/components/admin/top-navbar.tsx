"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { Breadcrumbs } from "./breadcrumbs";
import { GlobalSearch } from "./global-search";
import { NotificationMenu } from "./notification-menu";
import { UserMenu } from "./user-menu";
import { QuickAdd } from "./quick-add";

interface TopNavbarProps {
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
}

function usePageTitle(): string {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const crumbs = adminIndex >= 0 ? segments.slice(adminIndex + 1) : [];

  if (crumbs.length === 0) return "Dashboard";
  const last = crumbs[crumbs.length - 1];
  if (last === "new") return "New";
  if (last === "edit") return "Edit";
  if (/^[0-9a-f]{8,}$/i.test(last) || last.length > 20) {
    const parent = crumbs[crumbs.length - 2];
    if (parent === "products") return "Product Details";
    if (parent === "orders") return "Order Details";
    if (parent === "blog" || parent === "gallery") return "Edit";
    return "Details";
  }
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

export function TopNavbar({ userName, userEmail, onSignOut }: TopNavbarProps) {
  const { setMobileOpen } = useSidebar();
  const isMobile = useMobile();
  const pageTitle = usePageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center border-b bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex w-full items-center gap-4">
        {/* Left: Mobile hamburger + Breadcrumbs + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
          )}
          <div className="flex flex-col min-w-0">
            <Breadcrumbs className="hidden sm:flex" />
            <h1 className="text-lg font-semibold tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 justify-center max-w-lg">
          <GlobalSearch />
        </div>

        {/* Right: QuickAdd + Notifications + User */}
        <div className="flex items-center gap-2 shrink-0">
          <QuickAdd />
          <NotificationMenu />
          <div className="ml-1 pl-2 border-l">
            <UserMenu
              name={userName}
              email={userEmail}
              onSignOut={onSignOut}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
