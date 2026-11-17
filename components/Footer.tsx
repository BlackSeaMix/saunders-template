import { Sparkles } from "lucide-react";
import { SHOP_NAME, KVK_NUMBER, SOCIALS } from "@/app/content";
import type { Locale } from "@/app/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-cream/10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-cream/60">
        <div className="flex items-center gap-2 font-medium text-cream">
          <Sparkles className="h-4 w-4 text-brandYellow shrink-0" />
          {SHOP_NAME}
        </div>
        <div className="flex items-center gap-4">
          <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
            Instagram
          </a>
          <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
            Facebook
          </a>
          <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
            X
          </a>
        </div>
        <p className="text-center md:text-right">
          &copy; {new Date().getFullYear()} {SHOP_NAME}. {locale === "nl" ? "Alle rechten voorbehouden." : "All rights reserved."}
          <br />
          <span className="text-cream/60">KvK {KVK_NUMBER}</span>
        </p>
      </div>
    </footer>
  );
}
