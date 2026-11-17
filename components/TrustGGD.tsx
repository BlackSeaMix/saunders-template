import { ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { TRUST_POINTS } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

export default function TrustGGD({ locale }: { locale: Locale }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10 border-t border-cream/10">
      <Reveal className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {TRUST_POINTS.map((point) => (
          <div key={point.nl} className="flex items-center gap-2 text-sm font-medium text-cream/80">
            <ShieldCheck className="h-4 w-4 text-brandYellow shrink-0" />
            {t(point, locale)}
          </div>
        ))}
      </Reveal>
    </section>
  );
}
