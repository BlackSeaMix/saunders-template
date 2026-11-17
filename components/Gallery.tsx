"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { GALLERY_ITEMS } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

const ALL = "all";

export default function Gallery({ locale }: { locale: Locale }) {
  const styles = Array.from(new Set(GALLERY_ITEMS.map((item) => item.style)));
  const [filter, setFilter] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === ALL ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.style === filter);

  // Lightbox arrows must walk the FILTERED set, not the full gallery array —
  // otherwise stepping "next" while a filter is active can jump to a tile
  // that isn't even visible on screen.
  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filtered.length) {
      setLightboxIndex(filtered.length > 0 ? 0 : null);
    }
  }, [filtered.length, lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, filtered.length]);

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section id="gallery" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading
        title={locale === "nl" ? "Galerij" : "Gallery"}
        subtitle={locale === "nl" ? "Een indruk van het werk." : "A look at the work."}
      />

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setFilter(ALL)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filter === ALL ? "bg-brandYellow text-ink" : "border border-cream/15 text-cream/70 hover:text-cream"
          }`}
        >
          {locale === "nl" ? "Alles" : "All"}
        </button>
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => setFilter(style)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === style ? "bg-brandYellow text-ink" : "border border-cream/15 text-cream/70 hover:text-cream"
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item, i) =>
          item.src ? (
            <Reveal key={`${item.alt.nl}-${i}`} delay={Math.min(i, 6) * 0.06}>
              <button
                onClick={() => setLightboxIndex(i)}
                className="block w-full"
                aria-label={t(item.alt, locale)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={t(item.alt, locale)}
                  className="w-full h-full aspect-square rounded-2xl object-cover"
                />
              </button>
            </Reveal>
          ) : (
            <Reveal key={`${item.alt.nl}-${i}`} delay={Math.min(i, 6) * 0.06}>
              <button
                onClick={() => setLightboxIndex(i)}
                className="aspect-square w-full rounded-2xl flex flex-col items-center justify-center gap-3 bg-primary border border-cream/10"
              >
                <Sparkles className="h-8 w-8 text-brandYellow" />
                <span className="text-sm font-medium text-cream/70">{t(item.alt, locale)}</span>
              </button>
            </Reveal>
          )
        )}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 px-6"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label={locale === "nl" ? "Sluiten" : "Close"}
            className="absolute top-6 right-6 text-cream/70 hover:text-cream"
          >
            <X className="h-8 w-8" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
                }}
                aria-label={locale === "nl" ? "Vorige" : "Previous"}
                className="absolute left-4 md:left-8 text-cream/70 hover:text-cream"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));
                }}
                aria-label={locale === "nl" ? "Volgende" : "Next"}
                className="absolute right-4 md:right-8 text-cream/70 hover:text-cream"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <div className="max-w-xl w-full text-center" onClick={(e) => e.stopPropagation()}>
            {active.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.src} alt={t(active.alt, locale)} className="w-full rounded-2xl" />
            ) : (
              <div className="aspect-square w-full rounded-2xl flex flex-col items-center justify-center gap-3 bg-primary border border-cream/10">
                <Sparkles className="h-10 w-10 text-brandYellow" />
                <span className="text-cream/70">{t(active.alt, locale)}</span>
              </div>
            )}
            <p className="mt-4 text-sm text-cream/60 capitalize">{active.style}</p>
          </div>
        </div>
      )}
    </section>
  );
}
