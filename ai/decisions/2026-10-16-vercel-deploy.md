# Deployed on Vercel through its Git integration

Date: 2026-10-16 · Status: accepted (not implemented)

## Context

The app is a static site: `pnpm build` produces `dist/` with no server code. It needs a public demo
link for the portfolio and the GitHub About section.

## Decision

- Host on Vercel through its Git integration: `main` is production, other pushed branches get
  preview deployments.
- The build is pinned in `vercel.json` (`pnpm build`, output `dist/`); a missing path answers 404.
- The author connects the Vercel project from the author's own account; agents prepare the config
  and the steps.

## Consequences

- Once connected, every push to `main` ships to production — `main` must always build and work.
- Changes that can affect the build are checked on a branch preview before merging.
