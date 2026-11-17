import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Location } from "@/app/locations";
import { t, type Locale } from "@/app/i18n";

export default function LocationCard({ location, locale }: { location: Location; locale: Locale }) {
  const phoneLabel = location.phoneDisplay ?? (locale === "nl" ? "[telefoon — TBD]" : "[phone — TBD]");
  const emailLabel = location.email ?? (locale === "nl" ? "[e-mail — TBD]" : "[email — TBD]");

  return (
    <Link
      href={`/${locale}/${location.slug}`}
      className="block h-full bg-primary border border-cream/10 rounded-2xl p-6 hover:border-brandYellow/50 transition-colors"
    >
      <h3 className="font-semibold text-cream mb-3">{t(location.city, locale)}</h3>
      <div className="space-y-2 text-sm text-cream/70">
        <p className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-brandYellow shrink-0 mt-0.5" />
          <span>
            {location.street}
            {location.postcode ? `, ${location.postcode}` : ""}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-brandYellow shrink-0" />
          <span className={location.phoneDisplay ? undefined : "italic text-cream/50"}>{phoneLabel}</span>
        </p>
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-brandYellow shrink-0" />
          <span className={location.email ? undefined : "italic text-cream/50"}>{emailLabel}</span>
        </p>
      </div>
    </Link>
  );
}
