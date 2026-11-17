// Shop-wide bilingual copy. Per-city facts (address/phone/hours) live in
// locations.ts instead — keeping them apart means a re-skin only means
// editing this file, and this file doesn't bury its prose under address
// tables. Starting a new pitch? This file + locations.ts + the four tokens
// in tailwind.config.ts are the whole edit surface.
//
// Everything bracketed is a placeholder or an unconfirmed fact — do not
// invent a plausible-looking replacement. Leave it bracketed until the real
// business confirms it.

import { both, type Bi } from "./i18n";

export const SHOP_NAME = "Tattoo Saunders";
export const KVK_NUMBER = "56778899";

// Required for metadataBase (absolute hreflang URLs) and JSON-LD. Update
// once the real preview alias is known from the deploy step.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tattoo-template-blackseamix.vercel.app";

export const SOCIALS = {
  instagram: "https://instagram.com/tattoosaunders",
  facebook: "https://facebook.com/tattooshop.saunders",
  x: "https://x.com/saunderstattoo",
};

// CONCEPT badge — required on every route for as long as this is a spec
// pitch. Remove only once the client signs.
export const CONCEPT_BADGE: Bi = {
  nl: "CONCEPT · niet officieel",
  en: "CONCEPT · not official",
};

export const TAGLINE: Bi = {
  nl: "Vijf vestigingen. Eén vak.",
  en: "Five locations. One craft.",
};

export const HERO_EYEBROW: Bi = {
  nl: "Tatoeages in Enschede, Groningen, Tiel, Beverwijk & Utrecht",
  en: "Tattoos in Enschede, Groningen, Tiel, Beverwijk & Utrecht",
};

export const HERO_DESCRIPTION: Bi = {
  nl: `${SHOP_NAME} werkt al jaren vanuit vijf vestigingen door heel Nederland. Met en zonder afspraak — vraag een consult aan en we nemen contact op.`,
  en: `${SHOP_NAME} has worked out of five locations across the Netherlands for years. Walk-ins and appointments both welcome — request a consult and we'll get in touch.`,
};

// Styles offered — sourced from third-party directory listings, since none
// of this is on the shop's own current site.
export const STYLES: Bi[] = [
  { nl: "Black & grey", en: "Black & grey" },
  { nl: "Blackwork", en: "Blackwork" },
  { nl: "Realisme", en: "Realism" },
  { nl: "Dotwork", en: "Dotwork" },
  { nl: "Fine line", en: "Fine line" },
  { nl: "Japans / Irezumi", en: "Japanese / Irezumi" },
  { nl: "Lettering", en: "Lettering" },
  { nl: "Ornamenteel", en: "Ornamental" },
  { nl: "Geometrisch", en: "Geometric" },
  { nl: "Mandala", en: "Mandala" },
];

export const SERVICE_CATEGORIES: {
  category: Bi;
  items: { name: Bi; price: string; note?: Bi }[];
}[] = [
  {
    category: { nl: "Consult", en: "Consult" },
    items: [
      {
        name: { nl: "Ontwerpconsult", en: "Design consult" },
        price: "TBD",
        note: {
          nl: "Bespreek idee, plaatsing en stijl voordat je een afspraak maakt.",
          en: "Talk through idea, placement and style before booking a session.",
        },
      },
    ],
  },
  {
    category: { nl: "Tattoos", en: "Tattoos" },
    items: [
      { name: { nl: "Klein (tot ca. 5 cm)", en: "Small (up to ~5 cm)" }, price: "TBD" },
      { name: { nl: "Medium", en: "Medium" }, price: "TBD" },
      { name: { nl: "Groot / sessiewerk", en: "Large / session work" }, price: "TBD" },
      {
        name: { nl: "Cover-up", en: "Cover-up" },
        price: "TBD",
        note: { nl: "Altijd eerst een consult.", en: "Always starts with a consult." },
      },
    ],
  },
  {
    category: { nl: "Nazorg", en: "Aftercare" },
    items: [
      { name: { nl: "Nazorgproducten", en: "Aftercare products" }, price: "TBD" },
      { name: { nl: "Retouche", en: "Touch-up" }, price: "TBD" },
    ],
  },
];

// Artist-led section — bracketed placeholders only. The shop's founder,
// Dean Saunders, is independently identifiable as the owner (confirmed in
// the site audit, which also found he isn't named anywhere on the current
// site) — that single fact is safe to state. Nothing else about the roster
// or any family relationship is asserted; it isn't sourced.
export const ARTISTS_INTRO: Bi = {
  nl: `Opgericht door Dean Saunders. De artiesten per vestiging zijn nog niet bevestigd — onderstaande kaarten zijn placeholders.`,
  en: `Founded by Dean Saunders. Per-location artists aren't confirmed yet — the cards below are placeholders.`,
};

