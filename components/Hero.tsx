"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TAGLINE, HERO_EYEBROW, HERO_DESCRIPTION } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

// Deliberately does NOT use Reveal: whileInView + margin:"-80px" can fail to
// fire for content that's already in the viewport on load (the hero always
// is), leaving it permanently blank. initial/animate always runs on mount.
//
// Reduced motion uses `initial={false}` rather than `initial={undefined}` —
// framer-motion's documented way to skip the enter animation and render
// straight at the `animate` target. Nulling the prop instead (as opposed to
// setting it to `false`) can leave the very first (pre-reduced-motion-check)
// inline opacity:0 from SSR pinned on the element if the reduce state
// resolves before an animation gets a chance to run — same trap as the one
// Reveal/ScrollProgress guard against.
export default function Hero({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const words = t(TAGLINE, locale).split(" ");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-ink" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-brandYellow font-semibold tracking-wide uppercase text-sm mb-4"
        >
          {t(HERO_EYEBROW, locale)}
        </motion.p>

        <h1 className="font-display text-5xl md:text-7xl tracking-wide text-cream mb-6">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08 }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 }}
          className="text-lg text-cream/80 max-w-xl mx-auto mb-10"
        >
          {t(HERO_DESCRIPTION, locale)}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-brandYellow text-ink font-semibold px-6 py-3 rounded-lg shadow-sm shadow-black/20 hover:brightness-95 hover:shadow-md hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {locale === "nl" ? "Consult aanvragen" : "Request a consult"}
          </a>
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 bg-brandYellow text-ink font-semibold px-6 py-3 rounded-lg shadow-sm shadow-black/20 hover:brightness-95 hover:shadow-md hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {locale === "nl" ? "Bekijk werk" : "View work"}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
