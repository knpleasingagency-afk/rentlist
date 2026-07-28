import Link from "next/link";
import { Building2, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              RentList
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Phnom Penh&apos;s premium apartment listing platform. Browse, search, and connect directly with property owners — no middlemen, no fees.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Apartment", href: "/listings" },
                { label: "Map View", href: "/map" },
                { label: "Need an Agent?", href: "/inquiry" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1 group">
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-blue-400" />
                (+855) 76 34 34 34 8
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-blue-400" />
                support@knp-agency.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                Phnom Penh, Cambodia
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} RentList. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Powered by{" "}
            <a href="https://knp-agency.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              KNP Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
