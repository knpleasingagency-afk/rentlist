"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
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
  }>;
}

export function LeafletMapView({ listings }: Props) {
  const validListings = listings.filter((l) => l.latitude && l.longitude);
  const centerLat = validListings.length > 0
    ? validListings.reduce((s, l) => s + l.latitude, 0) / validListings.length
    : 11.5564;
  const centerLng = validListings.length > 0
    ? validListings.reduce((s, l) => s + l.longitude, 0) / validListings.length
    : 104.9282;

  return (
    <div className="h-[70vh] w-full">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validListings.map((l) => {
          const isShort = l.listing_type === "shortstay";
          return (
            <Marker
              key={l.id}
              position={[l.latitude, l.longitude]}
              icon={isShort ? shortstayIcon : longtermIcon}
            >
              {/* Always-visible name label */}
              <Tooltip permanent direction="top" offset={[0, -38]} opacity={1}>
                <div className="bg-white text-slate-900 font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-lg border-0 whitespace-nowrap">
                  {l.title}
                </div>
              </Tooltip>
              <Popup>
                <div className="min-w-[220px]">
                  {l.photos?.[0] && (
                    <img
                      src={l.photos[0]}
                      alt={l.title}
                      className="w-full h-32 object-cover rounded-xl mb-3"
                    />
                  )}
                  <h3 className="font-extrabold text-sm">{l.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{l.address}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-extrabold text-base">${l.price}<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                    <span className="text-xs text-slate-500 font-medium">
                      {l.bedrooms}BR · {l.bathrooms}BA
                    </span>
                  </div>
                  <Link
                    href={`/listings/${l.id}`}
                    className="inline-block mt-3 text-xs font-bold text-blue-600 hover:underline"
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
