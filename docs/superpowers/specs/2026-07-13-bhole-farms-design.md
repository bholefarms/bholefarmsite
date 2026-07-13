# Bhole Farms — Design Specification

> **Project:** Organic produce farm website — B2C + B2B
> **Stack:** Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
> **Deployment:** Vercel (Free) | **DB:** Supabase Free | **Cost:** ₹0/month

## Brand Identity

### Brand Voice
- Trustworthy, warm, transparent
- Professional for B2B, welcoming for B2C
- Farm-to-fork storytelling

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#2E7D32` | Buttons, headers, links, brand accent |
| `--secondary` | `#5D4037` | Footer, secondary text, section bg |
| `--accent` | `#F9A825` | Badges, highlights, CTAs |
| `--background` | `#F5F0EB` | Page backgrounds |
| `--muted` | `#8D6E63` | Borders, dividers, muted text |

### Typography
- **Headings:** Playfair Display (serif) — trust, premium
- **Body:** Inter (sans-serif) — clean, readable
- **Scale:** 48-64px (H1) / 36-44px (H2) / 24-30px (H3) / 16-18px (body)

### Logo
- **Style:** Emblem/badge — circular seal with leaf/sprout icon
- **Type:** Combination mark (icon + "BHOLE FARMS" wordmark)
- **Color:** Single dark green, works in white on dark bg
- **Weight:** Must render clean at 32px (favicon)

## UI Design

### Homepage Layout (top to bottom)
1. Full-bleed hero — single strong image + headline + one CTA (no carousel)
2. Featured / Seasonal products grid
3. "Our Story" — farm photos + short narrative
4. Certifications & trust badges
5. Customer testimonials
6. Blog / farm updates
7. B2B Bulk Enquiry CTA
8. Footer — contact, WhatsApp, social, links

### Component Patterns
- **Navigation:** Max 5-6 items, mega-menu for product categories
- **Product Cards:** Image-focused, name, weight, price, "Enquire" button
- **Floating WhatsApp:** Fixed bottom-right, visible on all pages
- **B2B Path:** Dedicated "Bulk Enquiry" page with form (produce, qty, frequency)

## Architecture

### Database (Prisma → Supabase PostgreSQL)
Models: User, Product, Category, GalleryItem, BlogPost, Order, Testimonial, Setting

### Order Flow (Inquiry Only)
Form → Server Action → Supabase insert → Resend email → Confirmation

### Auth (NextAuth.js)
Credentials provider + JWT strategy → protects /admin/*

### Image Strategy
Cloudinary uploads → `<img>` with `f_auto,q_auto` → No Next.js Image optimization (avoids 1000-img limit)

## Key Constraints
- Zero cost — all services on free tiers
- Supabase + Prisma: `pgbouncer=true`, `preparedStatements=false`
- Upstash rate limiting on public forms
- Vercel Analytics (2500 pageviews/mo limit)
