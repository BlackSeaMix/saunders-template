import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { AFTERCARE_STEPS } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

export default function Aftercare({ locale }: { locale: Locale }) {
  return (
    <section id="aftercare" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading
        title={locale === "nl" ? "Nazorg" : "Aftercare"}
        subtitle={
          locale === "nl"
            ? "Hoe je een nieuwe tattoo goed laat genezen."
            : "How to help a new tattoo heal well."
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AFTERCARE_STEPS.map((step, i) => (
          <Reveal key={step.title.nl} delay={Math.min(i, 6) * 0.06}>
            <div className="h-full bg-primary border border-cream/10 rounded-2xl p-6">
              <h3 className="font-semibold text-cream mb-2">{t(step.title, locale)}</h3>
              <p className="text-sm text-cream/70">{t(step.body, locale)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
