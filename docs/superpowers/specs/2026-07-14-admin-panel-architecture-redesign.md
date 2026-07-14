# Admin Panel Architecture Redesign

**Date:** 2026-07-14
**Status:** Approved Design

## Goal

Completely separate the Bhole Farms Public Website and Admin Panel into independent route groups with dedicated layouts, navigation, and styling — sharing only backend, authentication, Prisma models, and server actions.

---

## Architecture

```
app/
├── layout.tsx                    ← Minimal root: html, body, fonts, Providers
├── (public)/                     ← Public website route group
│   ├── layout.tsx                ← Public Header + Footer + website chrome
│   ├── page.tsx                  ← Homepage
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── faq/
│   ├── gallery/
│   └── products/
├── (admin)/                      ← Admin panel route group
│   ├── layout.tsx                ← Admin-specific body/styling (no public components)
│   └── admin/
│       ├── login/
│       │   └── page.tsx          ← Standalone centered form, no sidebar
│       └── (protected)/
│           ├── layout.tsx        ← Auth gate + AdminShell
│           ├── dashboard/
│           ├── products/
│           ├── categories/
│           ├── gallery/
│           ├── blog/
│           ├── orders/
│           ├── media/
│           ├── settings/
│           ├── customers/        ← Future: empty state
│           └── analytics/        ← Future: empty state
└── api/                          ← Shared API routes
```

### Root Layout (`app/layout.tsx`)

Only renders:
- `<html>` with font variables
- `<body>` with `Providers`
- Session Provider (NextAuth)
- Toast/Sonner Provider
- Global CSS import

Does NOT render:
- Public Header
- Public Footer
- Navigation
- Sidebar

### Public Layout (`app/(public)/layout.tsx`)

Renders:
- `<Header />` (existing public header with logo, NAV_LINKS, Shop Now)
- `<main>{children}</main>`
- `<Footer />`
- `<WhatsAppButton />`

### Admin Root Layout (`app/(admin)/layout.tsx`)

Renders:
- Admin-specific `<body>` styling
- No public components
- No header, no footer, no navigation

### Admin Protected Layout (`app/(admin)/admin/(protected)/layout.tsx`)

Renders:
- Auth guard (redirect to login if unauthenticated)
- `<AdminShell>` (see below)
- `<Toaster />` for notifications

---

## AdminShell Component

Single source of truth for admin layout. Renders:

```
AdminShell
├── Sidebar              ← Collapsible, 280px / 72px
├── TopNavbar            ← 72px sticky, breadcrumb+page title | global search | notifications+user+quickadd
├── <main>
│   ├── <PageHeader />   ← title + subtitle + actions
│   └── {children}       ← Page content
└── Mobile Drawer        ← Sidebar overlay for mobile
```

### TopNavbar

**Left:** Breadcrumb (auto-generated from route) + current page title

**Center:** Global Search (command palette / `⌘K`)

**Right:**
- NotificationMenu (bell icon, dropdown, empty state for now)
- UserMenu (avatar dropdown: name, email, Profile, Settings, Sign Out)
- QuickAdd (dropdown: +Product, +Gallery Item, +Blog Post, +Category, +Customer)

**Styling:**
- 72px height
- Sticky top-0, z-30
- White background, bottom border
- Padding: 24–32px horizontal
- Flexbox: justify-between, align-items-center

### AppSidebar

**Desktop:**
- 280px expanded, 72px collapsed
- Animation on collapse/expand (spring)
- Sticky top-0, h-screen
- Border-right, bg-card, shadow-sm
- Brand logo at top (full in expanded, icon-only in collapsed)
- Navigation items from `adminNav` config
- Active indicator (animated pill/bg)
- Collapse toggle button
- Sign Out at bottom

**Mobile:**
- Drawer overlay from left
- 280px width
- Backdrop overlay with click-to-close
- Spring animation

**Navigation Config (`src/config/admin-nav.ts`):**

```ts
export const adminNav: AdminNavItem[] = [
  { href: "/admin/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/products",     label: "Products",      icon: ShoppingBag },
  { href: "/admin/categories",   label: "Categories",    icon: FolderTree },
  { href: "/admin/gallery",      label: "Gallery",       icon: Images },
  { href: "/admin/blog",         label: "Blog",          icon: Newspaper },
  { href: "/admin/orders",       label: "Orders",        icon: ShoppingCart },
  { href: "/admin/customers",    label: "Customers",     icon: Users },         // Future
  { href: "/admin/analytics",    label: "Analytics",     icon: BarChart3 },     // Future
  { href: "/admin/media",        label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings",     label: "Settings",      icon: Settings },
];
```

