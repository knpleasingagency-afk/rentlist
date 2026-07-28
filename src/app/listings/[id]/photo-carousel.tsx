"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

interface PhotoCarouselProps {
  photos: string[];
  title: string;
}

export function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
            <Expand className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-sm text-slate-400 font-medium">No photos yet</p>
        </div>
      </div>
    );
  }

  function prev() {
    setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));
  }

  const content = (
    <div className="relative aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden group">
      <img
        src={photos[current]}
        alt={`${title} - Photo ${current + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
            {current + 1} / {photos.length}
          </div>
        </>
      )}

      {/* Fullscreen button */}
      <button
        onClick={() => setFullscreen(true)}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
      >
        <Expand className="h-4 w-4 text-slate-700" />
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      {content}

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all ${
                i === current
                  ? "ring-2 ring-slate-900 ring-offset-2 scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={photo} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <img
            src={photos[current]}
            alt={`${title} - Fullscreen`}
            className="max-w-[95vw] max-h-[95vh] object-contain"
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                {current + 1} / {photos.length}
              </div>
            </>
          )}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 text-white text-sm font-medium bg-white/10 backdrop-blur px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
