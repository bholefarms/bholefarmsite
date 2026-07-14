# Admin Panel Architecture Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely separate the Bhole Farms Public Website and Admin Panel into independent route groups with dedicated layouts, navigation, and styling — sharing only backend, database, auth, and business logic.

**Architecture:** Minimal root layout (`app/layout.tsx`) provides only html/body/fonts/providers. Public pages get a dedicated layout with Header+Footer. Admin pages get a dedicated layout with AdminShell (sidebar + top navbar) — no public components cross the boundary.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, shadcn/ui

## Global Constraints

- NEVER modify Prisma models, server actions, or auth logic
- NEVER render public components (Header, Footer, WhatsAppButton) inside admin routes
- NEVER reuse admin components in public routes (unless already shared like Button, Input)
- All existing CRUD, upload, order, SEO, gallery, blog functionality must remain unchanged
- After each phase: `npm run lint` zero new errors, `npx tsc --noEmit` zero errors
- Route group names (parentheses) don't affect URLs — renaming `(website)` to `(public)` is safe
- Admin theme: Inter font, neutral grays, #166534 green accent, 12–16px radius, soft shadows
- Admin header: 72px (h-18 in Tailwind v4), sticky top-0, z-30, white bg, border-b
- Sidebar: 280px expanded, 72px collapsed, spring animation
- Max content width: 1440px

---

## File Structure

### Files to Create
- `app/(public)/layout.tsx` — Public layout with Header + Footer + WhatsAppButton
- `app/(admin)/layout.tsx` — Admin root layout (admin background styling only)
- `app/(admin)/admin/(protected)/customers/page.tsx` — Customers empty state page
- `app/(admin)/admin/(protected)/analytics/page.tsx` — Analytics empty state page
- `src/components/admin/global-search.tsx` — Command palette search
- `src/components/admin/quick-add.tsx` — Quick add dropdown
- `src/components/admin/notification-menu.tsx` — Notification bell + dropdown
- `src/components/admin/user-menu.tsx` — User profile dropdown (replaces AvatarMenu)

### Files to Modify
- `app/layout.tsx` — Strip to minimal (html, body, fonts, metadata, providers only — no Header/Footer/WhatsApp)
- `app/(website)/` → rename to `app/(public)/` (route group rename, directory rename)
- `src/components/admin/top-navbar.tsx` — Complete rewrite: breadcrumb+title | search | notifications+user+quickadd
- `src/components/admin/app-sidebar.tsx` — Update nav items, improve active indicator animation
- `src/components/admin/admin-shell.tsx` — Single source of truth for admin layout
- `src/components/admin/breadcrumbs.tsx` — Auto-generate from route pathname
- `src/config/admin-nav.ts` — Add Customers, Analytics; remove SEO (merged into Settings)
- `src/app/(admin)/admin/(protected)/layout.tsx` — Pass pathname context, integrate new components

### Files to Delete
- `src/components/admin/avatar-menu.tsx` — Replaced by user-menu.tsx

---

## Task Breakdown

### Task 1: Strip Root Layout, Create Public Layout, Rename Route Group

**Files:**
- Modify: `app/layout.tsx` (strip Header/Footer/WhatsAppButton)
- Create: `app/(public)/layout.tsx` (new public layout with Header/Footer/WhatsAppButton)
- Rename: `app/(website)/` → `app/(public)/` (directory rename)

**Interfaces:**
- Consumes: Existing `Header`, `Footer`, `WhatsAppButton` components (unchanged)
- Produces: Minimal root layout that wraps everything with just html/body/fonts; Public layout that wraps public pages with Header+Footer

- [ ] **Step 1: Strip root layout (`app/layout.tsx`)**

Remove imports of `Header`, `Footer`, `WhatsAppButton` from root layout. Remove their JSX. Keep only html/body/font variables/metadata/globals.css.

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Fresh • Pure • Organic`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Fresh • Pure • Organic`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create public layout (`app/(public)/layout.tsx`)**

Move Header, Footer, WhatsAppButton from root layout into this. Use same body structure.

```tsx
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
```

