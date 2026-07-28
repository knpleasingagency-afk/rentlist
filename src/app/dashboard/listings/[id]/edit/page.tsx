import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { ListingForm } from "@/components/listing-form";
import { updateListing } from "../../actions";
import type { Listing } from "@/lib/types";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!listing) notFound();

  const boundAction = async (formData: FormData) => {
    "use server";
    return updateListing(id, formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <p className="text-muted-foreground">Update your apartment listing</p>
      </div>
      <ListingForm action={boundAction} listing={listing as Listing} />
    </div>
  );
}
