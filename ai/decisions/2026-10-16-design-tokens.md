# Design tokens: semantic names, two borders, category and priority shades per theme

Date: 2026-10-16 · Status: accepted

## Context

The palette fixed four values per theme (page, surface, text, accent). The rest had to be chosen so
that every pair a component will use reaches WCAG AA in both themes: text 4.5:1, borders of
controls and meaningful icons 3:1. A mockup's muted grey reached only 4.47:1 on the hover surface,
and its light border (1.3:1) could not outline a field.

## Decision

- Tokens are semantic, by role: `--color-page`, `--color-surface`, `--color-surface-hover`,
  `--color-text`, `--color-text-muted`, `--color-accent`, `--color-on-accent`, `--color-focus`,
  `--color-highlight`, `--color-on-highlight`, `--color-category-*`, `--color-priority-*`. A
  component never names a raw colour.
- Two borders: `--color-border` for decorative dividers, `--color-border-control` (3:1 or more)
  for anything that outlines an input or a checkbox.
- Muted text is `#65656f` in the light theme, so it passes on the hover surface too.
- Category and priority colours take a darker shade in the light theme and a lighter one in the
  dark theme, each at least 3:1 on page and surface. The categories are blue (Work), pink
  (Personal), violet (Study), orange (Shopping), green (Health); priorities are red, amber and the
  muted grey — no category shares a hue with a priority.
- Scales: spacing in 4px steps, four radii, five font sizes, two weights, three durations.

## Consequences

- A new colour is a token with a light and a dark value and a contrast check in both themes.
- Rejected: one border token for everything; the mockup's amber Study and violet Health.
