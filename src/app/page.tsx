import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/listing-card";
import { Search, Building2, ArrowRight, Star, Shield, Zap, Bed, Bath, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"
            alt="Modern apartment interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-slate-950/85 to-cyan-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur text-sm text-blue-300">
                <Star className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
                Phnom Penh&apos;s Premium Rental Platform
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Find Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Perfect Home
                </span>
                {" "}in the City
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-lg">
                Browse {count ?? 0}+ apartments with HD photos, interactive maps, and direct owner contact — all in one place.
              </p>
            </div>

            {/* Search bar */}
            <form action="/listings" className="flex gap-2 max-w-md animate-fade-up animate-fade-up-delay-1">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  name="search"
                  placeholder="Search by name or area..."
                  className="pl-14 h-16 bg-white/[0.08] backdrop-blur border-white/10 text-white placeholder:text-slate-400 rounded-2xl text-base focus:bg-white/[0.14] focus:border-blue-400/40 transition-all"
                />
              </div>
              <Button type="submit" size="lg" className="h-16 px-8 rounded-2xl text-base bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/25">
                Search
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>

            {/* Stats row */}
            <div className="flex gap-8 text-white animate-fade-up animate-fade-up-delay-2">
              {[
                { value: count ?? 0, label: "Listings" },
                { value: "100+", label: "Happy Clients" },
                { value: "24/7", label: "Support" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-bold">{value}</p>
                  <p className="text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED LISTINGS ===== */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Inclusive</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Premium Apartments</h2>
          </div>
          <Link href="/listings" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, i) => (
              <div key={listing.id} className={`animate-fade-up ${i > 0 ? `animate-fade-up-delay-${i + 1}` : ""}`}>
                <ListingCard listing={listing as any} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200">
            <Building2 className="h-16 w-16 mx-auto text-slate-200 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No listings yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon.</p>
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/listings">
            <Button variant="outline" size="lg" className="rounded-xl">View All</Button>
          </Link>
        </div>
      </section>

      {/* ===== WHY US SECTION ===== */}
      <section className="bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-extrabold text-blue-600 uppercase tracking-widest">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900">The Smarter Way to Rent</h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">Everything you need to find the perfect apartment — in one place.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: "Smart Search",
                desc: "Filter by price, bedrooms, bathrooms, area — find exactly what you need in seconds.",
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: MapPin,
                title: "Live Map View",
                desc: "See all apartments on an interactive map. Zoom in, explore neighborhoods.",
                color: "from-emerald-500 to-teal-500",
                bg: "bg-emerald-50",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
              },
              {
                icon: Shield,
                title: "Verified Listings",
                desc: "Every apartment is verified. Real photos, real addresses, real contact info.",
                color: "from-purple-500 to-pink-500",
                bg: "bg-purple-50",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: Zap,
                title: "Direct Contact",
                desc: "No middlemen. Call, WhatsApp, or Telegram the owner directly.",
                color: "from-amber-500 to-orange-500",
                bg: "bg-amber-50",
                iconBg: "bg-amber-100",
                iconColor: "text-amber-600",
              },
            ].map(({ icon: Icon, title, desc, bg, iconBg, iconColor, color }) => (
              <div key={title} className="group text-center">
                <div className={`aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-gradient-to-br ${color} p-6 flex items-center justify-center`}>
                  <div className={`w-16 h-16 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center mx-auto shadow-lg`}>
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                  </div>
                </div>
                <h3 className="font-extrabold text-lg mb-2 text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed px-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Find Your Perfect Home?</h2>
          <p className="text-blue-100 text-lg max-w-lg mx-auto">
            Browse our hand-picked selection of quality apartments in Phnom Penh. No fees, no middlemen.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/listings">
              <Button size="lg" className="rounded-2xl px-10 h-14 text-base bg-white text-blue-700 hover:bg-blue-50 shadow-2xl font-bold">
                Browse Apartments
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/inquiry">
              <Button size="lg" className="rounded-2xl px-8 h-14 text-base border-2 border-white text-white hover:bg-white/10 font-bold">
                Need an Agent?
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
