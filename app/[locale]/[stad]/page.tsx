import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import MapEmbed from "@/components/MapEmbed";
import JsonLd from "@/components/JsonLd";
import ConsultForm from "@/components/ConsultForm";
import ConceptBadge from "@/components/ConceptBadge";
import { SHOP_NAME } from "@/app/content";
import { LOCATIONS, DAY_LABEL, type HoursBlock } from "@/app/locations";
import { LOCALES, DEFAULT_LOCALE, t, type Locale } from "@/app/i18n";

// Full slug as the dynamic segment, not "tattooshop-[stad]" — App Router
// dynamic segments must be the whole path segment; prefix-[param] is a
// Pages-Router idea and silently doesn't match anything.
export function generateStaticParams() {
  return LOCATIONS.flatMap((location) => LOCALES.map((locale) => ({ locale, stad: location.slug })));
}
export const dynamicParams = false;

function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

function findLocation(stad: string) {
  return LOCATIONS.find((l) => l.slug === stad);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; stad: string }>;
}): Promise<Metadata> {
  const { locale: raw, stad } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const location = findLocation(stad);
  if (!location) return {};

  const city = t(location.city, locale);
  const title = `${SHOP_NAME} ${city}`;
  const description =
    locale === "nl"
      ? `${SHOP_NAME} in ${city}: ${location.street}. Met en zonder afspraak.`
      : `${SHOP_NAME} in ${city}: ${location.street}. Walk-ins and appointments welcome.`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      languages: {
        nl: `/nl/${stad}`,
        en: `/en/${stad}`,
        "x-default": `/nl/${stad}`,
      },
    },
  };
}

function formatHours(hours: HoursBlock[], locale: Locale) {
  return hours.flatMap((block) =>
    block.days.map((day) => ({
      day: t(DAY_LABEL[day], locale),
      time:
        block.opens && block.closes
          ? `${block.opens}–${block.closes}`
          : locale === "nl"
            ? "[TBD]"
            : "[TBD]",
    }))
  );
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; stad: string }>;
}) {
  const { locale: raw, stad } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const location = findLocation(stad);
  if (!location) notFound();

  const city = t(location.city, locale);
  const phoneLabel = location.phoneDisplay ?? (locale === "nl" ? "[telefoon — TBD]" : "[phone — TBD]");
  const emailLabel = location.email ?? (locale === "nl" ? "[e-mail — TBD]" : "[email — TBD]");
  const otherLocations = LOCATIONS.filter((l) => l.slug !== stad);

  return (
    <>
      <JsonLd location={location} locale={locale} />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="mb-4">
          <ConceptBadge locale={locale} />
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-wide text-cream mb-4">
          {SHOP_NAME} {city}
        </h1>
        <p className="text-cream/80 max-w-xl">{t(location.intro, locale)}</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-12">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center gap-3">
            <Clock className="h-5 w-5 text-brandYellow" />
            {locale === "nl" ? "Openingstijden" : "Opening hours"}
          </h2>
          <ul className="divide-y divide-cream/10 mb-8">
            {formatHours(location.hours, locale).map((h, i) => (
              <li key={`${h.day}-${i}`} className="flex justify-between py-3 text-sm">
                <span className="text-cream/80">{h.day}</span>
                <span className="font-medium text-cream/60 italic">{h.time}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brandYellow shrink-0" />
              <span className="text-cream/80">
                {location.street}
                {location.postcode ? `, ${location.postcode}` : ""}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brandYellow shrink-0" />
              {location.phoneTel ? (
                <a href={location.phoneTel} className="text-cream/80 hover:text-cream">
                  {phoneLabel}
                </a>
              ) : (
                <span className="italic text-cream/50">{phoneLabel}</span>
              )}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brandYellow shrink-0" />
              {location.email ? (
                <a href={`mailto:${location.email}`} className="text-cream/80 hover:text-cream">
                  {emailLabel}
                </a>
              ) : (
                <span className="italic text-cream/50">{emailLabel}</span>
              )}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <MapEmbed
            address={[location.street, location.postcode, city].filter(Boolean).join(", ")}
            title={`${SHOP_NAME} ${city}`}
          />
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 border-t border-cream/10 pt-12">
        <h2 className="text-lg font-semibold text-cream/80 mb-4">
          {locale === "nl" ? "Andere vestigingen" : "Other locations"}
        </h2>
        <div className="flex flex-wrap gap-3">
          {otherLocations.map((loc) => (
            <a
              key={loc.slug}
              href={`/${locale}/${loc.slug}`}
              className="rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/70 hover:text-cream hover:border-brandYellow/50 transition-colors"
            >
              {t(loc.city, locale)}
            </a>
          ))}
        </div>
      </section>

      <ConsultForm locale={locale} defaultLocationSlug={stad} />
    </>
  );
}
