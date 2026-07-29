import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, ChevronLeft, Clock, Home, Send, Globe, Navigation } from "lucide-react";
import Link from "next/link";
import { ListingMap } from "./map";
import { PhotoCarousel } from "./photo-carousel";
import { UnitTabs } from "./unit-tabs";
import { BuildingFacilities } from "./facilities";
import { CopyLocationButton } from "./copy-location-button";
import type { Listing } from "@/lib/types";
export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!listing) notFound();

  const l = listing as Listing;

  return (
    <div>
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to listings
        </Link>
      </div>

      {/* Full-width photo */}
      <PhotoCarousel photos={l.photos} title={l.title} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main — 3 columns */}
          <div className="lg:col-span-3 space-y-8">

            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      l.listing_type === "shortstay"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {l.listing_type === "shortstay" ? (
                        <><Clock className="h-3.5 w-3.5" /> Short Stay</>
                      ) : (
                        <><Home className="h-3.5 w-3.5" /> Long-term Apartment</>
                      )}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{l.title}</h1>
                  <p className="flex items-start gap-1.5 text-slate-500 mt-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{l.address}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {l.units && l.units.length > 0 ? (
                    (() => {
                      const prices = l.units.map(u => u.price).filter(Boolean);
                      const minP = Math.min(...prices);
                      const maxP = Math.max(...prices);
                      return minP === maxP ? (
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                          ${minP.toLocaleString()}<span className="text-base font-normal text-slate-500">/month</span>
                        </p>
                      ) : (
                        <p className="text-lg sm:text-2xl font-bold text-slate-900">
                          ${minP.toLocaleString()} – ${maxP.toLocaleString()}<span className="text-sm sm:text-base font-normal text-slate-500">/month</span>
                        </p>
                      );
                    })()
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      ${l.price.toLocaleString()}<span className="text-base font-normal text-slate-500">/month</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">About this property</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {l.description || "No description provided."}
              </p>
            </div>

            {/* Unit Types as Tabs */}
            {l.units && l.units.length > 0 && (
              <UnitTabs units={l.units} />
            )}

            {/* Building Facilities */}
            <BuildingFacilities amenities={l.amenities} />

            {/* Map */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Location</h2>
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <ListingMap lat={l.latitude} lng={l.longitude} address={l.address} />
              </div>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${l.latitude},${l.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/25"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
                <CopyLocationButton lat={l.latitude} lng={l.longitude} />
              </div>
            </div>
          </div>

          {/* Sidebar — 2 columns */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Contact card */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white">
                  <h3 className="font-bold text-lg">Interested in this property?</h3>
                  <p className="text-blue-100 text-sm mt-1">Contact the owner directly — no fees</p>
                </div>
                <div className="p-4 space-y-2">
                  {l.contact_telegram && (
                    <a
                      href={`https://t.me/${l.contact_telegram.replace("@", "").replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                        <Send className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Telegram</p>
                        <p className="font-semibold text-slate-900">{l.contact_telegram}</p>
                      </div>
                    </a>
                  )}
                  {l.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${l.contact_whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Phone className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">WhatsApp</p>
                        <p className="font-semibold text-slate-900">{l.contact_whatsapp}</p>
                      </div>
                    </a>
                  )}
                  <a
                    href={`tel:${l.contact_phone}`}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Call</p>
                      <p className="font-semibold text-slate-900">{l.contact_phone}</p>
                    </div>
                  </a>
                  {l.contact_website && (
                    <a
                      href={l.contact_website.startsWith("http") ? l.contact_website : `https://${l.contact_website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Website</p>
                        <p className="font-semibold text-slate-900">{l.contact_website}</p>
                      </div>
                    </a>
                  )}
                  <a
                    href={`mailto:${l.contact_email}`}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Email</p>
                      <p className="font-semibold text-slate-900">{l.contact_email}</p>
                    </div>
                  </a>

                  <div className="pt-2 space-y-2">
                    <a
                      href={`tel:${l.contact_phone}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium text-sm hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/25"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                    <a
                      href={`mailto:${l.contact_email}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all"
                    >
                      <Mail className="h-4 w-4" />
                      Send Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div className="bg-slate-50 rounded-3xl p-6 space-y-3">
                <h4 className="font-semibold text-slate-900">Quick Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className="font-medium text-slate-900">{l.listing_type === "shortstay" ? "Short Stay" : "Long-term"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Units</span>
                    <span className="font-medium text-slate-900">{l.units?.length || 0} types</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location</span>
                    <span className="font-medium text-slate-900">Phnom Penh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Listed</span>
                    <span className="font-medium text-slate-900">{new Date(l.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
