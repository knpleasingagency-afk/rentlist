import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSubscription } from "./actions";

export default async function OwnerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: owner } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!owner) notFound();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, is_published")
    .eq("owner_id", id);

  const boundAction = async (formData: FormData) => {
    "use server";
    return updateSubscription(id, formData);
  };

  const expiryValue = owner.subscription_expires_at
    ? new Date(owner.subscription_expires_at).toISOString().split("T")[0]
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{owner.full_name || "Owner"}</h1>
        <p className="text-muted-foreground">Manage subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription form */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Update subscription status and expiry</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={boundAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subscription_status">Status</Label>
                <select
                  id="subscription_status"
                  name="subscription_status"
                  defaultValue={owner.subscription_status}
                  className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription_expires_at">Expiry Date</Label>
                <Input
                  id="subscription_expires_at"
                  name="subscription_expires_at"
                  type="date"
                  defaultValue={expiryValue}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        {/* Owner's listings */}
        <Card>
          <CardHeader>
            <CardTitle>Listings ({listings?.length ?? 0})</CardTitle>
            <CardDescription>Properties owned by this user</CardDescription>
          </CardHeader>
          <CardContent>
            {listings && listings.length > 0 ? (
              <ul className="space-y-2">
                {listings.map((l) => (
                  <li key={l.id} className="flex items-center justify-between text-sm">
                    <span>{l.title}</span>
                    <span className={l.is_published ? "text-green-600" : "text-muted-foreground"}>
                      {l.is_published ? "Published" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No listings yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
