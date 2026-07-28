"use client";

import { useState } from "react";
import { Wifi, Wind, Home, Car, Dumbbell, Waves, Sofa, CookingPot, Tv, Shirt, X } from "lucide-react";

interface UnitData {
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  facilities: string[];
  photos: string[];
}

const UNIT_LABELS: Record<string, { emoji: string; name: string }> = {
  studio: { emoji: "🏢", name: "Studio" },
  "1bed": { emoji: "🛏", name: "1 Bedroom" },
  "2bed": { emoji: "🛏🛏", name: "2 Bedrooms" },
  "3bed": { emoji: "🛏🛏🛏", name: "3 Bedrooms" },
  penthouse: { emoji: "👑", name: "Penthouse" },
};

const FACILITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi, AC: Wind, Balcony: Home, Parking: Car,
  Gym: Dumbbell, Pool: Waves, Furnished: Sofa,
  Kitchen: CookingPot, TV: Tv, Washer: Shirt,
};

function FacilityIcon({ name }: { name: string }) {
  const Icon = FACILITY_ICONS[name];
  return Icon ? <Icon className="h-3.5 w-3.5" /> : null;
}

export function UnitTabs({ units }: { units: UnitData[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const unit = units[active];
  const label = UNIT_LABELS[unit.type] || { emoji: "🏠", name: unit.type };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4">Available Units</h2>

      {/* Tab buttons */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {units.map((u, i) => {
          const lab = UNIT_LABELS[u.type] || { emoji: "🏠", name: u.type };
          return (
            <button
              key={u.type}
              onClick={() => setActive(i)}
              className={`shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                i === active
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lab.emoji} {lab.name}
            </button>
          );
        })}
      </div>

      {/* Active unit content */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Photo gallery */}
        {unit.photos && unit.photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-1">
            {unit.photos.map((url, i) => (
              <button
                key={i}
                onClick={() => setLightbox(url)}
                className={`relative overflow-hidden ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
              >
                <img
                  src={url}
                  alt=""
                  className={`w-full object-cover rounded-lg hover:scale-105 transition-transform ${i === 0 ? "h-64 sm:h-full" : "h-32 sm:h-40"}`}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
            No photos for this unit
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Price + specs */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {label.emoji} {label.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-slate-500">
                {(unit.bedrooms > 0) && <span>🛏 {unit.bedrooms} Bedroom{unit.bedrooms > 1 ? "s" : ""}</span>}
                {(unit.bathrooms > 0) && <span>🚿 {unit.bathrooms} Bathroom{unit.bathrooms > 1 ? "s" : ""}</span>}
                {(unit.area > 0) && <span>📐 {unit.area} sqm</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-blue-600">${unit.price.toLocaleString()}</p>
              <p className="text-sm text-slate-500">per month</p>
            </div>
          </div>

          {/* Facilities */}
          {unit.facilities && unit.facilities.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Unit Facilities</h4>
              <div className="flex flex-wrap gap-2">
                {unit.facilities.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-bold border border-blue-100">
                    <FacilityIcon name={f} />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-[95vw] max-h-[95vh] object-contain" />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white text-sm bg-white/10 px-4 py-2 rounded-full"
          >
            <X className="h-4 w-4 inline mr-1" />Close
          </button>
        </div>
      )}
    </div>
  );
}
