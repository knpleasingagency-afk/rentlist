"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Custom colored pin icon
function createIcon(color: string) {
  return L.divIcon({
    className: "custom-pin",
    html: `<div style="
      background: ${color};
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

const longtermIcon = createIcon("#2563eb");
const shortstayIcon = createIcon("#f59e0b");

const DEFAULT_CENTER: [number, number] = [11.5564, 104.9282]; // Phnom Penh
const DEFAULT_ZOOM = 13;

/**
 * Reads initial position from URL search params (?lat=...&lng=...&z=...),
 * and writes the position back to the URL as the user pans/zooms so
 * the current view is always shareable via a link.
 */
function MapPositionSync() {
  const map = useMap();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // On mount: if URL has lat/lng/zoom, fly there once
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const zoom = searchParams.get("z");
    if (lat && lng) {
      map.flyTo(
        [parseFloat(lat), parseFloat(lng)],
        zoom ? parseInt(zoom, 10) : map.getZoom(),
        { duration: 1 },
      );
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL ← map position on move/zoom end
  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const params = new URLSearchParams(searchParams.toString());
      params.set("lat", center.lat.toFixed(5));
      params.set("lng", center.lng.toFixed(5));
      params.set("z", zoom.toString());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
    };
  }, [map, router, pathname, searchParams]);

  return null;
}

interface Props {
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
    units?: Array<{ type: string; price: number }>;
  }>;
}

export function LeafletMapView({ listings }: Props) {
  const validListings = listings.filter((l) => l.latitude && l.longitude);

  // Compute default center from listing averages (used when no URL params)
  const computedCenter = useMemo((): [number, number] => {
    if (validListings.length === 0) return DEFAULT_CENTER;
    return [
      validListings.reduce((s, l) => s + l.latitude, 0) / validListings.length,
      validListings.reduce((s, l) => s + l.longitude, 0) / validListings.length,
    ];
  }, [validListings]);

  return (
    <div className="h-[70vh] w-full">
      <MapContainer
        center={computedCenter}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Syncs URL ↔ map position for shareable links */}
        <MapPositionSync />

        {validListings.map((l) => {
          const isShort = l.listing_type === "shortstay";
          return (
            <Marker
              key={l.id}
              position={[l.latitude, l.longitude]}
              icon={isShort ? shortstayIcon : longtermIcon}
            >
              {/* Always-visible name label — clicks pass through to marker */}
              <Tooltip permanent direction="top" offset={[0, -38]} opacity={1} className="pointer-events-none">
                <div className="bg-white text-slate-900 font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-lg border-0 whitespace-nowrap">
                  {l.title}
                </div>
              </Tooltip>
              <Popup>
                <div className="w-44">
                  {l.photos?.[0] && (
                    <img
                      src={l.photos[0]}
                      alt={l.title}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="font-extrabold text-xs leading-tight truncate">{l.title}</h3>
                  <p className="font-extrabold text-sm text-blue-600 mt-1">
                    ${(() => {
                      const prices = l.units?.map(u => u.price).filter(Boolean) || [];
                      return prices.length > 0
                        ? `${Math.min(...prices).toLocaleString()}-${Math.max(...prices).toLocaleString()}`
                        : (l.price || 0).toLocaleString();
                    })()}/mo
                  </p>
                  {l.units && l.units.length > 0 && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      {l.units.map(u => u.type).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}
                    </p>
                  )}
                  <Link
                    href={`/listings/${l.id}`}
                    className="inline-block mt-2 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
