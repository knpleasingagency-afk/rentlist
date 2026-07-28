import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Client inquiries from the Find an Agent form</p>
      </div>

      {!inquiries?.length ? (
        <Card className="rounded-2xl border-0">
          <CardContent className="p-12 text-center text-muted-foreground">
            No inquiries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <Card key={inq.id} className="rounded-xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{inq.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{inq.email} · {inq.phone}</p>
                  </div>
                  <Badge variant={inq.is_read ? "secondary" : "default"}>
                    {inq.is_read ? "Read" : "New"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  {inq.budget_min && inq.budget_max && (
                    <span>💰 ${inq.budget_min} – ${inq.budget_max}</span>
                  )}
                  {inq.bedrooms && <span>🛏 {inq.bedrooms}+ BR</span>}
                  {inq.bathrooms && <span>🚿 {inq.bathrooms}+ BA</span>}
                </div>
                {inq.message && (
                  <p className="text-sm bg-muted/50 rounded-xl p-3">{inq.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(inq.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
