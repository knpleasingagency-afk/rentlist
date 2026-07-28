"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const photos = JSON.parse(formData.get("photos") as string || "[]");
  const amenities = JSON.parse(formData.get("amenities") as string || "[]");
  const units = JSON.parse(formData.get("units") as string || "[]");

  const { error } = await supabase.from("listings").insert({
    owner_id: user.id,
    title: formData.get("title") as string,
    listing_type: (formData.get("listing_type") as string) || "longterm",
    is_featured: formData.get("is_featured") === "true",
    units,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string) || 0,
    bedrooms: parseInt(formData.get("bedrooms") as string) || 0,
    bathrooms: parseInt(formData.get("bathrooms") as string) || 0,
    area_sqft: parseInt(formData.get("area_sqft") as string) || null,
    address: formData.get("address") as string,
    latitude: parseFloat(formData.get("latitude") as string) || 0,
    longitude: parseFloat(formData.get("longitude") as string) || 0,
    contact_phone: formData.get("contact_phone") as string,
    contact_email: formData.get("contact_email") as string,
    contact_telegram: formData.get("contact_telegram") as string,
    contact_whatsapp: formData.get("contact_whatsapp") as string,
    contact_website: formData.get("contact_website") as string,
    photos,
    amenities,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/listings");
  redirect("/dashboard/listings");
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const photos = JSON.parse(formData.get("photos") as string || "[]");
  const amenities = JSON.parse(formData.get("amenities") as string || "[]");
  const units = JSON.parse(formData.get("units") as string || "[]");

  const { error } = await supabase
    .from("listings")
    .update({
      title: formData.get("title") as string,
      listing_type: (formData.get("listing_type") as string) || "longterm",
      is_featured: formData.get("is_featured") === "true",
      units,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      bedrooms: parseInt(formData.get("bedrooms") as string) || 0,
      bathrooms: parseInt(formData.get("bathrooms") as string) || 0,
      area_sqft: parseInt(formData.get("area_sqft") as string) || null,
      address: formData.get("address") as string,
      latitude: parseFloat(formData.get("latitude") as string) || 0,
      longitude: parseFloat(formData.get("longitude") as string) || 0,
      contact_phone: formData.get("contact_phone") as string,
      contact_email: formData.get("contact_email") as string,
      contact_telegram: formData.get("contact_telegram") as string,
      contact_whatsapp: formData.get("contact_whatsapp") as string,
      contact_website: formData.get("contact_website") as string,
      photos,
      amenities,
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/listings");
  redirect("/dashboard/listings");
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/listings");
  return { success: true };
}

export async function toggleListingPublished(id: string, isPublished: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("listings")
    .update({ is_published: isPublished })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/listings");
  return { success: true };
}
