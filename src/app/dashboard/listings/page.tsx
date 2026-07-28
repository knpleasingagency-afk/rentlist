import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteButton } from "./delete-button";
import { ToggleButton } from "./toggle-button";

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your apartment listings</p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </Link>
      </div>

      {!listings?.length ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">You haven&apos;t created any listings yet.</p>
          <Link href="/dashboard/listings/new">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Beds</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell>${listing.price}/mo</TableCell>
                  <TableCell>{listing.bedrooms}BR / {listing.bathrooms}BA</TableCell>
                  <TableCell>
                    <Badge variant={listing.is_published ? "default" : "secondary"}>
                      {listing.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ToggleButton id={listing.id} isPublished={listing.is_published} />
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteButton id={listing.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
