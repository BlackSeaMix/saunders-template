import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { FAQ_ITEMS } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

export default function Faq({ locale }: { locale: Locale }) {
  return (
    <section id="faq" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading title="FAQ" />
      <div className="max-w-2xl mx-auto divide-y divide-cream/10">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question.nl} delay={Math.min(i, 6) * 0.06}>
            <details className="group py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-cream">
                {t(item.question, locale)}
                <ChevronDown className="h-4 w-4 text-brandYellow shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-cream/70">{t(item.answer, locale)}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