export const ARTISTS: { name: Bi; specialty: Bi; bio: Bi }[] = [
  {
    name: both("[Artiest naam — TBD]"),
    specialty: both("[Stijl — TBD]"),
    bio: {
      nl: "[Bio — TBD. Plaatshoudende tekst; in te vullen met toestemming van de artiest.]",
      en: "[Bio — TBD. Placeholder copy; to be filled in with the artist's consent.]",
    },
  },
  {
    name: both("[Artiest naam — TBD]"),
    specialty: both("[Stijl — TBD]"),
    bio: {
      nl: "[Bio — TBD. Plaatshoudende tekst; in te vullen met toestemming van de artiest.]",
      en: "[Bio — TBD. Placeholder copy; to be filled in with the artist's consent.]",
    },
  },
  {
    name: both("[Artiest naam — TBD]"),
    specialty: both("[Stijl — TBD]"),
    bio: {
      nl: "[Bio — TBD. Plaatshoudende tekst; in te vullen met toestemming van de artiest.]",
      en: "[Bio — TBD. Placeholder copy; to be filled in with the artist's consent.]",
    },
  },
];

export const GALLERY_ITEMS: { src: string | null; alt: Bi; style: string }[] = [
  { src: null, alt: both("[Foto]"), style: "black & grey" },
  { src: null, alt: both("[Foto]"), style: "blackwork" },
  { src: null, alt: both("[Foto]"), style: "realisme" },
  { src: null, alt: both("[Foto]"), style: "fine line" },
  { src: null, alt: both("[Foto]"), style: "japans" },
  { src: null, alt: both("[Foto]"), style: "dotwork" },
];

// Third-party directory figures — never state as Google-verified fact.
export const SOCIAL_PROOF_NOTE: Bi = {
  nl: "[~167 reviews, ~4,3/5 in Groningen — schatting op basis van directory-vermeldingen, niet geverifieerd via Google. ~14K volgers op Instagram.]",
  en: "[~167 reviews, ~4.3/5 in Groningen — estimate from third-party directory listings, not verified against Google. ~14K Instagram followers.]",
};

export const REVIEWS: { quote: Bi; name: string; rating: number }[] = [];

export const TRUST_POINTS: Bi[] = [
  { nl: "GGD-goedgekeurd", en: "GGD-approved" },
  { nl: "Met en zonder afspraak", en: "Walk-ins and appointments" },
  { nl: "Vijf vestigingen in Nederland", en: "Five locations across the Netherlands" },
];

export const AFTERCARE_STEPS: { title: Bi; body: Bi }[] = [
  {
    title: { nl: "Eerste 24 uur", en: "First 24 hours" },
    body: {
      nl: "Laat het folie of verband er 2–4 uur op zitten. Was daarna voorzichtig met lauw water en ongeparfumeerde zeep, dep droog.",
      en: "Leave the film or bandage on for 2–4 hours. Then wash gently with lukewarm water and unscented soap, pat dry.",
    },
  },
  {
    title: { nl: "Eerste twee weken", en: "First two weeks" },
    body: {
      nl: "Houd de tattoo schoon en dun ingesmeerd met een nazorgproduct. Niet krabben of pellen. Vermijd zon, zwembad, sauna en strak zittende kleding op de plek.",
      en: "Keep the tattoo clean and lightly moisturized with an aftercare product. Don't scratch or pick at it. Avoid sun, pools, saunas, and tight clothing over the area.",
    },
  },
  {
    title: { nl: "Twijfel? Bel ons", en: "When in doubt, call us" },
    body: {
      nl: "Overmatige roodheid, zwelling of pus kan op een infectie wijzen — neem dan contact op met je vestiging of een arts.",
      en: "Excessive redness, swelling, or pus can signal infection — contact your location or a doctor.",
    },
  },
];

export const FAQ_ITEMS: { question: Bi; answer: Bi }[] = [
  {
    question: { nl: "Moet ik 18+ zijn?", en: "Do I need to be 18+?" },
    answer: {
      nl: "Ja. We tatoeëren geen minderjarigen, ook niet met toestemming van ouders.",
      en: "Yes. We don't tattoo minors, even with parental consent.",
    },
  },
  {
    question: { nl: "Doet een tattoo pijn?", en: "Does getting a tattoo hurt?" },
    answer: {
      nl: "Dat verschilt per plek op het lichaam en per persoon. Je artiest bespreekt dit vooraf met je tijdens het consult.",
      en: "It varies by placement and by person. Your artist will talk you through it during the consult.",
    },
  },
  {
    question: { nl: "Hoe bereid ik me voor?", en: "How should I prepare?" },
    answer: {
      nl: "Eet van tevoren, slaap goed, vermijd alcohol de avond ervoor, en kom met een schone, uitgeruste huid op de plek.",
      en: "Eat beforehand, sleep well, avoid alcohol the night before, and arrive with clean, well-rested skin at the site.",
    },
  },
  {
    question: { nl: "Doen jullie retouches?", en: "Do you do touch-ups?" },
    answer: {
      nl: "Ja, vraag ernaar tijdens je afspraak of via het consultformulier.",
      en: "Yes — ask during your session or via the consult form.",
    },
  },
];

export const BOOKING_DEPOSIT_NOTE: Bi = {
  nl: "[Optioneel: aanbetalings-/annuleringsbeleid. Nog te bevestigen.]",
  en: "[Optional: deposit/cancellation policy. Still to be confirmed.]",
};
