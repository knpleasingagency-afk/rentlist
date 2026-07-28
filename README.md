# RentList — Apartment Listing Website

A professional apartment listing platform. Owners subscribe monthly (manual invoicing) to list apartments with photos, maps, contact info, and detailed information.

## Tech Stack

- **Next.js 16** — React framework
- **Tailwind CSS + shadcn/ui** — Styling & UI components
- **Supabase** — Auth, database, photo storage
- **Leaflet** — Free maps (OpenStreetMap)
- **Vercel** — Deployment

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the entire contents of `database.sql`
4. Go to **Storage** → create a bucket named `listing-photos` (set to public)
5. Go to **Project Settings → API** — copy the **URL** and **anon key**

### 2. Configure Environment

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Create an Admin Account

1. Register at `/auth/register`
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
   ```
3. The admin panel is at `/admin`

## Managing Subscriptions

You handle invoicing manually outside the app. Then:

1. Go to `/admin` → click the pencil icon on an owner
2. Set **Status** to "Active" and set an **Expiry Date**
3. Click Save

When a subscription expires, the owner's listings are automatically hidden. Re-activating the subscription will allow them to re-publish.

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel (manage owners)
│   ├── auth/           # Login & register pages
│   ├── dashboard/      # Owner dashboard
│   ├── listings/       # Public listing pages
│   └── layout.tsx      # Root layout with nav
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── listing-card.tsx
│   ├── listing-form.tsx
│   ├── map-picker.tsx
│   ├── photo-upload.tsx
│   └── ...
├── lib/
│   ├── supabase/       # Supabase client config
│   ├── subscription.ts # Subscription logic
│   └── types.ts        # TypeScript types
└── proxy.ts            # Auth proxy (protects routes)
```
