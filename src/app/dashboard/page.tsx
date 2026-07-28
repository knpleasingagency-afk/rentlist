import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { count: listingCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user!.id);

  const { count: publishedCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user!.id)
    .eq("is_published", true);

  const { data: recentListings } = await supabase
    .from("listings")
    .select("id, title, price, is_published, created_at, photos")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
        <p className="text-muted-foreground mt-1">Manage your listings and grow your rental business.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
              <p className="text-4xl font-bold mt-1">{listingCount ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">{publishedCount ?? 0} published</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Home className="h-7 w-7 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quick Action</p>
              <p className="text-lg font-semibold mt-2">Add a new listing</p>
              <Link href="/dashboard/listings/new" className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2 hover:underline">
                Create <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Plus className="h-7 w-7 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Listings</h2>
          <Link href="/dashboard/listings" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentListings && recentListings.length > 0 ? (
          <div className="space-y-2">
            {recentListings.map((l) => (
              <Link key={l.id} href={`/dashboard/listings/${l.id}/edit`}>
                <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0">
                      {l.photos?.[0] ? (
                        <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{l.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${l.price}/mo · {l.is_published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed">
            <Home className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No listings yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first listing to get started</p>
            <Link href="/dashboard/listings/new">
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Add Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