- [ ] **Step 3: Rename `(website)` to `(public)`**

Run: `Rename-Item -LiteralPath "src/app/(website)" -NewName "(public)"`

Verify no broken imports or references (route group names don't affect URLs, so `Link` components like `href="/products"` still work).

- [ ] **Step 4: Run lint + type check to verify no regressions**

Run: `npm run lint; npx tsc --noEmit`

Expected: Zero new errors. Existing pre-existing errors unchanged.

- [ ] **Step 5: Quick verification**

Check that public pages still render Header/Footer and admin pages no longer show public Header/Footer (since they skipped the public layout).

Run: `npm run dev` (start dev server, visit `/` and `/admin/dashboard` manually to verify)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: separate public and admin route groups with independent layouts"
```

---

### Task 2: Create Admin Root Layout, Update Protected Layout

**Files:**
- Create: `app/(admin)/layout.tsx`
- Modify: `src/app/(admin)/admin/(protected)/layout.tsx`

**Interfaces:**
- Consumes: Existing `AdminShell` (to be redesigned in later tasks), `auth`, `Toaster`
- Produces: Admin root layout with admin-specific body/styling; protected layout with auth gate

- [ ] **Step 1: Create admin root layout (`app/(admin)/layout.tsx`)**

Minimal layout with admin-specific body class and styling. No public components.

```tsx
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8F5] font-inter antialiased">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Update protected layout**

Keep auth gate + AdminShell wrapper. No structural changes needed yet (AdminShell redesign is Task 3-5).

Current code at `src/app/(admin)/admin/(protected)/layout.tsx` is already correct:
```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <>
      <AdminShell userName={session.user.name || "Admin"} userEmail={session.user.email || undefined}>
        {children}
      </AdminShell>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
```

- [ ] **Step 3: Run lint + type check**

Run: `npm run lint; npx tsc --noEmit`

Expected: Zero new errors.

- [ ] **Step 4: Verify auth flow**

Manual: Visit `/admin/dashboard` → should redirect to `/admin/login`. Login → should show admin shell.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin root layout, update protected layout"
```

---

### Task 3: Update Admin Navigation Config

**Files:**
- Modify: `src/config/admin-nav.ts`

**Interfaces:**
- Consumes: Nothing from previous tasks
- Produces: Updated `adminNav` array with Customers, Analytics, merged SEO into Settings

- [ ] **Step 1: Update `src/config/admin-nav.ts`**

Add `Users`, `BarChart3` imports. Add Customers + Analytics items. Remove SEO (its redirect to Settings makes it redundant in nav). Reorder for logical grouping.

```ts
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Images,
  Newspaper,
  ShoppingCart,
  Users,
  BarChart3,
  Image as ImageIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNav: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors. If there's a redirect from `/admin/seo` to `/admin/settings`, that still works — just the nav item is removed.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: update admin nav config with Customers, Analytics"
```

---

### Task 4: Create UserMenu Component (replaces AvatarMenu)

**Files:**
- Create: `src/components/admin/user-menu.tsx`
- Delete: `src/components/admin/avatar-menu.tsx`

**Interfaces:**
- Produces: `<UserMenu name email avatarUrl onSignOut />` — dropdown with Profile, Settings, Sign Out
- Consumed by: TopNavbar (Task 5)

- [ ] **Step 1: Create `user-menu.tsx`**

Dropdown with: avatar (initials), name + email header, Profile link, Settings link, divider, Sign Out (red).

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  onSignOut: () => void;
  className?: string;
}

export function UserMenu({ name, email, avatarUrl, onSignOut, className }: UserMenuProps) {
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
        className="flex size-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="size-8 rounded-full object-cover" />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border bg-popover py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="border-b px-3 py-2.5">
            <p className="text-sm font-medium">{name}</p>
            {email && <p className="text-xs text-muted-foreground mt-0.5">{email}</p>}
          </div>
          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <User className="size-4 text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="size-4 text-muted-foreground" />
            Settings
          </Link>
          <div className="my-1 border-t" />
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Delete `avatar-menu.tsx`**

Remove the file: `Remove-Item -LiteralPath "src/components/admin/avatar-menu.tsx"`

- [ ] **Step 3: Update any remaining AvatarMenu imports**

Check if `avatar-menu.tsx` is imported anywhere besides `top-navbar.tsx` (which will be rewritten in Task 5).

Run: `rg "avatar-menu" src/ --include "*.tsx" --include "*.ts"`

Expected: Only `top-navbar.tsx` references it (will be updated in Task 5).

- [ ] **Step 4: Run type check**

Run: `npx tsc --noEmit` (may show errors from top-navbar.tsx which will be fixed in Task 5 — that's acceptable)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: create UserMenu component, remove AvatarMenu"
```

