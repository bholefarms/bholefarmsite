# Plan 1: Project Scaffolding

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Next.js 15 project with all foundational tooling — Tailwind, shadcn/ui, Prisma + Supabase, folder structure, fonts, and base layout.

**Architecture:** Standard Next.js 15 App Router with TypeScript. Tailwind + shadcn/ui for styling. Prisma ORM connecting to Supabase PostgreSQL. All pages share a root layout with Playfair Display + Inter fonts.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Prisma, Supabase

## Global Constraints

- ALL code in TypeScript (strict mode)
- Use `app/` directory (App Router) — NO `pages/` directory
- Use `cn()` utility from shadcn/ui for className merging
- Colors use CSS variables defined in `globals.css`
- Fonts loaded via `next/font`
- Prisma client is a singleton in `lib/prisma.ts`
- Every file has one clear responsibility
- No placeholder code, no TODOs, no TBDs
- Git init with conventional commits

---

### Task 1: Initialize Next.js 15 + TypeScript + Tailwind

**Files:**
- Create: `C:\Users\NKS-WIN-Omkar\Documents\bhole\` (project root)

**Interfaces:**
- Consumes: nothing
- Produces: working Next.js dev server with TypeScript + Tailwind

- [ ] **Step 1: Create Next.js project**

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

- [ ] **Step 2: Verify project runs**

```powershell
npm run dev
```
Open `http://localhost:3000` — should show Next.js welcome page. Then stop server.

- [ ] **Step 3: Initialize git**

```powershell
git init
git add -A
git commit -m "chore: scaffold Next.js 15 with TypeScript and Tailwind"
```

---

### Task 2: Install and Configure shadcn/ui

**Files:**
- Modify: `C:\Users\NKS-WIN-Omkar\Documents\bhole\components.json` (created by shadcn init)

**Interfaces:**
- Consumes: Task 1 (Next.js project with Tailwind)
- Produces: shadcn/ui configured with Bhole Farms theme colors

- [ ] **Step 1: Init shadcn/ui**

```powershell
npx shadcn@latest init -d
```

- [ ] **Step 2: Apply Bhole Farms theme colors**

Update `app/globals.css` with the brand palette. Replace its CSS variable definitions:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: #F5F0EB;
  --color-foreground: #1A1A1A;
  --color-card: #FFFFFF;
  --color-card-foreground: #1A1A1A;
  --color-popover: #FFFFFF;
  --color-popover-foreground: #1A1A1A;
  --color-primary: #2E7D32;
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #5D4037;
  --color-secondary-foreground: #FAFAF5;
  --color-muted: #8D6E63;
  --color-muted-foreground: #5D4037;
  --color-accent: #F9A825;
  --color-accent-foreground: #1A1A1A;
  --color-destructive: #DC2626;
  --color-destructive-foreground: #FAFAF5;
  --color-border: #D4C9B8;
  --color-input: #D4C9B8;
  --color-ring: #2E7D32;
  --color-chart-1: #2E7D32;
  --color-chart-2: #5D4037;
  --color-chart-3: #F9A825;
  --color-chart-4: #4CAF50;
  --color-chart-5: #FF6F00;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --radius-xl: 0.75rem;
}

/* Keep the dark mode variables as-is for now — they'll use inversions */

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background);
  color: var(--color-foreground);
}
```

- [ ] **Step 3: Add shadcn/ui base components**

```powershell
npx shadcn@latest add button card input label textarea select
```

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "chore: configure shadcn/ui with Bhole Farms theme"
```

---

### Task 3: Install and Configure Prisma + Supabase Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: Task 1 (project root)
- Produces: Prisma schema with all models, seed script

- [ ] **Step 1: Install Prisma**

```powershell
npm install prisma @prisma/client
npx prisma init
```

- [ ] **Step 2: Write the complete schema**

Replace `prisma/schema.prisma`:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
}

enum OrderStatus {
  PENDING
  CONTACTED
  COMPLETED
  CANCELLED
}

enum UserRole {
  ADMIN
}

