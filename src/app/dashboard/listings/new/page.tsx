import { ListingForm } from "@/components/listing-form";
import { createListing } from "../actions";

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Listing</h1>
        <p className="text-muted-foreground">Add a new apartment listing</p>
      </div>
      <ListingForm action={createListing} />
    </div>
  );
}
