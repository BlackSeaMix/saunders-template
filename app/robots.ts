import type { MetadataRoute } from "next";
import { SITE_URL } from "./content";

// Must never compete with the real business's site in search — this is a
// speculative pitch demo carrying their name without their knowledge.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
