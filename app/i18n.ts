// Locale primitives — no i18n library. Real URLs under /[locale]/ instead of
// a client-side toggle, because the whole pitch thesis is "you have no
// indexable URLs"; an EN version that isn't a real URL would contradict it.

export type Locale = "nl" | "en";
export const LOCALES: Locale[] = ["nl", "en"];
export const DEFAULT_LOCALE: Locale = "nl";

// Every string that varies by locale is typed through this — a forgotten
// translation is a compile error (missing key), not a silently-English page.
export type Bi = { readonly [L in Locale]: string };

// For strings intentionally identical across locales (proper nouns, handles,
// bracketed placeholders) — spells out the "yes, really the same" intent
// instead of looking like a missed translation.
export function both(s: string): Bi {
  return { nl: s, en: s };
}

export function t(v: Bi, locale: Locale): string {
  return v[locale];
}
