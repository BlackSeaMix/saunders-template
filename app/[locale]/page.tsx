import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import ConsultForm from "@/components/ConsultForm";
import { LOCALES, type Locale } from "@/app/i18n";

function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <>
      <Hero locale={locale} />
      <Services locale={locale} />
      <Gallery locale={locale} />
      <Reviews locale={locale} />
      <ConsultForm locale={locale} />
    </>
  );
}
