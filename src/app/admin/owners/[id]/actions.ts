"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSubscription(id: string, formData: FormData) {
  const supabase = await createClient();

  const status = formData.get("subscription_status") as string;
  const expiresAt = formData.get("subscription_expires_at") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_status: status,
      subscription_expires_at: expiresAt || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // If subscription is inactive, unpublish all their listings
  if (status === "inactive") {
    await supabase
      .from("listings")
      .update({ is_published: false })
      .eq("owner_id", id);
  }

  revalidatePath("/admin");
  redirect("/admin");
}
