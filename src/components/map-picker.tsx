"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";

const LeafletPicker = dynamic(
  () => import("./leaflet-picker").then((m) => m.LeafletPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  },
);

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  return null;
}

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text");
    const coords = parseGoogleMapsUrl(text);
    if (coords) {
      e.preventDefault();
      onChange(coords.lat, coords.lng);
      setValue("✓ Location set!");
      setTimeout(() => setValue(""), 1500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      const coords = parseGoogleMapsUrl(value);
      if (coords) {
        onChange(coords.lat, coords.lng);
        setValue("✓ Location set!");
        setTimeout(() => setValue(""), 1500);
      }
    }
  }

  return (
    <div className="space-y-3">
      <Input
        ref={inputRef}
        placeholder="Paste Google Maps link and press Enter..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="text-sm h-10 rounded-xl"
      />
      <LeafletPicker lat={lat} lng={lng} onChange={onChange} />
      <p className="text-[11px] text-muted-foreground">
        Paste a Google Maps link (auto-detects) or click on the map. Scroll to zoom.
      </p>
    </div>
  );
}
