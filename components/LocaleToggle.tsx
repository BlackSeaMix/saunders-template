"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/app/i18n";

const LABEL: Record<Locale, string> = { nl: "NL", en: "EN" };

export default function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  // pathname is "/nl" or "/nl/tattooshop-enschede" — swap the first segment
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          aria-current={l === locale ? "true" : undefined}
          className={
            l === locale
              ? "px-2 py-1 rounded text-ink bg-cream"
              : "px-2 py-1 rounded text-cream/60 hover:text-cream transition-colors"
          }
        >
          {LABEL[l]}
        </Link>
      ))}
    </div>
  );
}
