import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: owners } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "owner")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Owners</h1>
        <p className="text-muted-foreground">View and manage owner subscriptions</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {owners?.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell className="font-medium">{owner.full_name || "—"}</TableCell>
                <TableCell>
                  <Badge variant={owner.subscription_status === "active" ? "default" : "destructive"}>
                    {owner.subscription_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {owner.subscription_expires_at
                    ? new Date(owner.subscription_expires_at).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/owners/${owner.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(!owners || owners.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No owners registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
