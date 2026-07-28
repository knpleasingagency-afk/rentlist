import { createClient } from "@/lib/supabase/server";

/**
 * Checks if the user's subscription has expired. If it has, auto-sets
 * status to inactive and unpublishes all their listings.
 * Called on dashboard pages to enforce subscription expiry.
 */
export async function checkAndExpireSubscription(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_expires_at")
    .eq("id", userId)
    .single();

  if (!profile) return;

  if (
    profile.subscription_status === "active" &&
    profile.subscription_expires_at &&
    new Date(profile.subscription_expires_at) < new Date()
  ) {
    // Subscription expired — deactivate and unpublish
    await supabase
      .from("profiles")
      .update({ subscription_status: "inactive" })
      .eq("id", userId);

    await supabase
      .from("listings")
      .update({ is_published: false })
      .eq("owner_id", userId);
  }
}
