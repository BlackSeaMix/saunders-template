# Tattoo shop website template

A bilingual (NL/EN), multi-location Next.js site for pitching tattoo shops a
real website: homepage + a city page per location, a consult-request form,
and a dark editorial gallery. No database, no auth — real URLs under
`/[locale]/`, no i18n library.

## Workflow: from template to live site

1. **Start a new project.** Click "Use this template" on GitHub. Work happens
   on `develop` (or `feature-<name>` branched from it); `develop` is what
   deploys. See `CLAUDE.md` for the full branching convention.
2. **Fill in the real business's details** in `app/content.ts` (shop-wide
   bilingual copy) and `app/locations.ts` (per-city facts). Never fabricate
   real-looking data for a business that hasn't confirmed it — leave it
   bracketed/TBD rather than guessing. That's not a style note — the previous
   seed (Tattoo Saunders) almost shipped with gaps filled in from guesswork
   before this convention was tightened.
3. **Gallery images**: drop files into `public/gallery/` and set `src` on the
   matching entry in `GALLERY_ITEMS` in `app/content.ts`. If the images are a
   real business's copyrighted work and this repo is public + a GitHub
   template, keep them off `main` (`public/gallery/` is gitignored there) and
   only commit them on `develop`/the seeded branch — `main` staying clean is
   what makes "use this template" safe for the next shop.
4. **Wire the consult form** (optional) — see "Consult form" below. Works
   with zero configuration in demo mode.
5. **Deploy.** `npm run deploy` for production — the script refuses to run
   from anything except `develop`/`main`. To test a feature branch live
   first, deploy a throwaway Vercel preview (`vercel`, no `--prod`) and
   delete it once confirmed good (`vercel remove <url> --yes`).

## Editing content

- `app/content.ts` — shop-wide bilingual copy (tagline, services, styles,
  artists, aftercare, FAQ, reviews). Every string is typed `Bi` (`{nl, en}`)
  via `app/i18n.ts` — a forgotten translation is a TypeScript error, not a
  silently-English page.
- `app/locations.ts` — the per-city facts (address, phone, email, hours,
  geo). Render missing data as a bracketed placeholder (e.g.
  `"[phone — TBD]"`), don't omit the field — a visible gap is more honest
  than silently dropping it.
- `tailwind.config.ts` — the four-token palette (`ink`, `cream`,
  `brandYellow`, `primary`). Re-theme by changing the hex values; class names
  stay the same. Keep contrast in mind — `text-cream` on `bg-brandYellow`
  fails WCAG AA, buttons must stay `bg-brandYellow text-ink`.

### Adding or removing a location

Add/remove an entry in `LOCATIONS` in `app/locations.ts`. City pages are
generated automatically from that array (`generateStaticParams` over
`LOCATIONS × locales`) — no per-city files to create by hand.

## Consult form

`components/ConsultForm.tsx` has no `app/api/**` route — a route handler that
emails has only one reachable branch without real credentials (a 503), which
makes the page non-static for no benefit. Instead:

- `NEXT_PUBLIC_FORM_ENDPOINT` unset (default): demo mode. No network request
  is made at all. The form validates client-side, then shows a simulated
  success panel with a `mailto:` link (pre-filled subject/body) the visitor
  clicks themselves — never auto-navigated.
- `NEXT_PUBLIC_FORM_ENDPOINT` set to a Formspree-style endpoint: the form
  `fetch`es it with `FormData` (carries the reference-photo upload natively).

The 18+ checkbox is a self-declaration, not an age verification — labelled as
such, never claim otherwise.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/nl`).

## Deploy

```bash
npm run deploy
```

Builds locally, deploys to Vercel production, and checks the live URL
returns 200.

## Starting a new shop from this template

1. Click **"Use this template" → "Create a new repository"** on GitHub.
2. Clone the new repo, edit `app/content.ts` + `app/locations.ts` with the
   real shop's details.
3. `npm install`
4. Set up a new Vercel project for it (`npx vercel link`).
5. `npm run deploy`

**Re-skin smoke test**: change `SHOP_NAME`, the four color tokens, and the
`LOCATIONS` array — nothing else should need editing for a different
multi-location shop to go live.
