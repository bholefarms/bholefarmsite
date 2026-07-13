# Bhole Farms — Free Architecture Plan

> **Goal:** Build a completely free, fully functional website for Bhole Farms — an organic produce farm serving both home consumers (B2C) and bulk buyers (B2B) — deployed entirely on Vercel at ₹0/month.

---

## Brand & Design Direction

### Brand Vibe
- **Modern Earthy** — trustworthy, warm, farm-to-fork transparency
- Dual audience: aspirational for home consumers, professional for bulk buyers

### Color Palette
| Role | Color | Hex |
|---|---|---|
| Primary | Deep Forest Green | `#2E7D32` |
| Secondary | Earthy Brown | `#5D4037` |
| Accent | Warm Gold | `#F9A825` |
| Background | Warm Cream | `#F5F0EB` |

### Typography
- **Headings:** Playfair Display (serif — premium, trustworthy)
- **Body:** Inter (sans-serif — clean, readable)

### Logo
- **Style:** Emblem/badge — circular seal with leaf/sprout icon
- **Type:** Combination mark (icon + wordmark)
- Single dark green, works in white on dark bg
- Must render clean at 32px favicon

### UI Direction
- Full-bleed hero with real farm/produce photo (no carousel)
- Product cards: image-focused, price + "Enquire" button
- Floating WhatsApp button (bottom-right, all pages)
- Dedicated "Bulk Enquiry" path for B2B
- Trust badges: certifications, farmer photos

---

## Technology Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Server components, API routes, server actions |
| Language | **TypeScript** | Type safety |
| Styling | **Tailwind CSS** | Utility-first, fast UI |
| UI Library | **shadcn/ui** | Accessible, customizable components |
| Database | **Supabase (PostgreSQL)** | 500MB free, connection pooling, dashboard |
| ORM | **Prisma** | Type-safe DB access, migrations |
| Auth | **NextAuth.js v5 (Auth.js)** | JWT, credentials provider, middleware |
| Images | **Cloudinary** | 25GB free, CDN, transformations |
| Email | **Resend** | 100 emails/day free |
| Analytics | **Vercel Analytics** | 2500 pageviews/month free |
| Forms | **React Hook Form + Zod** | Validation |
| Rate Limiting | **Upstash** | 10k req/day free tier |
| Domain | `bholefarms.vercel.app` (free) | Custom domain later |
| **Total Monthly Cost** | **₹0** | |

---

## Database Schema (Prisma)

```
User          — id, name, email, hashedPassword, role (ADMIN), createdAt
Product       — id, name, slug, description, price, categoryId, images[],
                isFeatured, isSeasonal, season, stock, createdAt, updatedAt
Category      — id, name, slug, description, image, order, createdAt
GalleryItem   — id, title, image, category, createdAt
BlogPost      — id, title, slug, content, excerpt, coverImage, published,
                createdAt, updatedAt
Order         — id, customerName, phone, email, productId, quantity,
                message, status (PENDING/CONTACTED/COMPLETED/CANCELLED),
                createdAt
Testimonial   — id, name, role, content, rating, avatar, order, createdAt
Setting       — id, key, value  (site name, logo, contact, social links,
                homepage hero/banners, SEO defaults)
```

---

## Folder Structure

```
/app
  (website)/
    page.tsx                  # Home
    products/
      page.tsx                # Product listing
      [slug]/page.tsx         # Product detail
    about/page.tsx
    contact/page.tsx
    gallery/page.tsx
    blog/
      page.tsx
      [slug]/page.tsx
    faq/page.tsx
    order/page.tsx            # Order form
  (admin)/
    login/page.tsx
    admin/
      dashboard/page.tsx
      products/
        page.tsx
        new/page.tsx
        [id]/edit/page.tsx
      categories/page.tsx
      gallery/page.tsx
      blog/page.tsx
      orders/page.tsx
      settings/page.tsx
      homepage/page.tsx
      testimonials/page.tsx
      contact-details/page.tsx
      seo/page.tsx
  api/
    auth/[...nextauth]/route.ts
    orders/route.ts
    contact/route.ts
/components
  /ui                        # shadcn components
  /shared                    # Header, Footer, Layout
  /products
  /gallery
  /blog
/lib/
  prisma.ts                  # Prisma client singleton
  cloudinary.ts              # Upload helpers
  resend.ts                  # Email helpers
  utils.ts                   # cn(), formatters
/hooks                       # Custom React hooks
/actions                     # Server Actions
  products.ts
  categories.ts
  gallery.ts
  blog.ts
  orders.ts
  settings.ts
/prisma/
  schema.prisma
  seed.ts
/public/
  images/
```

