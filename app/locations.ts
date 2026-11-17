// The 5-city facts. Starting a new pitch for a different multi-location
// business? This file (plus content.ts and the four tokens in
// tailwind.config.ts) is the whole edit surface.
//
// Facts below are decoded from a same-day site audit of tattoosaunders.nl.
// Four of five branches have no public phone number; Utrecht has no public
// email. That is rendered, not hidden — the gaps are part of the pitch.
// Opening hours were not published anywhere found during the audit, so every
// branch carries them as unconfirmed rather than guessed.

import { both, type Bi } from "./i18n";

export type DayCode =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const ALL_DAYS: DayCode[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_LABEL: Record<DayCode, Bi> = {
  Monday: { nl: "Maandag", en: "Monday" },
  Tuesday: { nl: "Dinsdag", en: "Tuesday" },
  Wednesday: { nl: "Woensdag", en: "Wednesday" },
  Thursday: { nl: "Donderdag", en: "Thursday" },
  Friday: { nl: "Vrijdag", en: "Friday" },
  Saturday: { nl: "Zaterdag", en: "Saturday" },
  Sunday: { nl: "Zondag", en: "Sunday" },
};

// opens/closes null = unconfirmed. One source drives both the hours table
// and JSON-LD openingHoursSpecification (which omits a block entirely when
// null, rather than ever publish a guess).
export type HoursBlock = { days: DayCode[]; opens: string | null; closes: string | null };

export type Location = {
  slug: string; // full route segment, e.g. "tattooshop-enschede"
  city: Bi;
  street: string;
  postcode?: string;
  phoneDisplay?: string;
  phoneTel?: string;
  email?: string;
  geo: { lat: number; lng: number } | null;
  hours: HoursBlock[];
  intro: Bi;
};

const UNCONFIRMED_HOURS: HoursBlock[] = [{ days: ALL_DAYS, opens: null, closes: null }];

export const LOCATIONS: Location[] = [
  {
    slug: "tattooshop-enschede",
    city: both("Enschede"),
    street: "Haaksbergerstraat 126E",
    phoneDisplay: "06 14 80 17 17",
    phoneTel: "tel:+31614801717",
    email: "tattooenschede@gmail.com",
    geo: null,
    hours: UNCONFIRMED_HOURS,
    intro: {
      nl: "Onze vestiging in Enschede, aan de Haaksbergerstraat. Zowel op afspraak als voor walk-ins.",
      en: "Our Enschede location, on Haaksbergerstraat. Walk-ins and appointments both welcome.",
    },
  },
  {
    slug: "tattooshop-groningen",
    city: both("Groningen"),
    street: "Gelkingestraat 14",
    postcode: "9711 NC",
    email: "tattoosaundersgroningen@gmail.com",
    geo: null,
    hours: UNCONFIRMED_HOURS,
    intro: {
      nl: "Onze vestiging in het centrum van Groningen, aan de Gelkingestraat. Zowel op afspraak als voor walk-ins.",
      en: "Our Groningen location, in the city centre on Gelkingestraat. Walk-ins and appointments both welcome.",
    },
  },
  {
    slug: "tattooshop-tiel",
    city: both("Tiel"),
    street: "Vleesstraat 17A",
    email: "saunderstiel@gmail.com",
    geo: null,
    hours: UNCONFIRMED_HOURS,
    intro: {
      nl: "Onze vestiging in Tiel, aan de Vleesstraat. Zowel op afspraak als voor walk-ins.",
      en: "Our Tiel location, on Vleesstraat. Walk-ins and appointments both welcome.",
    },
  },
  {
    slug: "tattooshop-beverwijk",
    city: both("Beverwijk"),
    street: "De Bazaar Beverwijk, Hal 25",
    email: "saunderstattoo@hotmail.com",
    geo: null,
    hours: UNCONFIRMED_HOURS,
    intro: {
      nl: "Onze vestiging in De Bazaar Beverwijk, Hal 25. Zowel op afspraak als voor walk-ins.",
      en: "Our Beverwijk location, inside De Bazaar Beverwijk, Hall 25. Walk-ins and appointments both welcome.",
    },
  },
  {
    slug: "tattooshop-utrecht",
    city: both("Utrecht"),
    street: "Kintgenshaven 1A",
    geo: null,
    hours: UNCONFIRMED_HOURS,
    intro: {
      nl: "Onze vestiging in Utrecht, aan de Kintgenshaven. Zowel op afspraak als voor walk-ins.",
      en: "Our Utrecht location, on Kintgenshaven. Walk-ins and appointments both welcome.",
    },
  },
];
