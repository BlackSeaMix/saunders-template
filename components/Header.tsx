"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { SHOP_NAME } from "@/app/content";
import type { Locale } from "@/app/i18n";
import ConceptBadge from "./ConceptBadge";
import LocaleToggle from "./LocaleToggle";

const NAV_LINKS: { href: string; label: { nl: string; en: string } }[] = [
  { href: "#services", label: { nl: "Diensten", en: "Services" } },
  { href: "#gallery", label: { nl: "Galerij", en: "Gallery" } },
  { href: "#locations", label: { nl: "Vestigingen", en: "Locations" } },
  { href: "#faq", label: { nl: "FAQ", en: "FAQ" } },
];

export default function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-display text-xl tracking-wide shrink-0">
          <Sparkles className="h-5 w-5 text-brandYellow shrink-0" />
          {SHOP_NAME}
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-cream/70">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={`/${locale}${link.href}`} className="hover:text-cream transition-colors">
              {link.label[locale]}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ConceptBadge locale={locale} />
          <LocaleToggle locale={locale} />
          <a
            href={`/${locale}#booking`}
            className="inline-flex items-center gap-2 bg-brandYellow text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {locale === "nl" ? "Consult aanvragen" : "Request consult"}
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden p-2 -mr-2 rounded-full text-brandYellow hover:bg-cream/10 active:bg-cream/20 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-cream/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-cream/70">
          <ConceptBadge locale={locale} />
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`/${locale}${link.href}`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-cream transition-colors"
            >
              {link.label[locale]}
            </a>
          ))}
          <a href={`/${locale}#booking`} className="flex items-center gap-2 text-cream font-semibold">
            {locale === "nl" ? "Consult aanvragen" : "Request consult"}
          </a>
          <LocaleToggle locale={locale} />
        </div>
      )}
    </header>
  );
}
