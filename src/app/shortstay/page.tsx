import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bed, Bath, DollarSign, Maximize, X, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShortStayPage({
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
    .eq("listing_type", "shortstay")
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

  const prices = listings?.map((l) => l.price).filter(Boolean) ?? [];
  const minPriceAll = prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="text-white space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Short Stay</h1>
              <p className="text-amber-200/80 text-lg">
                {listings?.length ?? 0} {listings?.length === 1 ? "place" : "places"} — hotels & short-term rentals in Phnom Penh
              </p>
            </div>
            {listings && listings.length > 0 && (
              <div className="flex gap-3">
                <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{listings.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-amber-100 font-semibold">Places</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <p className="text-2xl font-extrabold text-white">${minPriceAll.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-widest text-amber-100 font-semibold">From/Night</p>
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
              placeholder="Search hotels & short stays..."
              defaultValue={search}
              className="pl-12 h-14 rounded-xl bg-muted/30 text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3 w-3" /> Price / Night
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
            <Button type="submit" size="lg" className="rounded-xl px-8 bg-amber-500 hover:bg-amber-400">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
            {hasFilters && (
              <Link href="/shortstay">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50/30 border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-12 w-12 text-amber-400" />
            </div>
            <p className="text-xl font-semibold">No short stays found</p>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm mx-auto">
              {hasFilters ? "No listings match your filters. Try broadening your search." : "No short stay listings yet."}
            </p>
            {hasFilters && (
              <Link href="/shortstay">
                <Button variant="outline" size="lg" className="rounded-xl">Clear All Filters</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
