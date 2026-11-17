import { Star } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { REVIEWS, SOCIAL_PROOF_NOTE } from "@/app/content";
import { t, type Locale } from "@/app/i18n";

export default function Reviews({ locale }: { locale: Locale }) {
  if (REVIEWS.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
        <Reveal>
          <p className="text-center text-sm text-cream/50 max-w-2xl mx-auto">{t(SOCIAL_PROOF_NOTE, locale)}</p>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading title={locale === "nl" ? "Reviews" : "Reviews"} />
      <div className="flex flex-col md:flex-row gap-8 justify-center text-center md:text-left">
        {REVIEWS.map((review, i) => (
          <Reveal key={review.quote.nl} delay={Math.min(i, 6) * 0.06} className="flex-1 max-w-sm mx-auto md:mx-0">
            <div className="flex gap-1 mb-3 justify-center md:justify-start">
              {Array.from({ length: 5 }).map((_, star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star < review.rating ? "fill-brandYellow text-brandYellow" : "text-cream/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-cream/80 mb-2">&ldquo;{t(review.quote, locale)}&rdquo;</p>
            <p className="text-sm text-cream/60">{review.name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
