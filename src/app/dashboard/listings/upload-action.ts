"use server";

import { createClient } from "@supabase/supabase-js";

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function uploadPhoto(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { data, error } = await serviceClient.storage
    .from("listing-photos")
    .upload(cleanName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data: urlData } = serviceClient.storage
    .from("listing-photos")
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}
