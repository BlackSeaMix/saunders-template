import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import TrustGGD from "@/components/TrustGGD";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Artists from "@/components/Artists";
import LocationsOverview from "@/components/LocationsOverview";
import Aftercare from "@/components/Aftercare";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import ConsultForm from "@/components/ConsultForm";
import { SHOP_NAME, SITE_URL, SOCIALS } from "@/app/content";
import { LOCALES, type Locale } from "@/app/i18n";

function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SHOP_NAME,
    url: `${SITE_URL}/${locale}`,
    sameAs: [SOCIALS.instagram, SOCIALS.facebook, SOCIALS.x],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <Hero locale={locale} />
      <TrustGGD locale={locale} />
      <Services locale={locale} />
      <Gallery locale={locale} />
      <Artists locale={locale} />
      <LocationsOverview locale={locale} />
      <Aftercare locale={locale} />
      <Reviews locale={locale} />
      <Faq locale={locale} />
      <ConsultForm locale={locale} />
    </>
  );
}
