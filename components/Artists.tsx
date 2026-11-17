import { User } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { ARTISTS, ARTISTS_INTRO } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

export default function Artists({ locale }: { locale: Locale }) {
  return (
    <section id="artists" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading title={locale === "nl" ? "Artiesten" : "Artists"} subtitle={t(ARTISTS_INTRO, locale)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTISTS.map((artist, i) => (
          <Reveal key={i} delay={Math.min(i, 6) * 0.06}>
            <div className="h-full bg-primary border border-cream/10 rounded-2xl p-6 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-ink border border-cream/15 flex items-center justify-center">
                <User className="h-7 w-7 text-brandYellow" />
              </div>
              <h3 className="font-semibold text-cream mb-1">{t(artist.name, locale)}</h3>
              <p className="text-xs text-brandYellow mb-3">{t(artist.specialty, locale)}</p>
              <p className="text-sm text-cream/70">{t(artist.bio, locale)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
