"use client";

import { useState } from "react";
import { MapPin, Copy, Check } from "lucide-react";

export function CopyLocationButton({ lat, lng }: { lat: number; lng: number }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 mt-3">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        View on Google Maps ↗
      </a>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg"
      >
        {copied ? (
          <><Check className="h-3 w-3 text-green-600" /> Copied</>
        ) : (
          <><Copy className="h-3 w-3" /> Copy link</>
        )}
      </button>
    </div>
  );
}
