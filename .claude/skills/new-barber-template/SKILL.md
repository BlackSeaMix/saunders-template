---
name: new-barber-template
description: Interactively generate a new, uniquely-styled barbershop website template repo in the BlackSeaMix GitHub org, based on the shop-landing-template scaffold (Next.js + Tailwind, Google Calendar booking via service account, branch-guarded deploys). Use when the user asks for a new barber template, a new barbershop design, or wants another website template variant for barbers.
---

# New Barber Template

Generates a new GitHub **template repository** for a barbershop website, with a
fresh color design each time, by starting from the already-built
`BlackSeaMix/shop-landing-template` base (Next.js + TypeScript + Tailwind,
Google Calendar booking integration, branch-guarded `deploy.sh`,
`npm run test:calendar` verification script) and layering on barber-specific
content + a chosen visual design.

Each run of this skill should feel like a short design consult, not a form —
ask one thing at a time, don't dump all the questions in one wall of text.

## Step 1 — Ask for a repo name

Ask what to call the new repo. Suggest a pattern like `barber-template-<style>`
(e.g. `barber-template-classic-gold`) if they don't have a preference.

## Step 2 — Ask for a design direction

Offer these concrete presets (use `AskUserQuestion` with a preview if the
client supports it) rather than an open-ended "what colors do you want" —
concrete options get a faster, more decisive answer than a blank slate:

1. **Classic Black & Gold** — traditional barbershop feel.
   `ink: #121212`, `cream: #F5F0E6`, `brandYellow: #C9A227`, `primary: #2A2A2A`
2. **Modern Monochrome** — minimalist, one sharp red accent.
   `ink: #181818`, `cream: #F4F4F4`, `brandYellow: #E53935`, `primary: #2E2E2E`
3. **Vintage Barber Pole** — red/white/navy, old-school.
   `ink: #1B2A4A`, `cream: #FBF8F3`, `brandYellow: #B5262B`, `primary: #E8E2D6`
4. **Custom** — ask them to describe the vibe/colors, then pick hex values
   yourself the same way (concrete, named colors — don't leave it vague).

Note: the Tailwind color token is still literally named `brandYellow` in
`tailwind.config.ts` regardless of preset (it's just the accent-color slot) —
simplest to leave the token name as-is and only change its hex value, since
`page.tsx` references `bg-brandYellow`/`text-brandYellow` throughout. Only
rename the token (requires find-replacing it across `page.tsx` too) if the
user specifically asks for cleaner naming.

## Step 3 — Generate the repo from the template

```bash
gh repo create BlackSeaMix/<name> --public --template BlackSeaMix/shop-landing-template
git clone https://github.com/BlackSeaMix/<name>.git /home/almar/projects/<name>
cd /home/almar/projects/<name>
npm install
```

Clone to a fresh sibling directory under `/home/almar/projects/` — not nested
inside any other project.

## Step 4 — Apply the chosen palette

Edit `tailwind.config.ts`'s `theme.extend.colors` block with the four hex
values from Step 2.

## Step 5 — Seed barber-specific content in `app/content.ts`

Keep everything as bracketed placeholders (never invent a real-looking
address/phone/price for a business that doesn't exist yet — this convention
exists because an earlier real client project nearly shipped fabricated
contact details). Suggested `SERVICE_CATEGORIES` structure — realistic
barbershop categories, placeholder names fine, prices always `"TBD"`:

```ts
{
  category: "Haircuts",
  items: [
    { name: "Classic Haircut", price: "TBD" },
    { name: "Skin Fade", price: "TBD" },
    { name: "Kids Haircut (12 & under)", price: "TBD" },
  ],
},
{
  category: "Beard & Shave",
  items: [
    { name: "Beard Trim", price: "TBD" },
    { name: "Hot Towel Shave", price: "TBD" },
    { name: "Beard Line-Up", price: "TBD" },
  ],
},
{
  category: "Combos",
  items: [
    { name: "Haircut + Beard Trim", price: "TBD" },
    { name: "Full Service (Cut, Beard, Shave)", price: "TBD" },
  ],
},
```

Also update `SHOP_NAME`, `TAGLINE`, `HERO_DESCRIPTION` to barbershop-flavored
placeholder copy (e.g. `TAGLINE = "[Classic cuts, modern style.]"`).

## Step 6 — Build and verify before shipping

```bash
npm run build
```

Then start it (`npm run start -- -p <some-free-port>`) and take a headless
screenshot (`chromium --headless --disable-gpu --no-sandbox --screenshot=...`)
to confirm: no broken images, form fields are legible against the new palette
(check contrast specifically — this has broken before when a new color
scheme was applied without checking input/select field contrast), the new
accent color actually shows up. Stop the server afterward.

## Step 7 — Mark as a template repo, commit, push

```bash
git add -A
git commit -m "Apply <design name> palette and seed barber-specific content"
git push
gh api repos/BlackSeaMix/<name> --method PATCH -f is_template=true
```

## Step 8 — Report back

Give the user the repo URL and confirm `is_template` is `true`
(`gh repo view BlackSeaMix/<name> --json isTemplate`). Mention the screenshot
result so they know it was actually checked, not just assumed to work.
