import type { MetadataRoute } from "next";
import { SITE_URL } from "./content";
import { LOCATIONS } from "./locations";
import { LOCALES } from "./i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = LOCALES.map((locale) => ({ url: `${SITE_URL}/${locale}` }));
  const cities = LOCATIONS.flatMap((location) =>
    LOCALES.map((locale) => ({ url: `${SITE_URL}/${locale}/${location.slug}` }))
  );
  return [...home, ...cities];
}
