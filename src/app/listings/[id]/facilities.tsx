"use client";

import { useState, useRef } from "react";
import { Check, Wind, Car, Dumbbell, Waves, Sofa, Home, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Facility {
  name: string;
  photos?: string[];
  photo?: string;
}

function FacilityPhotoSlider({ photos, name }: { photos: string[]; name: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  };

  return (
    <>
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => setLightbox(url)}
              className="shrink-0 w-full snap-center"
            >
              <img
                src={url}
                alt={`${name} photo ${i + 1}`}
                className="w-full h-44 object-cover"
              />
            </button>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4 text-slate-700" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/80 shadow" />
              ))}
            </div>
          </>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt={name} className="max-w-[95vw] max-h-[95vh] object-contain" />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white text-sm bg-white/10 px-4 py-2 rounded-full"
          >
            <X className="h-4 w-4 inline mr-1" />Close
          </button>
        </div>
      )}
    </>
  );
}

export function BuildingFacilities({ amenities }: { amenities: any[] }) {
  const getIcon = (name: string) => {
    switch (name) {
      case "Pool": return Waves;
      case "Gym": return Dumbbell;
      case "Parking": return Car;
      case "Garden": return Home;
      case "Playground": return Heart;
      case "Steam": return Wind;
      case "Sauna": return Wind;
      case "Public Area": return Sofa;
      default: return Check;
    }
  };

  const getColor = (name: string) => {
    switch (name) {
      case "Pool": return "text-cyan-600";
      case "Gym": return "text-purple-600";
      case "Parking": return "text-blue-600";
      case "Garden": return "text-green-600";
      case "Playground": return "text-rose-600";
      case "Steam": return "text-sky-600";
      case "Sauna": return "text-orange-600";
      case "Public Area": return "text-amber-600";
      default: return "text-slate-600";
    }
  };

  if (!amenities || amenities.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4">Building Facilities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {amenities.map((a: any) => {
          const name = typeof a === "string" ? a : a.name;
          const photos: string[] = typeof a === "string" ? [] : (a.photos || (a.photo ? [a.photo] : []));
          const Icon = getIcon(name);
          const color = getColor(name);

          return (
            <div key={name} className="rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              {photos.length > 0 ? (
                <FacilityPhotoSlider photos={photos} name={name} />
              ) : (
                <div className="w-full h-24 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
              )}
              <div className="p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-sm font-semibold text-slate-700">{name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
