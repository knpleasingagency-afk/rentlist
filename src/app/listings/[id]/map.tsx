"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(
  () =>
    import("./leaflet-map").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  },
);

interface ListingMapProps {
  lat: number;
  lng: number;
  address: string;
}

export function ListingMap({ lat, lng, address }: ListingMapProps) {
  return <LeafletMap lat={lat} lng={lng} address={address} />;
}