---

## Key Architecture Decisions

### 1. Image Handling
- Uploads → Cloudinary unsigned upload preset
- Use `<img>` with Cloudinary `f_auto,q_auto` to avoid Vercel 1000-img/month limit
- Store Cloudinary public IDs in DB

### 2. Order Flow (Inquiry Only — No Payment)
```
Customer → Product Page → Order Form (RHF + Zod)
  → Server Action saves to Supabase
  → Resend email notification to admin
  → Confirmation shown to customer
  → Admin views/manages order in /admin/orders
  → Admin contacts customer via phone (collected in form)
```
- No automated WhatsApp (only `wa.me` link for customers to contact farm)
- Payment (Razorpay/UPI) = future phase

### 3. Auth Flow
- NextAuth.js v5 with **Credentials provider** only (admin login)
- JWT strategy (no DB session table)
- Middleware protects `/admin/*`
- Default admin seeded via `prisma/seed.ts`

### 4. Rate Limiting
- Upstash Redis free tier for form endpoints
- Contact form: 1 request/60s per IP
- Order creation: 1 request/30s per IP

### 5. Prisma + Supabase + Serverless
- `DATABASE_URL` with `?pgbouncer=true`
- `preparedStatements = false` in Prisma datasource
- Prisma client singleton to prevent cold-start connections

---

## Skill Pipeline (Feature → Skill Mapping)

Every feature/component in the project has at least one skill mapped. Where no specialized skill exists, `nextjs-developer` covers it.

### Phase 0: Discovery & Planning
| Part | Skill | Purpose |
|---|---|---|
| Requirements gathering | `brainstorming` | ✅ Done — design approved |
| Implementation plans | `writing-plans` | Write per-feature implementation plans |
| User stories / AC | `feature-forge` | Define acceptance criteria per feature |
| Architecture critique | `the-fool` | Red team before building |

### Phase 1: Brand & Design
| Part | Skill | Purpose |
|---|---|---|
| Brand voice & guidelines | `brand` | Messaging, tone, positioning |
| **Logo creation** | `design` | Emblem logo — leaf icon + wordmark |
| Design tokens | `design-system` | Colors, typography spacing scale |
| UI patterns | `ui-ux-pro-max` | Layout decisions, UX flow |
| **Tailwind + shadcn/ui** | `ui-styling` | Component styling, dark mode, responsive |

### Phase 2: Architecture
| Part | Skill | Purpose |
|---|---|---|
| System architecture | `architecture-designer` | Component diagram, ADRs |
| **API route design** | `api-designer` | Route structure, request/response shapes |
| **Prisma schema** | `database-optimizer` | Models, relations, indexing |

### Phase 3: Frontend — Components
| Part | Skill | Purpose |
|---|---|---|
| **App Router pages** | `nextjs-developer` | Route groups, layouts, loading/error boundaries |
| **React components** | `react-expert` | Product cards, gallery, blog, forms |
| **Custom hooks** | `react-expert` | useProducts, useGallery, useOrders |
| **TypeScript types** | `typescript-pro` | Type safety across all components |
| **Floating WhatsApp btn** | `ui-styling` + `react-expert` | Fixed button with wa.me link |

