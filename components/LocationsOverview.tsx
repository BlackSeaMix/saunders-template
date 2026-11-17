import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LocationCard from "./LocationCard";
import { LOCATIONS } from "@/app/locations";
import type { Locale } from "@/app/i18n";

export default function LocationsOverview({ locale }: { locale: Locale }) {
  return (
    <section id="locations" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <SectionHeading
        title={locale === "nl" ? "Vestigingen" : "Locations"}
        subtitle={
          locale === "nl"
            ? "Vijf vestigingen door Nederland — kies de dichtstbijzijnde."
            : "Five locations across the Netherlands — pick the nearest."
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {LOCATIONS.map((location, i) => (
          <Reveal key={location.slug} delay={Math.min(i, 6) * 0.06}>
            <LocationCard location={location} locale={locale} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
