"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, Menu, X, Search, Clock, MapPin, MessageSquare, User, Sparkles } from "lucide-react";
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

  const navLinks = [
    { href: "/listings", icon: Search, label: "Apartments" },
    { href: "/shortstay", icon: Clock, label: "Short Stay" },
    { href: "/map", icon: MapPin, label: "Map" },
    { href: "/inquiry", icon: MessageSquare, label: "Agent" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 relative ${
        scrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-white/70 shadow-2xl shadow-blue-900/5"
          : "bg-gradient-to-r from-blue-950/95 via-indigo-950/95 to-slate-950/95 backdrop-blur-xl border-b border-white/5"
      }`}
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            scrolled
              ? "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-blue-500/25"
              : "bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-400/40"
          }`}>
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className={scrolled ? "text-slate-900" : "text-white"}>RentList</span>
        </Link>

        {/* Desktop nav — absolutely centered */}
        <nav className={`hidden md:flex items-center gap-1 rounded-2xl p-1 transition-all duration-500 absolute left-1/2 -translate-x-1/2 ${
          scrolled ? "bg-slate-100/70" : "bg-white/10 backdrop-blur"
        }`}>
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                scrolled
                  ? "text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-white/15"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <Link href="/dashboard">
              <Button
                size="sm"
                className={`rounded-xl font-semibold transition-all duration-500 ${
                  scrolled
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/20 text-white"
                    : "bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur"
                }`}
              >
                <User className="h-4 w-4 mr-1.5" />
                Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
            scrolled
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className={`md:hidden border-t px-4 pb-4 space-y-1 animate-fade-up ${
          scrolled ? "bg-white border-slate-100" : "bg-gradient-to-b from-blue-950 to-indigo-950 border-white/5"
        }`}>
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                scrolled
                  ? "text-slate-600 hover:bg-slate-50"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`h-4 w-4 ${scrolled ? "text-blue-500" : "text-blue-400"}`} />
              {label}
            </Link>
          ))}
          {user && (
            <div className="pt-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold shadow-lg shadow-blue-500/25">
                  <User className="h-4 w-4 mr-2" /> Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