### Phase 4: Backend — Features
| Part | Skill | Purpose |
|---|---|---|
| **NextAuth.js setup** | `secure-code-guardian` | JWT, credentials provider, middleware |
| **Server Actions** | `nextjs-developer` | Product CRUD, order form, contact form |
| **API routes** | `nextjs-developer` | Order webhooks, contact endpoint |
| **Prisma queries** | `database-optimizer` | Optimized queries, prepared statements |
| **Cloudinary uploads** | `nextjs-developer` | (No dedicated skill — handled by nextjs-developer) |
| **Resend email** | `nextjs-developer` | (No dedicated skill — handled by nextjs-developer) |
| **Upstash rate limiting** | `nextjs-developer` | (No dedicated skill — handled by nextjs-developer) |
| **Input validation** | `secure-code-guardian` | Zod schemas, XSS prevention |

### Phase 5: Admin Panel
| Part | Skill | Purpose |
|---|---|---|
| **Admin login** | `secure-code-guardian` | Route protection, session |
| **Dashboard** | `nextjs-developer` | Stats, recent orders |
| **Product CRUD** | `nextjs-developer` | Form, list, edit, delete |
| **Category CRUD** | `nextjs-developer` | Form, list, edit, delete |
| **Gallery CRUD** | `nextjs-developer` | Upload, reorder, delete |
| **Blog CRUD** | `nextjs-developer` | Rich text, publish/draft |
| **Order management** | `nextjs-developer` | View, update status |
| **Settings / SEO** | `nextjs-developer` | Editable site config |

### Phase 6: Testing
| Part | Skill | Purpose |
|---|---|---|
| Test strategy | `test-master` | What/ how to test |
| **Unit tests** | `test-patterns` | Components, actions, utils |
| **E2E tests (admin)** | `playwright-expert` | Login, CRUD flows |

### Phase 7: Deployment & DevOps
| Part | Skill | Purpose |
|---|---|---|
| **Vercel deploy** | `deploy` | CI/CD, env vars, domain |
| **Environment setup** | `env-setup` | .env.example, Getting Started guide |

### Phase 8: Code Quality
| Part | Skill | Purpose |
|---|---|---|
| Code audit | `code-reviewer` | Quality, smells, N+1 |
| Security audit | `security-reviewer` | Vulnerabilities, secrets |
| **Website SEO** | `nextjs-developer` | sitemap.xml, metadata, JSON-LD |
| Documentation | `code-documenter` | README, API docs |

### Process Skills (Throughout Build)
| When | Skill |
|---|---|
| Executing any plan | `executing-plans` |
| Dispatching parallel features | `subagent-driven-development` |
| Running independent tasks | `dispatching-parallel-agents` |
| Before claiming done | `verification-before-completion` |
| Before merging | `requesting-code-review` |
| Completion workflow | `finishing-a-development-branch` |

---

## Security
- NextAuth.js handles JWT + CSRF
- Zod validation on all Server Actions
- Middleware protection on `/admin/*`
- Rate limiting on public form endpoints
- XSS protection via React/Next.js built-in escaping
- Admin routes check `session.user.role === 'ADMIN'`

## SEO
- `generateMetadata` on all public pages
- Dynamic sitemap via `/sitemap.xml`
- `robots.txt`
- JSON-LD structured data for Products, Blog, Organization
- Editable SEO fields per page from admin panel

## Environment Variables
```
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Free Tier Budget
| Service | Limit | Expected |
|---|---|---|
| Vercel Hobby | 100hr func/mo, 100GB bw | Well under |
| Supabase Free | 500MB DB, 5GB bw | Fine |
| Cloudinary Free | 25GB storage, 25GB bw | Fine |
| Resend Free | 100 emails/day | ~5-10/day |
| Upstash Free | 10k req/day | Fine |
| Vercel Analytics | 2500 pageviews/mo | Tight — monitor |

---

## Future Features (not in scope)
- Razorpay / UPI Payments
- Customer Accounts / Wishlist
- Reviews & Ratings
- Delivery Tracking
- Invoice Generation
- Inventory Management
- Mobile App
