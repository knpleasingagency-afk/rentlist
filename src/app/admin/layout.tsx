import Link from "next/link";
import { Users, MessageSquare } from "lucide-react";

export default function AdminLayout({
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
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-all"
            >
              <Users className="h-4 w-4" />
              Owners
            </Link>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              Inquiries
            </Link>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