---

### Task 5: Create NotificationMenu Component

**Files:**
- Create: `src/components/admin/notification-menu.tsx`

**Interfaces:**
- Produces: `<NotificationMenu />` — bell icon with dropdown, empty state "No notifications yet"
- Consumed by: TopNavbar (Task 6)

- [ ] **Step 1: Create `notification-menu.tsx`**

Bell icon button with dropdown. Empty state now, ready for real data later.

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border bg-popover py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="border-b px-4 py-2.5">
            <p className="text-sm font-semibold">Notifications</p>
          </div>
          <div className="flex flex-col items-center px-4 py-8 text-center">
            <Bell className="size-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: create NotificationMenu component with empty state"
```

---

### Task 6: Create QuickAdd Component

**Files:**
- Create: `src/components/admin/quick-add.tsx`

**Interfaces:**
- Produces: `<QuickAdd />` — "+" button with dropdown: +Product, +Gallery Item, +Blog Post, +Category, +Customer
- Consumed by: TopNavbar (Task 7)

- [ ] **Step 1: Create `quick-add.tsx`**

Global dropdown with fixed options. Each links to the relevant create page.

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, ShoppingBag, Image, FileText, FolderTree, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/admin/products/new", label: "New Product", icon: ShoppingBag },
  { href: "/admin/gallery", label: "New Gallery Item", icon: Image },
  { href: "/admin/blog/new", label: "New Blog Post", icon: FileText },
  { href: "/admin/categories", label: "New Category", icon: FolderTree },
  { href: "/admin/customers", label: "New Customer", icon: UserPlus, disabled: true },
];

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        onClick={() => setOpen(!open)}
        size="sm"
        className="gap-1.5"
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">Quick Add</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border bg-popover py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return item.disabled ? (
              <span
                key={item.href}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
              >
                <Icon className="size-4" />
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="size-4 text-muted-foreground" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: create QuickAdd component with global action menu"
```

---

### Task 7: Create GlobalSearch Component (Command Palette)

**Files:**
- Create: `src/components/admin/global-search.tsx`

**Interfaces:**
- Produces: `<GlobalSearch />` — search icon/input + dropdown with filtered results
- Consumed by: TopNavbar (Task 8)

- [ ] **Step 1: Create `global-search.tsx`**

Command palette style: click/focus opens search input, type to filter results, click to navigate.

Searchable items: Dashboard, Products, Categories, Gallery, Blog, Orders, Media Library, Settings, Customers, Analytics.

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchItem {
  label: string;
  href: string;
}

