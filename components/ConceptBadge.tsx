import { CONCEPT_BADGE } from "@/app/content";
import type { Locale } from "@/app/i18n";
import { t } from "@/app/i18n";

export default function ConceptBadge({ locale }: { locale: Locale }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brandYellow/40 bg-brandYellow/10 px-3 py-1 text-xs font-semibold tracking-wide text-brandYellow">
      {t(CONCEPT_BADGE, locale)}
    </span>
  );
}
