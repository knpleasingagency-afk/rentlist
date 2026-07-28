import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { MapView } from "./map-view";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, price, latitude, longitude, address, bedrooms, bathrooms, photos, listing_type")
    .eq("is_published", true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground mt-1">
          {listings?.length ?? 0} apartments on the map — click a pin to see details
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border-0 shadow-xl">
        <MapView listings={listings ?? []} />
      </div>
    </div>
  );
}
