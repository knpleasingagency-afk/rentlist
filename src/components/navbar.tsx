"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, Menu, X, Search, Clock, MapPin, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-lg shadow-slate-200/20"
          : "bg-white/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          RentList
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 bg-slate-100/60 rounded-2xl p-1">
          <Link
            href="/listings"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
          >
            <Search className="h-4 w-4" />
Apartment
          </Link>
          <Link
            href="/shortstay"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
          >
            <Clock className="h-4 w-4" />
            Short Stay
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
          >
            <MapPin className="h-4 w-4" />
            Map
          </Link>
          <Link
            href="/inquiry"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            Need an Agent?
          </Link>
        </nav>

        {/* Right side — only show Dashboard when logged in */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard">
              <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/20 font-semibold">
                <User className="h-4 w-4 mr-1.5" />
                Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-5 py-4 space-y-1 animate-fade-up">
          <Link href="/listings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors" onClick={() => setMobileOpen(false)}>
            <Search className="h-4 w-4 text-blue-500" /> Long Term
          </Link>
          <Link href="/shortstay" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors" onClick={() => setMobileOpen(false)}>
            <Clock className="h-4 w-4 text-amber-500" /> Short Stay
          </Link>
          <Link href="/map" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors" onClick={() => setMobileOpen(false)}>
            <MapPin className="h-4 w-4 text-emerald-500" /> Map View
          </Link>
          <Link href="/inquiry" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors" onClick={() => setMobileOpen(false)}>
            <MessageSquare className="h-4 w-4 text-amber-500" /> Need an Agent?
          </Link>
          {user && (
            <div className="pt-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold">Dashboard</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
