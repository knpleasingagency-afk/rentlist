"use client";

import { useState, useRef } from "react";
import { Check, Wind, Car, Dumbbell, Waves, Sofa, Home, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";

function getIcon(name: string) {
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
}

function getColor(name: string) {
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
}

interface SlideItem {
  facilityName: string;
  photoUrl: string | null;
}

function flattenSlides(amenities: any[]): SlideItem[] {
  const slides: SlideItem[] = [];
  for (const a of amenities) {
    const name = typeof a === "string" ? a : a.name;
    const photos: string[] = typeof a === "string" ? [] : (a.photos || (a.photo ? [a.photo] : []));
    if (photos.length > 0) {
      photos.forEach((url) => slides.push({ facilityName: name, photoUrl: url }));
    } else {
      slides.push({ facilityName: name, photoUrl: null });
    }
  }
  return slides;
}

export function BuildingFacilities({ amenities }: { amenities: any[] }) {
  if (!amenities || amenities.length === 0) return null;

  const slides = flattenSlides(amenities);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4">Building Facilities</h2>

      {/* Unified slider */}
      <div
        className="relative rounded-2xl overflow-hidden group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {slides.map((item, i) => {
            const Icon = getIcon(item.facilityName);
            const color = getColor(item.facilityName);

            return (
              <div key={i} className="shrink-0 w-full snap-center relative">
                {item.photoUrl ? (
                  <button
                    onClick={() => setLightbox(item.photoUrl)}
                    className="w-full cursor-pointer"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.facilityName}
                      className="w-full h-56 sm:h-[32rem] object-cover"
                    />
                  </button>
                ) : (
                  <div className="w-full h-56 sm:h-[32rem] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                    <Icon className={`h-16 w-16 ${color} opacity-30`} />
                  </div>
                )}

                {/* Facility label overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-10 pb-4 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-white">{item.facilityName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-opacity duration-200 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-opacity duration-200 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((s, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70 shadow" />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Facility name pills below */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {amenities.map((a: any) => {
          const name = typeof a === "string" ? a : a.name;
          const Icon = getIcon(name);
          const color = getColor(name);
          return (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold shrink-0"
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              {name}
            </span>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
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