Future modules only need one object added here.

---

## Shared Components

### QuickAdd
Global dropdown accessible from TopNavbar. Always shows same options:
- + New Product
- + Gallery Item
- + Blog Post
- + Category
- + Customer (future)

No per-page logic. Becomes muscle memory.

### GlobalSearch
Command palette (`⌘K` on desktop). Searches across:
- Products, Categories, Orders, Gallery, Blog, Media, Settings

Future-proofed: searchable items list is configurable.

### Breadcrumbs
Auto-generated from the current route path:

```
/admin/products/edit/123
→ Dashboard > Products > Edit Product
```

Uses `pathname` segments, maps slugs to readable labels via a label map.

### NotificationMenu
Bell icon → dropdown with notification list. Empty state: "No notifications yet." Hooked up to real data later with zero layout changes.

### UserMenu
Avatar (initials from name) → dropdown:
- Name + Email (header)
- Profile link
- Settings link
- Divider
- Sign Out (red)

### PageHeader
Consistent across all admin pages. Server-component friendly:
- **Left:** Title (h1) + subtitle (optional)
- **Right:** Action buttons (passed as children)

Used by all page-level server components. No client component implements its own header.

### EmptyState
Used for Customers, Analytics, and any empty data views. Takes title + description + optional action button.

### LoadingSkeleton
Reusable skeleton loader for async content areas.

---

## Admin Theme

- **Font:** Inter (not Playfair Display)
- **Colors:** Neutral grays, #166534 green accent, warm cream bg #F8F8F5
- **Radii:** 12–16px on cards/sections
- **Shadows:** Soft (shadow-sm, shadow-md)
- **Spacing:** Professional, 24–32px gutters
- **Max content width:** 1440px

No website typography or spacing leaks into admin.

---

## Pages Requiring Migration

| Page | Status |
|------|--------|
| Dashboard | Existing, works |
| Products | Existing, works |
| Categories | Existing, works |
| Gallery | Existing, works |
| Blog | Existing, works |
| Orders | Existing, works |
| Media Library | Existing, works |
| Settings | Existing, works |
| Customers | New, empty state |
| Analytics | New, empty state |

---

## Verification

After each migration phase:

1. `npm run lint` — zero new errors
2. `npx tsc --noEmit` — zero type errors
3. Authentication flow works (login → protected pages → logout)
4. File uploads work (products, gallery)
5. CRUD operations work on all pages
6. Responsive layout: desktop, tablet, mobile
7. No public components render inside admin routes
8. No admin components render inside public routes

---

## Migration Phases

### Phase 1a — Route group separation
- Strip `app/layout.tsx` to minimal (html, body, fonts, providers only)
- Create `app/(public)/layout.tsx` with Header + Footer from root layout
- Rename `(website)/` to `(public)/`
- Verify: public site unchanged, admin has no public header/footer

### Phase 1b — Admin layout creation
- Create `app/(admin)/layout.tsx` with admin-specific styling
- Update `(protected)/layout.tsx` with new AdminShell
- Verify: admin pages render correctly with sidebar + topnav

### Phase 2 — AdminShell redesign
- Rewrite AdminShell: single source of truth layout
- Rewrite TopNavbar: breadcrumb+title | search | notifications+user+quickadd
- Rewrite AppSidebar: 280/72px, new nav items, better animation
- Rewrite AvatarMenu → UserMenu: Profile, Settings, Logout
- Create QuickAdd, GlobalSearch, NotificationMenu
- Create auto-breadcrumbs from route
- Remove navigation from TopNavbar, remove logo from header
- Verify all admin pages render correctly

### Phase 3 — New pages
- Create Customers page (empty state)
- Create Analytics page (empty state)
- Add both to adminNav config
- Verify navigation renders correctly

### Phase 4 — Responsive + polish
- Mobile sidebar drawer
- Tablet layout checks
- Collapsed sidebar behavior
- Keyboard navigation
- Accessibility audit

### Phase 5 — Final verification
- Full lint + type check
- Full CRUD verification across all pages
- Auth flow verification
- Responsive verification

---

## Not In Scope

- Real notification system (NotificationMenu is built but data is future)
- Real analytics data (page exists with empty state)
- Real customer management (page exists with empty state)
- Media Library file management beyond what exists
- Changing any Prisma models, server actions, or auth logic
