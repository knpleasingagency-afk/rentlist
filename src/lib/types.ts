export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: "admin" | "owner";
  subscription_status: "active" | "inactive";
  subscription_expires_at: string | null;
  created_at: string;
}

export interface UnitType {
  type: string;
  title?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  facilities: string[];
  photos: string[];
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  address: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  contact_email: string;
  contact_telegram: string;
  contact_whatsapp: string;
  contact_website: string;
  photos: string[];
  amenities: AmenityItem[];
  listing_type: "longterm" | "shortstay";
  is_featured: boolean;
  units: UnitType[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const UNIT_OPTIONS = [
  { value: "studio", label: "Studio", icon: "🏢" },
  { value: "1bed", label: "1 Bedroom", icon: "🛏" },
  { value: "2bed", label: "2 Bedrooms", icon: "🛏🛏" },
  { value: "3bed", label: "3 Bedrooms", icon: "🛏🛏🛏" },
  { value: "penthouse", label: "Penthouse", icon: "👑" },
] as const;

export const LISTING_TYPE_LABELS: Record<string, string> = {
  longterm: "Long-term Apartment",
  shortstay: "Short Stay",
};

export interface AmenityItem {
  name: string;
  photos: string[];
}

export const AMENITIES_OPTIONS = [
  "Pool",
  "Gym",
  "Parking",
  "Garden",
  "Playground",
  "Steam",
  "Sauna",
  "Public Area",
] as const;

export const UNIT_FACILITIES = [
  "WiFi",
  "AC",
  "Balcony",
  "Furnished",
  "Kitchen",
  "TV",
  "Washer",
] as const;
