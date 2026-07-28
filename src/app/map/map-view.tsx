"use client";

import dynamic from "next/dynamic";

const LeafletMapView = dynamic(
  () => import("./leaflet-map-view").then((m) => m.LeafletMapView),
  {
    ssr: false,
    loading: () => (
      <div className="h-[70vh] bg-muted flex items-center justify-center text-muted-foreground">
        Loading map...
      </div>
    ),
  },
);

interface MapViewProps {
  listings: Array<{
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    photos: string[];
    listing_type?: string;
  }>;
}

export function MapView({ listings }: MapViewProps) {
  return <LeafletMapView listings={listings} />;
}
