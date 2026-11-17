# Shop landing page template

A single-page Next.js landing page for pitching small local businesses (barbershop, salon, etc.) a simple website, plus a basic booking form. No database, no auth — just a fast, deployable site with one serverless function for bookings.

## Workflow: from template to live site

1. **Start a new project.** Click "Use this template" on GitHub for a generic shop, or run the `/new-barber-template` Claude Code skill for a barbershop variant with a color palette and seeded content already picked out. See "Starting a new shop" below.
2. **Branch.** Work happens on `feature-<name>` branches off `develop`; open a PR back into `develop` when ready. `develop` gets merged into `main` periodically once it's in a good state. Full convention and rationale in `CLAUDE.md`.
3. **Fill in the real business's details** in `app/content.ts` — see "Editing content" below. Never fabricate real-looking data (address, phone, prices) for a business that hasn't confirmed it — leave it `TBD` rather than guessing.
4. **Set up the booking form's Google Calendar integration** — see "Booking form" below — then confirm it actually works end-to-end with `npm run test:calendar` before relying on it.
5. **Deploy.** `npm run deploy` for production — the script itself refuses to run from anything except `develop`/`main`, so it can't accidentally ship an unfinished feature branch. To test a feature branch live first, deploy a throwaway Vercel preview (`vercel`, no `--prod`) and delete it once confirmed good (`vercel remove <url> --yes`).

The sections below cover each of these in detail.

## Editing content for a shop

Everything shop-specific (name, tagline, phone, address, services/prices, gallery images, hours, reviews) lives in `app/content.ts`. Edit that one file.

The color palette is defined as custom Tailwind tokens in `tailwind.config.ts` (`ink`, `cream`, `brandYellow`, `primary` — currently a dark theme) and used via class names directly in `app/page.tsx`. To re-theme, change the hex values in `tailwind.config.ts`; the class names (`bg-ink`, `text-cream`, etc.) stay the same.

### Gallery images

Drop image files into `public/gallery/` and set the matching `src` (e.g. `"/gallery/lashes-1.jpg"`) on the corresponding entry in `GALLERY_ITEMS` in `app/content.ts`. Entries with `src: null` render as a placeholder tile instead.

## Booking form

The "Book Now" section posts to `app/api/book/route.ts`, which creates an event directly on the shop's Google Calendar (via a service account, so no interactive login is needed). Copy `.env.example` to `.env.local` and fill in:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` — from a Google Cloud service account JSON key
- `GOOGLE_CALENDAR_ID` — the calendar to write events to (the shop's Google account email for their primary calendar, or a specific calendar's ID from its settings page)

Without these set, the form still works but bookings are only logged server-side (no calendar event created), and the visitor sees a "call us instead" message.

### Preventing double-bookings

Picking a date fetches real availability from `app/api/availability/route.ts` (a Google Calendar `freeBusy` query) and the time dropdown shows already-booked slots as disabled, labeled "(Booked)". That's a UX hint, not the actual guard — `app/api/book/route.ts` re-checks the exact slot against the calendar immediately before creating the event, so two people racing to book the same slot within seconds of each other still can't both succeed; the second request gets a 409 with a "pick another slot" message. Bookable hours, slot interval, and appointment length are `BOOKING_HOURS` / `BOOKING_SLOT_MINUTES` / `BOOKING_DURATION_MINUTES` in `app/content.ts` — placeholder defaults (09:00–18:00, 30-min slots, 60-min appointments), tune to the real business.

### Confirming the booking

On a successful booking, the page shows an **"Add to Google Calendar"** link (a pre-filled `calendar.google.com/calendar/render` URL, built client-side in `app/page.tsx`) so the visitor can add the appointment to their own calendar in one click.

This is deliberately *not* done via Calendar API attendee invites (`attendees` + `sendUpdates=all`) — Google rejects that from a bare service account with "Service accounts cannot invite attendees without Domain-Wide Delegation of Authority," which only exists for Google Workspace, not the personal Gmail calendars this template targets. Confirmed against a real personal-Gmail test calendar. If the real business has Google Workspace (not personal Gmail) and wants actual invite *emails*, domain-wide delegation can be set up by a Workspace admin to make the attendee-invite approach work — out of scope for this template's default setup.

## Spam protection (reCAPTCHA)

The booking form is a public, unauthenticated endpoint — without any
protection, a script could submit it repeatedly and fill the calendar with
junk bookings. Google reCAPTCHA v2 (the "I'm not a robot" checkbox) guards
against that. Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — public, used client-side to render the
  checkbox widget
- `RECAPTCHA_SECRET_KEY` — server-only, used to verify the token before a
  booking is created

Without these set, the form works exactly as before with no captcha —
spam protection is off, not broken.

### One-time reCAPTCHA setup

1. Go to [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
   and register a new site.
2. Choose **reCAPTCHA v2 → "I'm not a robot" Checkbox**.
3. Add the domain(s) the site will run on. `localhost` doesn't need to be
   added — Google allow-lists it automatically for any v2 key, so local
   testing works without extra setup.
4. Copy the **Site Key** into `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and the
   **Secret Key** into `RECAPTCHA_SECRET_KEY`.

### One-time Google Calendar setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project (or reuse one) and enable the **Google Calendar API**.
2. Create a **Service Account** (IAM & Admin → Service Accounts), then create a JSON key for it and download it.
3. From that JSON file: `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `private_key` → `GOOGLE_PRIVATE_KEY` (keep the `\n` line breaks as-is, the app un-escapes them).
4. On the Google account whose calendar should receive bookings, open Google Calendar → Settings → pick the calendar → **Share with specific people** → add the service account's email with **"Make changes to events"** permission.
5. `GOOGLE_CALENDAR_ID` is that calendar's address, found under Settings → "Integrate calendar" (for a primary calendar, it's just the Google account's email address).

### Verifying it works

```bash
npm run test:calendar
```

Books a single slot and confirms it lands as a real event on the calendar, books two more and confirms each lands separately, then confirms `/api/availability` correctly reports all three booked slots as unavailable (and an untouched slot as still available), before deleting the test events again. Needs `.env.local` set up per above — targets `http://localhost:3000` by default (run `npm run dev` in another terminal first), or point it elsewhere with `TEST_URL=https://your-deployment.vercel.app npm run test:calendar`.

This is an integration test, not a unit test — it makes real network calls and needs real credentials, so it's not wired into any CI. Run it manually after setup, after rotating the service account key, or whenever you want to confirm the calendar integration specifically still works.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
npm run deploy
```

Builds locally, deploys to Vercel production, and checks the live URL returns 200.

## Starting a new shop from this template

1. Click **"Use this template" → "Create a new repository"** on GitHub (this repo is a template repo) — gives you a fresh repo with clean history, no need to manually copy/strip anything. For barbershop-specific variants, use the `/new-barber-template` Claude Code skill instead (`.claude/skills/new-barber-template/SKILL.md`) — it does this step for you, plus picks a color palette and seeds barber-specific placeholder content.
2. Clone the new repo and edit `app/content.ts` with the real shop's details.
3. `npm install`
4. Set up a new Vercel project for it (`npx vercel link`) and configure the Google Calendar env vars (see "Booking form" above).
5. `npm run deploy`
