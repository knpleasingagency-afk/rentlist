# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RentList — a Next.js 16 apartment listing platform for Phnom Penh, Cambodia. Owners subscribe (manual invoicing by admin) to list apartments with photos, interactive maps, contact info, and detailed unit types. Public visitors browse, search, filter, and contact owners directly.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

No test suite is configured.

## Tech Stack

- **Next.js 16** (App Router) — React 19, RSC by default. **Important:** This version has breaking changes from prior Next.js releases. Consult `node_modules/next/dist/docs/` before writing any Next.js-specific code (see AGENTS.md).
- **Tailwind CSS 4** + **shadcn/ui** (`base-nova` style, `lucide` icons) — Styling and UI primitives
- **Supabase** — Auth (email/password), PostgreSQL, photo storage
- **Leaflet / react-leaflet** — Interactive maps (OpenStreetMap)
- **Vercel** — Deployment

## Architecture

### Authentication & Authorization

Supabase Auth with two roles: `admin` and `owner` (stored in `profiles.role`). Auth actions are Server Actions in `src/app/auth/actions.ts` (`login`, `register`, `logout`).

**Route protection** uses a middleware-proxy pattern (`src/proxy.ts` → `src/lib/supabase/middleware.ts`):
- `/dashboard` — requires authenticated user
- `/admin` — requires authenticated user + `role = 'admin'` in profiles table

An auto-trigger (`handle_new_user()`) creates a `profiles` row on signup.

### Supabase Client Pattern

Three clients in `src/lib/supabase/`:
- **`client.ts`** — Browser client (`createBrowserClient`), for client components (`"use client"`)
- **`server.ts`** — Server client (`createServerClient` with `cookies()`), for Server Components and Server Actions
- **`middleware.ts`** — Middleware client (cookies from `NextRequest`), used by the proxy

### Database Schema

Two core tables plus an inquiries table:

- **`profiles`** — Linked to `auth.users(id)`. Fields: `full_name`, `phone`, `role` (admin/owner), `subscription_status` (active/inactive), `subscription_expires_at`
- **`listings`** — Core entity. Complex JSONB columns: `photos` (string[]), `amenities` (AmenityItem[]), `units` (UnitType[]). Also has `listing_type` (longterm/shortstay) and `is_featured` (premium/inclusive). See `src/lib/types.ts` for full TypeScript shapes.
- **`inquiries`** — Contact form submissions (public insert, admin read/update). Schema in `inquiries.sql`.

RLS policies: published listings are public; owners manage their own; admins see everything.

**Note:** `database.sql` is the base setup script but may be missing newer columns (`listing_type`, `is_featured`, `units`, `contact_telegram`, `contact_whatsapp`, `contact_website`). The TypeScript types in `src/lib/types.ts` are the authoritative schema reference. Also run `inquiries.sql` (contact form submissions table) and `storage-policy.sql` (photo upload permissions) in the Supabase SQL Editor.

### Subscription Model

Manual invoicing — no payment integration. The admin sets `subscription_status` and `subscription_expires_at` per owner via `/admin/owners/[id]`. The utility `checkAndExpireSubscription()` in `src/lib/subscription.ts` auto-deactivates expired subscriptions and unpublishes all their listings. This is called on dashboard pages.

### Photo Upload Flow

Photos are uploaded to Supabase Storage bucket `listing-photos`. The upload goes through an API route at `/api/upload` (`src/app/api/upload/route.ts`) which uses the `SUPABASE_SERVICE_KEY` (service role) to bypass RLS. Client components (e.g., `ListingForm`, `PhotoUpload`) upload via `fetch("/api/upload", { method: "POST", body: fd })` and receive `{ url: string }` back.

### Data Flow for Mutations

Server Actions handle all writes. Each feature area has an `actions.ts` co-located with its pages:

| File | Purpose |
|---|---|
| `src/app/auth/actions.ts` | login, register, logout |
| `src/app/dashboard/listings/actions.ts` | createListing, updateListing, deleteListing, toggleListingPublished |
| `src/app/admin/owners/[id]/actions.ts` | updateSubscription |

Mutations use `revalidatePath()` then `redirect()`. The `ListingForm` component (`src/components/listing-form.tsx`) serializes complex fields (photos, amenities, units) as JSON strings inside FormData before calling the action.

### Page Structure (App Router)

All pages are Server Components unless marked `"use client"`. Pages that fetch data use `export const dynamic = "force-dynamic"`.

| Route | Purpose | Auth |
|---|---|---|
| `/` | Homepage — hero, featured listings, stats | Public |
| `/listings` | Searchable/filterable listing grid | Public |
| `/listings/[id]` | Detail page — carousel, unit tabs, map, contact sidebar | Public |
| `/shortstay` | Short stay listings | Public |
| `/map` | Full-page map view | Public |
| `/inquiry` | Agent inquiry/contact form | Public |
| `/auth/login` | Login page (also has register form) | Public |
| `/dashboard` | Owner overview — stats, recent listings | Owner |
| `/dashboard/listings` | Owner's listings table | Owner |
| `/dashboard/listings/new` | Create listing form | Owner |
| `/dashboard/listings/[id]/edit` | Edit listing form | Owner |
| `/admin` | Admin — owners table with subscription mgmt | Admin |
| `/admin/owners/[id]` | Edit owner subscription status/expiry | Admin |
| `/admin/inquiries` | View inquiry submissions | Admin |

### Key Patterns

- **Complex data in forms**: The `ListingForm` serializes arrays/objects (photos, amenities, units, coordinates) as JSON strings in FormData via `formData.set()`. Server actions parse them back with `JSON.parse()`.
- **Leaflet maps**: Dynamically imported — Leaflet requires browser APIs. Map components (`map-picker.tsx`, `leaflet-picker.tsx`, listing detail map) are all `"use client"`.
- **`next/cache` revalidation**: After mutations, `revalidatePath()` is called before `redirect()` to ensure fresh data.
- **`.env.local`** requires: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_KEY` (for photo uploads).
- **shadcn/ui** components are in `src/components/ui/` — use `npx shadcn add <component>` to add more.
