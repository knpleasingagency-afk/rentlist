"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPicker } from "@/components/map-picker";
import { AMENITIES_OPTIONS, LISTING_TYPE_LABELS, UNIT_OPTIONS } from "@/lib/types";
import type { Listing, UnitType } from "@/lib/types";
import { Crown, Plus, X, Upload } from "lucide-react";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : children}
    </Button>
  );
}

interface ListingFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  listing?: Listing;
}

export function ListingForm({ action, listing }: ListingFormProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>(listing?.photos ?? []);
  const [amenities, setAmenities] = useState<{ name: string; photos: string[] }[]>(
    Array.isArray(listing?.amenities) && listing.amenities.length > 0 && typeof listing.amenities[0] === "object"
      ? (listing.amenities as any[]).map(a => ({ name: a.name || a, photos: a.photos || (a.photo ? [a.photo] : []) }))
      : [],
  );
  const [listingType, setListingType] = useState(listing?.listing_type ?? "longterm");
  const [units, setUnits] = useState<UnitType[]>(listing?.units ?? []);
  const [isFeatured, setIsFeatured] = useState(listing?.is_featured ?? false);
  const [lat, setLat] = useState(listing?.latitude ?? 11.5564);
  const [lng, setLng] = useState(listing?.longitude ?? 104.9282);
  const [error, setError] = useState<string | null>(null);

  function toggleAmenity(name: string) {
    setAmenities((prev) =>
      prev.find((a) => a.name === name)
        ? prev.filter((a) => a.name !== name)
        : [...prev, { name, photos: [] }],
    );
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("photos", JSON.stringify(photos));
    formData.set("amenities", JSON.stringify(amenities));
    formData.set("listing_type", listingType);
    formData.set("is_featured", isFeatured ? "true" : "false");
    formData.set("units", JSON.stringify(units));
    formData.set("latitude", lat.toString());
    formData.set("longitude", lng.toString());
    const result = await action(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Apartment Name *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={listing?.title}
              placeholder="e.g. Diamond Luxury Condo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Listing Type *</Label>
            <div className="flex gap-3">
              {(["longterm", "shortstay"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                    listingType === type
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="listing_type"
                    value={type}
                    checked={listingType === type}
                    onChange={(e) => setListingType(e.target.value as "longterm" | "shortstay")}
                    className="sr-only"
                  />
                  {LISTING_TYPE_LABELS[type]}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded-lg accent-purple-600"
            />
            <Label htmlFor="is_featured" className="cursor-pointer flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-900">Mark as Inclusive (Premium)</span>
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={listing?.description}
              placeholder="Describe the apartment..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              defaultValue={listing?.address}
              placeholder="123 Main St, New York, NY"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Pin on Map (click to set)</Label>
            <MapPicker lat={lat} lng={lng} onChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
          </div>
        </CardContent>
      </Card>

      {/* Building Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Building Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {photos[0] ? (
              <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border">
                <img src={photos[0]} alt="Building" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos([])}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 h-64 sm:h-80 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                <Upload className="h-10 w-10 text-slate-300" />
                <span className="text-base text-muted-foreground font-semibold">Upload Building Photo</span>
                <span className="text-sm text-muted-foreground">Single photo of the building exterior</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (data.url) setPhotos([data.url]);
                  }}
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone *</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                defaultValue={listing?.contact_phone}
                placeholder="+855 12 345 678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email *</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={listing?.contact_email}
                placeholder="owner@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_telegram">Telegram</Label>
              <Input
                id="contact_telegram"
                name="contact_telegram"
                defaultValue={listing?.contact_phone}
                placeholder="@username or +855 12 345 678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_whatsapp">WhatsApp</Label>
              <Input
                id="contact_whatsapp"
                name="contact_whatsapp"
                defaultValue={listing?.contact_phone}
                placeholder="+855 12 345 678"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contact_website">Website</Label>
              <Input
                id="contact_website"
                name="contact_website"
                type="url"
                defaultValue={listing?.contact_website}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Units */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unit Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {UNIT_OPTIONS.map((opt) => {
            const unit = units.find((u) => u.type === opt.value);
            const enabled = !!unit;
            return (
              <div key={opt.value} className={`rounded-2xl border-2 transition-all overflow-hidden ${
                enabled ? "border-blue-400 bg-white shadow-md" : "border-slate-100 bg-white"
              }`}>
                {/* Header — always visible */}
                <div className="flex items-center justify-between p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUnits([...units, { type: opt.value, price: 0, bedrooms: 0, bathrooms: 0, area: 0, facilities: [], photos: [] }]);
                        } else {
                          setUnits(units.filter((u) => u.type !== opt.value));
                        }
                      }}
                      className="w-5 h-5 rounded accent-blue-600"
                    />
                    <span className="font-bold text-base">{opt.icon} {opt.label}</span>
                  </label>
                  {enabled && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      ${unit.price.toLocaleString() || 0}/mo
                    </span>
                  )}
                </div>

                {/* Expanded content */}
                {enabled && (
                  <div className="px-4 pb-4 space-y-4 border-t border-blue-50 pt-4">
                    {/* Fields row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-[11px]">Price ($/mo)</Label>
                        <input
                          type="number"
                          value={unit.price || ""}
                          onChange={(e) => setUnits(units.map((u) => u.type === opt.value ? { ...u, price: parseFloat(e.target.value) || 0 } : u))}
                          className="w-full h-10 rounded-xl border px-3 text-sm mt-1"
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px]">Bedrooms</Label>
                        <input
                          type="number"
                          value={unit.bedrooms || ""}
                          onChange={(e) => setUnits(units.map((u) => u.type === opt.value ? { ...u, bedrooms: parseInt(e.target.value) || 0 } : u))}
                          className="w-full h-10 rounded-xl border px-3 text-sm mt-1"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px]">Bathrooms</Label>
                        <input
                          type="number"
                          value={unit.bathrooms || ""}
                          onChange={(e) => setUnits(units.map((u) => u.type === opt.value ? { ...u, bathrooms: parseInt(e.target.value) || 0 } : u))}
                          className="w-full h-10 rounded-xl border px-3 text-sm mt-1"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px]">Area (sqm)</Label>
                        <input
                          type="number"
                          value={unit.area || ""}
                          onChange={(e) => setUnits(units.map((u) => u.type === opt.value ? { ...u, area: parseInt(e.target.value) || 0 } : u))}
                          className="w-full h-10 rounded-xl border px-3 text-sm mt-1"
                          placeholder="35"
                        />
                      </div>
                    </div>

                    {/* Unit facilities */}
                    <div>
                      <Label className="text-[11px] mb-1.5 block">Unit Facilities</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {["WiFi", "AC", "Balcony", "Furnished", "Kitchen", "TV", "Washer"].map((f) => {
                          const has = unit.facilities.includes(f);
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setUnits(units.map((u) => u.type === opt.value ? {
                                ...u,
                                facilities: has ? u.facilities.filter((x) => x !== f) : [...u.facilities, f]
                              } : u))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                has ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {has ? "✓ " : "+ "}{f}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Unit photos */}
                    <div>
                      <Label className="text-[11px] mb-1.5 block">Photos ({unit.photos?.length || 0})</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {unit.photos?.map((url, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setUnits(units.map((u) => u.type === opt.value ? {
                                ...u,
                                photos: u.photos.filter((_, pi) => pi !== i)
                              } : u))}
                              className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold cursor-pointer hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-xl">
                        <Plus className="h-3.5 w-3.5" /> Add Photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (!files?.length) return;
                            for (const file of Array.from(files)) {
                              const fd = new FormData();
                              fd.append("file", file);
                              const res = await fetch("/api/upload", { method: "POST", body: fd });
                              const data = await res.json();
                              if (data.url) {
                                setUnits((prev) => prev.map((u) => u.type === opt.value ? {
                                  ...u,
                                  photos: [...(u.photos || []), data.url],
                                } : u));
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Building Facilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Building Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AMENITIES_OPTIONS.map((amenity) => {
              const item = amenities.find((a) => a.name === amenity);
              const enabled = !!item;
              return (
                <div key={amenity} className={`p-3 rounded-xl border-2 transition-all ${enabled ? "border-blue-300 bg-blue-50/30" : "border-slate-100"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                      <Checkbox
                        checked={enabled}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      {amenity}
                    </label>
                    {enabled && (
                      <label className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                        + Photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (!files?.length) return;
                            for (const file of Array.from(files)) {
                              const fd = new FormData();
                              fd.append("file", file);
                              const res = await fetch("/api/upload", { method: "POST", body: fd });
                              const data = await res.json();
                              if (data.url) {
                                setAmenities(amenities.map((a) => a.name === amenity ? { ...a, photos: [...a.photos, data.url] } : a));
                              }
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {item?.photos && item.photos.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto">
                      {item.photos.map((url, i) => (
                        <img key={i} src={url} alt={amenity} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <SubmitButton>{listing ? "Save Changes" : "Create Listing"}</SubmitButton>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
