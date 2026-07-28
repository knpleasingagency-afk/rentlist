"use client";

import { useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LeafletPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export function LeafletPicker({ lat, lng, onChange }: LeafletPickerProps) {
  const handleClick = useCallback(
    (newLat: number, newLng: number) => {
      onChange(newLat, newLng);
    },
    [onChange],
  );

  return (
    <div className="h-64 rounded-lg overflow-hidden border">
      <MapContainer
        center={[lat || 11.5564, lng || 104.9282]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat || 11.5564, lng || 104.9282]} icon={icon} />
        <MapClickHandler onClick={handleClick} />
        <MapCenterUpdater lat={lat || 11.5564} lng={lng || 104.9282} />
      </MapContainer>
    </div>
  );
}
