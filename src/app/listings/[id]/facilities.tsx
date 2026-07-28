"use client";

import { Check, Wind, Car, Dumbbell, Waves, Sofa, Home, Heart } from "lucide-react";

interface Facility {
  name: string;
  photos?: string[];
  photo?: string;
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
                <div className="flex gap-1.5 overflow-x-auto p-1">
                  {photos.map((url: string, i: number) => (
                    <img key={i} src={url} alt={name} className="w-32 h-28 object-cover rounded-lg shrink-0" />
                  ))}
                </div>
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
