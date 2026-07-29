"use client";

import { useState, useRef } from "react";
import { Wifi, Wind, Home, Car, Dumbbell, Waves, Sofa, CookingPot, Tv, Shirt, X, ChevronLeft, ChevronRight } from "lucide-react";

interface UnitData {
  type: string;
  title?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  facilities: string[];
  photos: string[];
}

const UNIT_LABELS: Record<string, { name: string }> = {
  studio: { name: "Studio" },
  "1bed": { name: "One Bedroom" },
  "2bed": { name: "Two Bedrooms" },
  "3bed": { name: "Three Bedrooms" },
  penthouse: { name: "Penthouse" },
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

function PhotoSlider({ photos, onPhotoClick }: { photos: string[]; onPhotoClick: (url: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
      >
        {photos.map((url, i) => (
          <button
            key={i}
            onClick={() => onPhotoClick(url)}
            className="shrink-0 w-full snap-center"
          >
            <img
              src={url}
              alt={`Photo ${i + 1}`}
              className="w-full h-56 sm:h-72 object-contain bg-black/5 hover:scale-[1.02] transition-transform"
            />
          </button>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-white/70 shadow" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function UnitTabs({ units }: { units: UnitData[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const unit = units[active];
  const label = UNIT_LABELS[unit.type] || { name: unit.type };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4">Available Units</h2>

      {/* Tab buttons */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {units.map((u, i) => {
          const lab = UNIT_LABELS[u.type] || { name: u.type };
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
              {lab.name}
            </button>
          );
        })}
      </div>

      {/* Active unit content */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Photo slider */}
        {unit.photos && unit.photos.length > 0 ? (
          <PhotoSlider photos={unit.photos} onPhotoClick={setLightbox} />
        ) : (
          <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
            No photos for this unit
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {unit.title || label.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-slate-500">
                {(unit.bedrooms > 0) && <span>{unit.bedrooms} Bedroom{unit.bedrooms > 1 ? "s" : ""}</span>}
                {(unit.bathrooms > 0) && <span>{unit.bathrooms} Bathroom{unit.bathrooms > 1 ? "s" : ""}</span>}
                {(unit.area > 0) && <span>{unit.area} sqm</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-extrabold text-blue-600">
                ${unit.price.toLocaleString()}<span className="text-base font-normal text-slate-500">/month</span>
              </p>
            </div>
          </div>

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
