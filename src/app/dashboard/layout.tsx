import Link from "next/link";
import { LayoutDashboard, Home } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[90rem] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard/listings"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-all"
            >
              <Home className="h-4 w-4" />
              My Listings
            </Link>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
