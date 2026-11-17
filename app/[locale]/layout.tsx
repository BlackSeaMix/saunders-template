import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SHOP_NAME, TAGLINE, SITE_URL } from "@/app/content";
import { LOCALES, DEFAULT_LOCALE, t, type Locale } from "@/app/i18n";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: "400" });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${SHOP_NAME} — ${t(TAGLINE, locale)}`,
    description: t(TAGLINE, locale),
    robots: { index: false, follow: false },
    alternates: {
      languages: { nl: "/nl", en: "/en", "x-default": "/nl" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased bg-ink text-cream`}
      >
        <ScrollProgress />
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
