"use client";

import Link from "next/link";
import { MapPin, Home, Crown } from "lucide-react";
import { type Listing } from "@/lib/types";

const UNIT_LABELS: Record<string, string> = {
  studio: "Studio", "1bed": "One Bed", "2bed": "Two Bed", "3bed": "Three Bed", penthouse: "Penthouse",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const coverPhoto = listing.photos?.[0];
  const isShort = listing.listing_type === "shortstay";
  const units = listing.units || [];

  const prices = units.map(u => u.price).filter(Boolean);
  const minP = prices.length > 0 ? Math.min(...prices) : listing.price;
  const maxP = prices.length > 0 ? Math.max(...prices) : listing.price;
  const priceText = minP === maxP ? `$${minP.toLocaleString()}` : `$${minP.toLocaleString()} – $${maxP.toLocaleString()}`;

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden shrink-0">
          {coverPhoto ? (
            <img src={coverPhoto} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isShort ? "bg-gradient-to-br from-amber-100 to-orange-100" : "bg-gradient-to-br from-blue-100 to-cyan-100"}`}>
              <Home className={`h-12 w-12 ${isShort ? "text-amber-300" : "text-blue-300"}`} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Price */}
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-extrabold text-xl sm:text-2xl drop-shadow-lg">{priceText}</p>
            <p className="text-white/70 text-xs font-medium">per month</p>
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 sm:flex-row sm:gap-2 sm:top-4 sm:right-4">
            {listing.is_featured && (
              <span className="bg-purple-500 text-white text-[10px] sm:text-xs font-extrabold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-0.5 sm:gap-1 shadow-lg">
                <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Inclusive
              </span>
            )}
            <span className={`text-[10px] sm:text-xs font-extrabold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg ${
              isShort ? "bg-amber-400 text-amber-900" : "bg-white/90 text-slate-800"
            }`}>
              {isShort ? "Short Stay" : "Long-term"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col flex-1 gap-2 sm:gap-3">
          <h3 className="font-extrabold text-slate-900 truncate text-sm sm:text-lg leading-tight">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-rose-400" />
            <span className="truncate">{listing.address}</span>
          </div>

          {/* Unit pills */}
          {units.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {units.map((u) => (
                <span key={u.type} className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-100 text-[10px] sm:text-xs font-bold text-slate-600">
                  {UNIT_LABELS[u.type] || u.type}
                  {u.price > 0 && <span className="text-slate-400 font-medium"> ${u.price}</span>}
                </span>
              ))}
            </div>
          )}

          {/* Specs from first unit */}
          <div className="mt-auto pt-3 border-t border-slate-100" />
        </div>
      </article>
    </Link>
  );
}
