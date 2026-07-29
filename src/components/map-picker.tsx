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

function parseCoordinates(input: string): { lat: number; lng: number } | null {
  const cleaned = input.trim();

  // Try raw coordinates first: "11.577851, 104.881932" or "11.577851 104.881932"
  const rawParts = cleaned.split(/[,\s]+/).filter(Boolean);
  if (rawParts.length === 2) {
    const lat = parseFloat(rawParts[0]);
    const lng = parseFloat(rawParts[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  // Then try Google Maps URLs
  const atMatch = cleaned.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const dMatch = cleaned.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
  const qMatch = cleaned.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  const llMatch = cleaned.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  return null;
}

function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  return parseCoordinates(url);
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
        placeholder="Paste coordinates (e.g. 11.577851, 104.881932) or a Google Maps link..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="text-sm h-10 rounded-xl"
      />
      <LeafletPicker lat={lat} lng={lng} onChange={onChange} />
      <p className="text-[11px] text-muted-foreground">
        Paste coordinates like "11.577851, 104.881932", a Google Maps link, or click on the map.
      </p>
    </div>
  );
}
