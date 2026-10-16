# Accessibility and SEO: WCAG 2.2 AA, Lighthouse 100

Date: 2026-10-16 · Status: accepted

## Context

The author wants accessibility at the highest level, and the same care for search engines and
link previews. Checking it only at the end misses problems that are cheap to fix while a component
is built; checking it only per task misses how the parts work together.

## Decision

- Target: WCAG 2.2 AA; Lighthouse Accessibility, Best Practices and SEO at 100; zero axe
  violations; in both themes.
- Three layers of checks:
  - every task passes the accessibility part of `ai/rules/definition-of-done.md`;
  - `eslint-plugin-jsx-a11y` in the lint config catches mistakes at commit time;
  - one audit once every feature exists, export and import included: keyboard only, NVDA,
    200% and 400% zoom, 320px, Windows contrast themes, Lighthouse, axe.
- SEO: description, canonical, Open Graph and Twitter tags, a preview image, a favicon,
  `robots.txt`, `llms.txt` and a real 404.

## Consequences

- Accessibility is part of every task's gate, not a final polish step; audit findings become
  issues.
- Rejected: automated accessibility tests and Lighthouse CI (decision `no-automated-tests`).
