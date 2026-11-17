import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SERVICE_CATEGORIES, STYLES } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

export default function Services({ locale }: { locale: Locale }) {
  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading
        title={locale === "nl" ? "Diensten & stijlen" : "Services & styles"}
        subtitle={
          locale === "nl"
            ? "Prijzen op aanvraag — elk werk begint met een consult."
            : "Pricing on request — every piece starts with a consult."
        }
      />

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {STYLES.map((style) => (
          <span
            key={style.nl}
            className="rounded-full border border-cream/15 px-3 py-1 text-xs font-medium text-cream/70"
          >
            {t(style, locale)}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICE_CATEGORIES.map((group, i) => (
          <Reveal key={group.category.nl} delay={Math.min(i, 6) * 0.06}>
            <div className="h-full bg-primary border-2 border-brandYellow rounded-2xl p-6">
              <h3 className="font-semibold text-cream mb-3">{t(group.category, locale)}</h3>
              <ul className="divide-y divide-cream/10">
                {group.items.map((item) => (
                  <li key={item.name.nl} className="py-3">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm text-cream/70">{t(item.name, locale)}</span>
                      <span className="font-semibold text-cream whitespace-nowrap">{item.price}</span>
                    </div>
                    {item.note && <p className="text-xs text-cream/60 mt-1">{t(item.note, locale)}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