const searchableItems: SearchItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Media Library", href: "/admin/media" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Analytics", href: "/admin/analytics" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filtered = query.trim()
    ? searchableItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : searchableItems;

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                No results found
              </p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                >
                  <Search className="size-3.5 text-muted-foreground" />
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: create GlobalSearch command palette component"
```

---

### Task 8: Update Breadcrumbs Component (Auto-generate from Route)

**Files:**
- Modify: `src/components/admin/breadcrumbs.tsx`

**Interfaces:**
- Consumes: Current route pathname (via `usePathname`)
- Produces: `<Breadcrumbs />` — auto-generates breadcrumb trail from `/admin/...` route segments
- Consumed by: TopNavbar (Task 9)

- [ ] **Step 1: Rewrite `breadcrumbs.tsx` to auto-generate from route**

Remove the manual `items` prop. Auto-generate from `usePathname()`.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  gallery: "Gallery",
  blog: "Blog",
  orders: "Orders",
  customers: "Customers",
  analytics: "Analytics",
  media: "Media Library",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

function segmentToLabel(segment: string): string {
  // Handle UUIDs or IDs (shorten them)
  if (/^[0-9a-f]{8,}$/i.test(segment) || segment.length > 20) {
    return `#${segment.slice(0, 8)}`;
  }
  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Split path: /admin/dashboard → ["admin", "dashboard"]
  const segments = pathname.split("/").filter(Boolean);
  // Only show crumbs after /admin
  const adminIndex = segments.indexOf("admin");
  const crumbs = adminIndex >= 0 ? segments.slice(adminIndex + 1) : [];

  if (crumbs.length === 0) return null;

  const breadcrumbs = crumbs.map((segment, i) => ({
    label: segmentToLabel(segment),
    href: i < crumbs.length - 1 ? "/admin/" + crumbs.slice(0, i + 1).join("/") : undefined,
  }));

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
      <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">
        <Home className="size-4" />
      </Link>
      {breadcrumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-4 shrink-0" />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-foreground transition-colors truncate max-w-[120px]">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-[160px]">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Check for existing Breadcrumbs usage**

Run: `rg "Breadcrumbs" src/ --include "*.tsx" --include "*.ts"`

If any existing `page.tsx` files pass `items` prop to Breadcrumbs, update them to use the new auto-generating component (remove the `items` prop — it's no longer accepted).

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: auto-generate breadcrumbs from route pathname"
```

---

### Task 9: Rewrite TopNavbar Component

**Files:**
- Modify: `src/components/admin/top-navbar.tsx`

**Interfaces:**
- Consumes: `Breadcrumbs`, `GlobalSearch`, `NotificationMenu`, `UserMenu`, `QuickAdd`
- Produces: New TopNavbar with breadcrumb+title (left) | search (center) | notifications+user+quickadd (right)

- [ ] **Step 1: Rewrite `top-navbar.tsx`**

New design: no logo, no nav items. Left: hamburger (mobile) + Breadcrumbs + page title. Center: GlobalSearch. Right: QuickAdd + NotificationMenu + UserMenu.

```tsx
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
  // Last segment is the current page
  const last = crumbs[crumbs.length - 1];
  if (last === "new") return "New";
  if (last === "edit") return "Edit";
  // Handle IDs — show parent as title
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
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: rewrite TopNavbar with breadcrumbs, search, notifications, user menu, quick add"
```

---

### Task 10: Rewrite AdminShell as Single Source of Truth

**Files:**
- Modify: `src/components/admin/admin-shell.tsx`
- Modify: `src/components/admin/app-sidebar.tsx`

**Interfaces:**
- Consumes: `AppSidebar`, `TopNavbar`, `PageHeader` (from children)
- Produces: New AdminShell that wraps all admin pages with consistent layout

- [ ] **Step 1: Rewrite `admin-shell.tsx`**

Single source of truth for admin layout. Sidebar + TopNavbar + content area with PageContainer wrapper.

```tsx
"use client";

import { type ReactNode } from "react";
import { SidebarProvider } from "@/hooks/use-sidebar-state";
import { AppSidebar } from "./app-sidebar";
import { TopNavbar } from "./top-navbar";
import { logout } from "@/actions/auth";

interface AdminShellProps {
  children: ReactNode;
  userName: string;
  userEmail?: string;
}

export function AdminShell({ children, userName, userEmail }: AdminShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F8F8F5]">
        <AppSidebar userName={userName} onSignOut={async () => { await logout(); }} />
        <div className="flex flex-1 flex-col min-w-0">
          <TopNavbar userName={userName} userEmail={userEmail} onSignOut={async () => { await logout(); }} />
          <main className="flex-1 px-6 pb-10 pt-6 lg:px-8 lg:pt-8">
            <div className="mx-auto max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
```

- [ ] **Step 2: Update `app-sidebar.tsx`**

Keep the existing component structure (already good), but update the expanded width to use `w-60` (240px) for better proportions, and improve the visual polish. The current code is solid — the main change is ensuring it uses the updated `adminNav` config with Customers + Analytics.

No code changes needed if the existing sidebar already references `adminNav` from config (it does). Just verify.

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 4: Verify layout renders correctly**

Manual: Start dev server, visit `/admin/dashboard` — sidebar should show, header should show with new components.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: update AdminShell as single source of truth layout"
```

---

### Task 11: Create Customers and Analytics Pages (Empty State)

**Files:**
- Create: `app/(admin)/admin/(protected)/customers/page.tsx`
- Create: `app/(admin)/admin/(protected)/analytics/page.tsx`

**Interfaces:**
- Consumes: `PageContainer`, `PageHeader`, `EmptyState` components
- Produces: Navigable pages from sidebar with clean empty states

- [ ] **Step 1: Create customers page**

```tsx
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <PageContainer>
      <PageHeader title="Customers" description="Manage your customer relationships" />
      <EmptyState
        icon={<Users className="size-8" />}
        title="No customers yet"
        description="Customer management will be available soon."
      />
    </PageContainer>
  );
}
```

- [ ] **Step 2: Create analytics page**

```tsx
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader title="Analytics" description="Track your farm's performance" />
      <EmptyState
        icon={<BarChart3 className="size-8" />}
        title="No analytics data available yet"
        description="Analytics will be available in a future update."
      />
    </PageContainer>
  );
}
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 4: Verify pages render**

Manual: Navigate to `/admin/customers` and `/admin/analytics` — should show empty states, sidebar nav items highlighted.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Customers and Analytics pages with empty states"
```

---

### Task 12: Final Verification and Cleanup

**Files:**
- All modified/created files from previous tasks

- [ ] **Step 1: Remove unused SEO page (if exists)**

Check: `Test-Path "src/app/(admin)/admin/(protected)/seo/page.tsx"`

If SEO page exists and only redirects to settings, it can stay (no harm). If it has content, verify no nav item points to it.

- [ ] **Step 2: Full lint check**

Run: `npm run lint`

Expected: Zero new errors compared to pre-migration baseline.

- [ ] **Step 3: Full type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 4: Verify auth flow**

Manual: Visit `/admin/dashboard` → redirect to login. Login → see dashboard with new layout. Sign out → redirect to login.

- [ ] **Step 5: Verify uploads work**

Manual: Go to Products → Add Product → upload image → save → verify image displays.

- [ ] **Step 6: Verify CRUD on all pages**

Manual test each: Products, Categories, Gallery, Blog, Orders, Settings, Media Library.

- [ ] **Step 7: Verify responsive layout**

Manual: Resize browser to desktop (≥1024px), tablet (768–1023px), mobile (<768px).

- Desktop: Sidebar visible (expanded or collapsed), TopNavbar with all elements
- Tablet: Sidebar collapsed by default, TopNavbar shows mobile hamburger
- Mobile: Sidebar as drawer overlay, TopNavbar has hamburger + search icon + user

- [ ] **Step 8: Verify no public components in admin**

Manual: Visit any admin page, inspect DOM — should be NO `<header>` from public Header, NO `<footer>`, NO WhatsApp button.

- [ ] **Step 9: Check for console errors**

Open browser DevTools on admin pages — zero console errors, zero hydration warnings.

- [ ] **Step 10: Run build (if possible)**

Run: `npm run build`

Expected: Successful build with zero errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: final verification after admin panel redesign"
```

---

## Verification Checklist (Final)

| Check | Command / Method |
|-------|-----------------|
| Lint | `npm run lint` — zero new errors |
| Type check | `npx tsc --noEmit` — zero errors |
| Build | `npm run build` — success |
| Auth | Login → dashboard → logout works |
| Uploads | Product images, gallery images upload correctly |
| CRUD | All pages: create, read, update, delete |
| Responsive | Desktop / Tablet / Mobile |
| Public isolation | No Header/Footer in admin DOM |
| Console | Zero errors, zero hydration warnings |
| Nav config | All items link to correct pages |
| Sidebar | Expand / collapse / mobile drawer |
