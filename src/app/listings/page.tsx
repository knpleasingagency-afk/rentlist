import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Bed, Bath, DollarSign, Maximize, X, Home } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = (params.search as string) || "";
  const minPrice = (params.minPrice as string) || "";
  const maxPrice = (params.maxPrice as string) || "";
  const beds = (params.beds as string) || "";
  const baths = (params.baths as string) || "";
  const minArea = (params.minArea as string) || "";
  const maxArea = (params.maxArea as string) || "";

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%`);
  }
  if (minPrice) query = query.gte("price", parseFloat(minPrice));
  if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
  if (beds) query = query.gte("bedrooms", parseInt(beds));
  if (baths) query = query.gte("bathrooms", parseInt(baths));
  if (minArea) query = query.gte("area_sqft", parseInt(minArea));
  if (maxArea) query = query.lte("area_sqft", parseInt(maxArea));

  const { data: listings } = await query;
  const hasFilters = search || minPrice || maxPrice || beds || baths || minArea || maxArea;

  // Quick stats from listings
  const prices = listings?.map((l) => l.price).filter(Boolean) ?? [];
  const minPriceAll = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPriceAll = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xLS45LTItMi0yaC0xMGMtMS4xIDAtMiAuOS0yIDJ2MTBjMCAxLjEuOSAyIDIgMmgxMGMxLjEgMCAyLS45IDItMlYxOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-18">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="text-white space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Apartments</h1>
              <p className="text-blue-200/80 text-lg">
                {listings?.length ?? 0} {listings?.length === 1 ? "apartment" : "apartments"} available in Phnom Penh
              </p>
            </div>
            {listings && listings.length > 0 && (
              <div className="flex gap-3">
                <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{listings.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-blue-200/60 font-semibold">Listings</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <p className="text-2xl font-extrabold text-white">${minPriceAll.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-widest text-blue-100 font-semibold">From</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Search Form */}
        <form className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border-0 -mt-8 relative z-10 p-6 sm:p-8 space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search by apartment name or address..."
              defaultValue={search}
              className="pl-12 h-14 rounded-xl bg-muted/30 text-base"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3 w-3" /> Price Range
              </label>
              <div className="flex gap-2">
                <Input name="minPrice" type="number" placeholder="Min $" defaultValue={minPrice} className="rounded-xl h-10" />
                <Input name="maxPrice" type="number" placeholder="Max $" defaultValue={maxPrice} className="rounded-xl h-10" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Bed className="h-3 w-3" /> Bedrooms
              </label>
              <select name="beds" defaultValue={beds} className="w-full h-10 rounded-xl border bg-background px-3 text-sm">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Bath className="h-3 w-3" /> Bathrooms
              </label>
              <select name="baths" defaultValue={baths} className="w-full h-10 rounded-xl border bg-background px-3 text-sm">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Maximize className="h-3 w-3" /> Area (sqm)
              </label>
              <div className="flex gap-2">
                <Input name="minArea" type="number" placeholder="Min" defaultValue={minArea} className="rounded-xl h-10" />
                <Input name="maxArea" type="number" placeholder="Max" defaultValue={maxArea} className="rounded-xl h-10" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="lg" className="rounded-xl px-8 bg-blue-600 hover:bg-blue-500">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
            {hasFilters && (
              <Link href="/listings">
                <Button type="button" variant="ghost" size="lg" className="rounded-xl">
                  <X className="h-4 w-4 mr-2" /> Clear All
                </Button>
              </Link>
            )}
          </div>
        </form>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {search && <Badge variant="secondary" className="rounded-lg">Search: {search}</Badge>}
            {minPrice && <Badge variant="secondary" className="rounded-lg">Min ${minPrice}</Badge>}
            {maxPrice && <Badge variant="secondary" className="rounded-lg">Max ${maxPrice}</Badge>}
            {beds && <Badge variant="secondary" className="rounded-lg">{beds}+ BR</Badge>}
            {baths && <Badge variant="secondary" className="rounded-lg">{baths}+ BA</Badge>}
            {minArea && <Badge variant="secondary" className="rounded-lg">Min {minArea} sqm</Badge>}
            {maxArea && <Badge variant="secondary" className="rounded-lg">Max {maxArea} sqm</Badge>}
          </div>
        )}

        {/* Results */}
        {listings && listings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
              <Home className="h-12 w-12 text-blue-400" />
            </div>
            <p className="text-xl font-semibold">No apartments found</p>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm mx-auto">
              {hasFilters
                ? "No listings match your current filters. Try broadening your search."
                : "No listings available yet. Check back soon for new apartments."}
            </p>
            {hasFilters && (
              <Link href="/listings">
                <Button variant="outline" size="lg" className="rounded-xl">Clear All Filters</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