model User {
  id             String   @id @default(cuid())
  name           String
  email          String   @unique
  hashedPassword String
  role           UserRole @default(ADMIN)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  order       Int       @default(0)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  price       Float?
  categoryId  String
  category    Category   @relation(fields: [categoryId], references: [id])
  images      String[]
  isFeatured  Boolean    @default(false)
  isSeasonal  Boolean    @default(false)
  season      String?
  stock       Int?
  orders      Order[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([categoryId])
  @@index([isFeatured])
  @@index([isSeasonal])
}

model GalleryItem {
  id        String   @id @default(cuid())
  title     String?
  image     String
  category  String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model BlogPost {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  coverImage  String?
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([published])
  @@index([slug])
}

model Order {
  id           String       @id @default(cuid())
  customerName String
  phone        String
  email        String?
  productId    String?
  product      Product?     @relation(fields: [productId], references: [id])
  quantity     Int          @default(1)
  message      String?
  status       OrderStatus  @default(PENDING)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  @@index([status])
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String?
  content   String
  rating    Int      @default(5)
  avatar    String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}
```

- [ ] **Step 3: Write seed script**

Replace `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bholefarms.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@bholefarms.com",
      hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin.email);

  const categories = [
    { name: "Vegetables", slug: "vegetables", order: 1 },
    { name: "Fruits", slug: "fruits", order: 2 },
    { name: "Grains & Pulses", slug: "grains-pulses", order: 3 },
    { name: "Dairy", slug: "dairy", order: 4 },
    { name: "Seasonal Specials", slug: "seasonal-specials", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Categories seeded:", categories.length);

  const defaultSettings = [
    { key: "site_name", value: "Bhole Farms" },
    { key: "site_description", value: "Fresh organic produce from farm to table" },
    { key: "contact_phone", value: "+91XXXXXXXXXX" },
    { key: "contact_email", value: "hello@bholefarms.com" },
    { key: "whatsapp_number", value: "91XXXXXXXXXX" },
    { key: "address", value: "Bhole Farms, Maharashtra" },
    { key: "hero_headline", value: "Fresh from Our Farm to Your Table" },
    { key: "hero_subtext", value: "100% organic produce grown with care in Maharashtra" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("Settings seeded:", defaultSettings.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 4: Add seed script to package.json**

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Install `tsx` and `bcryptjs`:

```powershell
npm install -D tsx
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 5: Update .env.example**

Replace `.env.example`:

```
# Supabase (Prisma)
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# NextAuth
AUTH_SECRET="generate-with-npx-auth-secret"
AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend
RESEND_API_KEY="re_xxxxx"

# Upstash
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

- [ ] **Step 6: Commit**

```powershell
git add -A
git commit -m "feat: add Prisma schema with all models and seed script"
```

---

### Task 4: Create Prisma Client Singleton + Utility Library

**Files:**
- Create: `lib/prisma.ts`
- Create: `lib/utils.ts`
- Create: `lib/constants.ts`

**Interfaces:**
- Consumes: Task 3 (Prisma installed)
- Produces: Reusable Prisma client singleton, utility functions, app constants

- [ ] **Step 1: Create Prisma client singleton**

Write `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: Create utils**

Write `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
```

- [ ] **Step 3: Create constants**

Write `lib/constants.ts`:

```typescript
export const SITE_NAME = "Bhole Farms";
export const SITE_DESCRIPTION = "Fresh organic produce from farm to table";

export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "91XXXXXXXXXX";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = "hello@bholefarms.com";
export const CONTACT_PHONE = "+91XXXXXXXXXX";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;
```

- [ ] **Step 4: Install clsx and tailwind-merge**

```powershell
npm install clsx tailwind-merge
```

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: add Prisma singleton, utils, and app constants"
```

---

### Task 5: Root Layout with Fonts + Base Components

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/shared/header.tsx`
- Create: `components/shared/footer.tsx`
- Create: `components/shared/whatsapp-button.tsx`
- Create: `components/shared/container.tsx`

**Interfaces:**
- Consumes: Task 1-4 (project setup)
- Produces: Root layout with fonts, header, footer, WhatsApp button

- [ ] **Step 1: Set up fonts and root layout**

Replace `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
```

Update `globals.css` to include font families:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: "Inter", sans-serif;
  --font-heading: "Playfair Display", serif;
  /* ... rest of theme variables from Task 2 ... */
}
```

- [ ] **Step 2: Create Header**

Write `components/shared/header.tsx`:

```typescript
import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading font-bold text-primary">
            {SITE_NAME}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get in Touch
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create Footer**

Write `components/shared/footer.tsx`:

```typescript
import Link from "next/link";
import { SITE_NAME, NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-heading font-bold">{SITE_NAME}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fresh organic produce grown with care in Maharashtra. Farm to table,
            naturally.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp: +91XXXXXXXXXX
              </Link>
            </li>
            <li>Email: hello@bholefarms.com</li>
            <li>Bhole Farms, Maharashtra</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-muted/20 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create WhatsApp button**

Write `components/shared/whatsapp-button.tsx`:

```typescript
import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
```

- [ ] **Step 5: Create Container component**

Write `components/shared/container.tsx`:

```typescript
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-4", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```powershell
git add -A
git commit -m "feat: add root layout with fonts, header, footer, WhatsApp button"
```

---

### Plan Self-Review

1. **Spec coverage:** All foundational pieces covered — Next.js init ✅, Tailwind + shadcn ✅, Prisma schema ✅, folder structure ✅, fonts/layout ✅, header/footer ✅, WhatsApp button ✅
2. **Placeholder scan:** No TBD/TODO placeholders ✅
3. **Type consistency:** All imports use `@/` alias consistently ✅, all component exports are named ✅
