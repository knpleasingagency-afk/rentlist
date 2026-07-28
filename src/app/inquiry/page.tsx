import { Phone, Mail, Globe, Clock, Star, Shield, Heart, ArrowUpRight } from "lucide-react";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.168.331.016.103.035.338.02.531z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function InquiryPage() {
  return (
    <div className="min-h-[85vh] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-blue-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — Brand + Info */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo — bigger */}
            <div className="flex justify-center lg:justify-start">
              <div className="glass p-6 rounded-3xl inline-block">
                <img
                  src="/knp-logo-tp.png"
                  alt="KNP Agency"
                  className="h-28 sm:h-36 w-auto object-contain"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Need an agent
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                  to help?
                </span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                Let KNP Agency find your perfect apartment. We handle the search,
                you just pick the one you love.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                { icon: Star, label: "5-Star Service" },
                { icon: Shield, label: "Trusted Agency" },
                { icon: Heart, label: "100+ Happy Clients" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Icon className="h-4 w-4 text-blue-500" />
                  {label}
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center lg:justify-start">
              <Clock className="h-4 w-4" />
              <span>Mon – Sat · 9:00 AM – 7:00 PM · Phnom Penh</span>
            </div>
          </div>

          {/* RIGHT — Contact Cards */}
          <div className="space-y-4">
            {/* Telegram */}
            <a
              href="https://t.me/KNP_Agency"
              target="_blank"
              rel="noopener noreferrer"
              className="group block glass p-5 rounded-3xl hover:bg-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
                  <TelegramIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Telegram</p>
                  <p className="font-bold text-lg tracking-tight">@KNP_Agency</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Chat with us instantly</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/855763434348"
              target="_blank"
              rel="noopener noreferrer"
              className="group block glass p-5 rounded-3xl hover:bg-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  <WhatsAppIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">WhatsApp</p>
                  <p className="font-bold text-lg tracking-tight">(+855) 76 34 34 34 8</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Quick chat, fast response</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
              </div>
            </a>

            {/* Call */}
            <a
              href="tel:+855763434348"
              className="group block glass p-5 rounded-3xl hover:bg-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Call Us</p>
                  <p className="font-bold text-lg tracking-tight">(+855) 76 34 34 34 8</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Speak directly with an agent</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:support@knp-agency.com"
              className="group block glass p-5 rounded-3xl hover:bg-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Us</p>
                  <p className="font-bold text-lg tracking-tight">support@knp-agency.com</p>
                  <p className="text-xs text-muted-foreground mt-0.5">We reply within 24 hours</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
              </div>
            </a>

            {/* Website */}
            <a
              href="https://knp-agency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block glass p-5 rounded-3xl hover:bg-white/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visit Website</p>
                  <p className="font-bold text-lg tracking-tight">knp-agency.com</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Browse all our listings</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
