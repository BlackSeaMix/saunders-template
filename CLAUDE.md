# Tattoo shop website template

## Project overview

A reusable starting point for bilingual (NL/EN), multi-location tattoo shop websites: real URLs under `/[locale]/`, a homepage plus a city page per location, a consult-request form (no booking calendar), and a dark editorial gallery. No database, no auth. Forked from `shop-landing-template` and reworked — the Google Calendar booking integration was stripped entirely.

This repo is a **GitHub Template repository** — use the "Use this template" button to start a new project from it with clean history, then follow `README.md` to fill in the real business's details.

- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS + framer-motion, no database/auth.
- **Run/deploy/edit instructions**: see `README.md` — this file is process and history, not a how-to.

## Branching workflow

- `main` — stable/production. Consider protecting it (GitHub branch protection rule requiring PRs) once a second person is working on the repo — not set up by default here since a template has no collaborators yet.
- `develop` — integration branch, branched from `main`. Feature work merges here first.
- `feature-<branch-name>` — one branch per piece of work, branched from `develop`. Open a PR into `develop` when ready; `develop` gets merged into `main` periodically once it's in a good state.

### Vercel deployments

Only `develop`/`main` should ever have a lasting deployment — the Vercel dashboard isn't git-integrated by default, so nothing deploys automatically; every deployment is a deliberate CLI run. For feature branches: deploy a **preview** (`vercel`, no `--prod`) to test live, delete it once confirmed good (`vercel remove <url> --yes`), then it's ready to merge into `develop`.

**Production deploys should go through `npm run deploy` (not a raw `vercel --prod`).** That script (`deploy.sh`) checks the current git branch and refuses to run unless it's exactly `develop` or `main` — this is enforced in the script itself, not just documented, after a previous project on this pattern accumulated 20+ stray production deployments from ad-hoc `vercel --prod` runs on whatever branch happened to be checked out.

## History log

> When you finish a meaningful piece of work on this project, add a new dated entry below (bottom of the list = most recent). Keep entries short: what changed, and the "why" if it's not obvious from the commit message alone. This log is what lets a new collaborator (human or Claude) pick up full context without re-deriving it from git history.

**2026-11-17** — Built out the full template and seeded it with a speculative pitch demo for
Tattoo Saunders (`tattoosaunders.nl`, five NL locations). Client has **not** been contacted —
this is a walk-in-and-close pitch, not a live project.

What changed: stripped the scaffold's Google Calendar booking (API routes, `google-auth-library`,
reCAPTCHA) in favor of a no-backend consult-request form (`NEXT_PUBLIC_FORM_ENDPOINT` switch with
a `mailto:` fallback, never a stored submission); rebuilt routing as `app/[locale]/` with the root
layout moved there so `<html lang>` can be locale-driven (`app/layout.tsx` no longer exists —
`/` redirects to `/nl` via `next.config.ts`, and root `app/not-found.tsx` carries its own `<html>`
for 404s above the locale segment); added `app/i18n.ts`'s `Bi` mapped type so a missed translation
is a compile error; split content into `app/content.ts` (shop-wide copy) and `app/locations.ts`
(per-city facts, deliberately bracketed where unconfirmed — four of five branches have no public
phone, Utrecht has no public email); generated 10 static city pages from one dynamic route
(`app/[locale]/[stad]/`, NOT `tattooshop-[stad]` — that prefix form silently isn't a legal
App Router segment); lifted `Reveal`/`ScrollProgress` from `Restaurant-templete-2` with a
`useReducedMotion` bailout fix (the library's own `bg-mustard` doesn't exist in this palette either,
fixed to `bg-brandYellow`); fixed the scaffold's two other cross-template bugs (`fontFamily.sans`
never mapped to the loaded Geist font; reviews rendering 5 filled stars regardless of
`review.rating`).

Deployed to Vercel from `develop` (`tattoo-template-git-develop-aldb.vercel.app`) — `main` stays
the clean, reusable template with `public/gallery/` gitignored; real Instagram photos were never
downloaded (kept the gallery as placeholder tiles — scraping a shop's copyrighted work into a
public template repo would redistribute it under this repo's license to every future re-skinner).

A Lighthouse pass against our own build (not just the pitch narrative) caught three real
accessibility gaps the task itself would have shipped with: no `<main>` landmark, form
inputs/selects relying on placeholder text as their only label, and a missing favicon throwing a
console error. Fixed before calling the build done — accessibility 86→100, best-practices 96→100.
Final scores vs. the real site: performance 96 vs 91, accessibility 100 vs 86, best-practices 100
vs 100, SEO 63 vs 92 (ours is low *because* `noindex` is on everywhere, by design, for a concept
that must never outrank the client's real site — not a real SEO defect).

Known gap: did not verify in a real browser whether tattoosaunders.nl's Instagram embed renders
anything today (the underlying API was retired in 2020; near-certainly stale or empty, but
unconfirmed). Geo coordinates for the five addresses and opening hours were left out/bracketed
rather than guessed — not found during the audit.
