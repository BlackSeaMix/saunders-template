"use client";

import { useEffect, useRef, useState } from "react";
import { STYLES, SOCIALS } from "@/app/content";
import { LOCATIONS } from "@/app/locations";
import { t, type Locale } from "@/app/i18n";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const BUDGET_BANDS: { nl: string; en: string }[] = [
  { nl: "Klein (losstaand motief)", en: "Small (standalone motif)" },
  { nl: "Gemiddeld (paar uur)", en: "Medium (a few hours)" },
  { nl: "Groot (sessie / meerdere afspraken)", en: "Large (session / multiple appointments)" },
  { nl: "Weet ik nog niet", en: "Not sure yet" },
];

const DAY_OPTIONS: { nl: string; en: string }[] = [
  { nl: "Ma", en: "Mon" },
  { nl: "Di", en: "Tue" },
  { nl: "Wo", en: "Wed" },
  { nl: "Do", en: "Thu" },
  { nl: "Vr", en: "Fri" },
  { nl: "Za", en: "Sat" },
  { nl: "Zo", en: "Sun" },
];

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "bg-white text-ink placeholder:text-zinc-400 border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary";

export default function ConsultForm({
  locale,
  defaultLocationSlug,
}: {
  locale: Locale;
  defaultLocationSlug?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isAdult, setIsAdult] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [locationSlug, setLocationSlug] = useState(defaultLocationSlug ?? "");
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [lastSummary, setLastSummary] = useState<{ name: string; idea: string } | null>(null);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileName(null);
    setError(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError(locale === "nl" ? "Bestand is groter dan 5 MB." : "File is larger than 5 MB.");
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function toggleDay(day: string) {
    setSelectedDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isAdult) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setError(null);

    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, { method: "POST", body: data });
        if (!res.ok) throw new Error("submit failed");
        setStatus("success");
        setLastSummary({ name: String(data.get("name") ?? ""), idea: String(data.get("idea") ?? "") });
      } catch {
        setStatus("error");
        setError(
          locale === "nl"
            ? "Versturen is niet gelukt. Probeer het later opnieuw."
            : "Couldn't send that. Please try again later."
        );
      }
      return;
    }

    // Demo mode: no NEXT_PUBLIC_FORM_ENDPOINT configured, so no network
    // request is made at all — the form validates client-side, then shows a
    // simulated success with a mailto: fallback the visitor clicks themselves.
    setStatus("success");
    setLastSummary({ name: String(data.get("name") ?? ""), idea: String(data.get("idea") ?? "") });
  }

  const selectedLocation = LOCATIONS.find((loc) => loc.slug === locationSlug);
  const mailtoTarget = selectedLocation?.email;

  function buildMailtoHref() {
    if (!mailtoTarget || !lastSummary) return null;
    const subject = `${locale === "nl" ? "Consultaanvraag" : "Consult request"} — ${lastSummary.name}`;
    const body =
      (locale === "nl" ? "Idee: " : "Idea: ") +
      lastSummary.idea +
      (selectedLocation ? `\n${locale === "nl" ? "Vestiging" : "Location"}: ${t(selectedLocation.city, locale)}` : "");
    return `mailto:${mailtoTarget}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  const mailtoHref = buildMailtoHref();

  return (
    <section id="booking" className="max-w-6xl mx-auto px-6 py-20 border-t border-cream/10">
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl tracking-wide mb-3">
          {locale === "nl" ? "Consult aanvragen" : "Request a consult"}
        </h2>
        <p className="text-cream/70">
          {locale === "nl"
            ? "Vertel ons je idee — we nemen contact op om het verder te bespreken."
            : "Tell us your idea — we'll reach out to talk it through."}
        </p>
        <p className="mt-2 text-xs text-brandYellow/90">
          {locale === "nl"
            ? "Demo: dit formulier verstuurt niets echt en slaat geen gegevens op."
            : "Demo: this form doesn't really send anything or store any data."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          required
          placeholder={locale === "nl" ? "Je naam" : "Your name"}
          aria-label={locale === "nl" ? "Je naam" : "Your name"}
          className={`sm:col-span-2 ${inputClass}`}
        />
        <input
          type="email"
          name="email"
          required
          placeholder={locale === "nl" ? "E-mail" : "Email"}
          aria-label={locale === "nl" ? "E-mail" : "Email"}
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder={locale === "nl" ? "Telefoon (optioneel)" : "Phone (optional)"}
          aria-label={locale === "nl" ? "Telefoon" : "Phone"}
          className={inputClass}
        />

        <select
          name="location"
          value={locationSlug}
          onChange={(e) => setLocationSlug(e.target.value)}
          aria-label={locale === "nl" ? "Kies een vestiging" : "Choose a location"}
          className={`sm:col-span-2 ${inputClass}`}
        >
          <option value="">{locale === "nl" ? "Kies een vestiging" : "Choose a location"}</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.slug} value={loc.slug}>
              {t(loc.city, locale)}
            </option>
          ))}
        </select>

        <select name="style" defaultValue="" aria-label={locale === "nl" ? "Stijl" : "Style"} className={inputClass}>
          <option value="" disabled>
            {locale === "nl" ? "Stijl" : "Style"}
          </option>
          {STYLES.map((style) => (
            <option key={style.nl} value={style.nl}>
              {t(style, locale)}
            </option>
          ))}
        </select>
        <input
          name="placement"
          placeholder={locale === "nl" ? "Plaatsing op het lichaam" : "Placement on the body"}
          aria-label={locale === "nl" ? "Plaatsing op het lichaam" : "Placement on the body"}
          className={inputClass}
        />

        <input
          name="size"
          placeholder={locale === "nl" ? "Ongeveer formaat" : "Approximate size"}
          aria-label={locale === "nl" ? "Ongeveer formaat" : "Approximate size"}
          className={inputClass}
        />
        <select name="budget" defaultValue="" aria-label={locale === "nl" ? "Budget" : "Budget"} className={inputClass}>
          <option value="" disabled>
            {locale === "nl" ? "Budget" : "Budget"}
          </option>
          {BUDGET_BANDS.map((band) => (
            <option key={band.nl} value={band.nl}>
              {t(band, locale)}
            </option>
          ))}
        </select>

        <textarea
          name="idea"
          required
          rows={3}
          placeholder={locale === "nl" ? "Beschrijf je idee" : "Describe your idea"}
          aria-label={locale === "nl" ? "Beschrijf je idee" : "Describe your idea"}
          className={`sm:col-span-2 ${inputClass}`}
        />

        <div className="sm:col-span-2">
          <p className="text-sm text-cream/70 mb-2">
            {locale === "nl" ? "Voorkeursdagen (optioneel)" : "Preferred days (optional)"}
          </p>
          <div className="flex flex-wrap gap-2">
            {DAY_OPTIONS.map((day) => (
              <button
                key={day.nl}
                type="button"
                onClick={() => toggleDay(day.nl)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedDays.includes(day.nl)
                    ? "bg-brandYellow text-ink"
                    : "border border-cream/20 text-cream/70 hover:text-cream"
                }`}
              >
                {t(day, locale)}
              </button>
            ))}
          </div>
          <input type="hidden" name="preferredDays" value={selectedDays.join(", ")} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reference-upload" className="text-sm text-cream/70 mb-2 block">
            {locale === "nl" ? "Referentiefoto (optioneel, max 5 MB)" : "Reference photo (optional, max 5 MB)"}
          </label>
          <input
            id="reference-upload"
            type="file"
            name="reference"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-cream/70"
          />
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={fileName ?? ""} className="mt-3 h-24 w-24 rounded-lg object-cover" />
          )}
        </div>

        <label className="sm:col-span-2 flex items-start gap-2 text-sm text-cream/70">
          <input
            type="checkbox"
            required
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
            className="mt-1"
          />
          <span>
            {locale === "nl"
              ? "Ik verklaar dat ik 18 jaar of ouder ben. (Een verklaring, geen leeftijdscontrole.)"
              : "I declare that I am 18 years or older. (A declaration, not an age verification.)"}
          </span>
        </label>

        <button
          type="submit"
          disabled={!isAdult || status === "submitting"}
          className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-brandYellow text-ink font-semibold px-6 py-3 rounded-lg shadow-sm shadow-black/20 hover:brightness-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50"
        >
          {status === "submitting" ? (locale === "nl" ? "Versturen…" : "Sending…") : locale === "nl" ? "Verstuur aanvraag" : "Send request"}
        </button>

        {status === "success" && (
          <div className="sm:col-span-2 text-center space-y-3">
            <p className="text-sm text-emerald-500">
              {locale === "nl"
                ? "Bedankt! Dit is een demo — er is niets echt verstuurd."
                : "Thanks! This is a demo — nothing was actually sent."}
            </p>
            {mailtoHref ? (
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 bg-primary border-2 border-brandYellow text-cream text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all duration-200"
              >
                {locale === "nl" ? "Open e-mail om echt te versturen" : "Open email to actually send it"}
              </a>
            ) : (
              <p className="text-xs text-cream/60">
                {locale === "nl"
                  ? `[Geen e-mail bekend voor deze vestiging — neem contact op via Instagram: ${SOCIALS.instagram}]`
                  : `[No email on file for this location — reach out via Instagram: ${SOCIALS.instagram}]`}
              </p>
            )}
          </div>
        )}
        {status === "error" && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
      </form>
    </section>
  );
}
