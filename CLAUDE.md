# Shop landing page template

## Project overview

A reusable starting point for small local-business websites (salons, barbershops, similar single-location shops): a one-page Next.js site with real content management, a photo gallery, and a booking form that writes directly to Google Calendar. No database, no auth.

This repo is a **GitHub Template repository** — use the "Use this template" button to start a new project from it with clean history, then follow `README.md` to fill in the real business's details.

- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS, no database/auth.
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

(No entries yet — this is a fresh instance of the template.)
