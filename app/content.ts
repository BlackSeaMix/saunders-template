// Everything shop-specific lives here. Starting a new pitch? Edit this file only.
//
// Everything below is a placeholder — replace with the real business's
// details. Don't invent plausible-looking data for a real business (address,
// phone, prices); leave it as "TBD" until confirmed rather than guessing.

export const SHOP_NAME = "[Business Name]";
export const TAGLINE = "[Short tagline]";
export const HERO_EYEBROW = "Book your appointment online";
export const HERO_DESCRIPTION = `${SHOP_NAME} is [one or two sentences describing the business and its services].`;

export const PHONE_DISPLAY = "[PHONE — TBD]";
export const PHONE_TEL = "tel:+10000000000";
export const ADDRESS = "[ADDRESS — TBD]";

export const SERVICE_CATEGORIES: {
  category: string;
  items: { name: string; price: string; note?: string }[];
}[] = [
  {
    category: "[Category 1]",
    items: [
      { name: "[Service name]", price: "TBD" },
      { name: "[Service name]", price: "TBD", note: "Optional note, e.g. duration or details" },
      { name: "[Service name]", price: "TBD" },
    ],
  },
  {
    category: "[Category 2]",
    items: [
      { name: "[Service name]", price: "TBD" },
      { name: "[Service name]", price: "TBD" },
    ],
  },
];

export const BOOKING_DEPOSIT_NOTE =
  "[Optional: deposit/cancellation policy, e.g. \"A €X deposit is required to book.\" Delete this line if not applicable.]";

export const GALLERY_ITEMS: { src: string | null; alt: string }[] = [
  { src: null, alt: "[Photo]" },
  { src: null, alt: "[Photo]" },
  { src: null, alt: "[Photo]" },
  { src: null, alt: "[Photo]" },
  { src: null, alt: "[Photo]" },
  { src: null, alt: "[Photo]" },
];

export const HOURS = [
  { day: "Monday", time: "TBD" },
  { day: "Tuesday", time: "TBD" },
  { day: "Wednesday", time: "TBD" },
  { day: "Thursday", time: "TBD" },
  { day: "Friday", time: "TBD" },
  { day: "Saturday", time: "TBD" },
  { day: "Sunday", time: "TBD" },
];

export const REVIEWS: { quote: string; name: string }[] = [];
