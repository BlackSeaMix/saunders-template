import { SHOP_NAME, SITE_URL, SOCIALS } from "@/app/content";
import type { Location } from "@/app/locations";
import { t, type Locale } from "@/app/i18n";

const SCHEMA_DAY: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

// TattooParlor is a real schema.org type — no additionalType hack needed.
// No aggregateRating (we have no first-party review data — scraping a
// directory mirror onto a spec demo would be exactly the fabrication the
// house rule forbids) and no priceRange (every price is "TBD"; a priceRange
// would be the only invented fact on the page).
export default function JsonLd({ location, locale }: { location: Location; locale: Locale }) {
  const openingHoursSpecification = location.hours
    .filter((block) => block.opens && block.closes)
    .map((block) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: block.days.map((d) => SCHEMA_DAY[d]),
      opens: block.opens,
      closes: block.closes,
    }));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: `${SHOP_NAME} ${t(location.city, locale)}`,
    url: `${SITE_URL}/${locale}/${location.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.street,
      ...(location.postcode ? { postalCode: location.postcode } : {}),
      addressLocality: t(location.city, locale),
      addressCountry: "NL",
    },
    sameAs: [SOCIALS.instagram, SOCIALS.facebook, SOCIALS.x],
  };

  if (location.geo) {
    data.geo = { "@type": "GeoCoordinates", latitude: location.geo.lat, longitude: location.geo.lng };
  }
  if (location.phoneTel) {
    data.telephone = location.phoneTel.replace(/^tel:/, "");
  }
  if (location.email) {
    data.email = location.email;
  }
  if (openingHoursSpecification.length > 0) {
    data.openingHoursSpecification = openingHoursSpecification;
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
