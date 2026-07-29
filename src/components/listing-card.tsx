"use client";

import Link from "next/link";
import { MapPin, Home, Crown } from "lucide-react";
import { type Listing } from "@/lib/types";

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top badges — compact */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center gap-1.5">
            {listing.is_featured && (
              <span className="bg-purple-500/90 backdrop-blur text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                <Crown className="h-3 w-3" fill="white" />
              </span>
            )}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md shadow backdrop-blur ${
              isShort ? "bg-amber-400/90 text-amber-900" : "bg-white/80 text-slate-700"
            }`}>
              {isShort ? "Short" : "Long"}
            </span>
          </div>

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-extrabold text-base sm:text-lg drop-shadow">
              {priceText}<span className="text-white/60 text-[11px] font-medium">/month</span>
            </p>
          </div>
        </div>

        {/* Content — clean, no unit pills */}
        <div className="px-3 sm:px-4 py-3 flex flex-col flex-1">
          <h3 className="font-extrabold text-slate-900 truncate text-sm sm:text-base leading-tight">
            {listing.title}
          </h3>
          <p className="flex items-center gap-1 text-xs sm:text-sm text-slate-400 mt-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.address}</span>
          </p>
        </div>
      </article>
    </Link>
  );
}
