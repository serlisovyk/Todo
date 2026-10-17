# `lucide-react` icons, self-hosted Inter, an own toast

Date: 2026-10-16 · Status: accepted

## Context

The interface needs icons (edit, delete, theme, search, filters), a typeface and a toast with
Undo. Considered: hand-written inline SVG or an icon library, a font CDN or self-hosting, a toast
library or a small toast of our own.

## Decision

- Icons: `lucide-react` — one consistent outline set, imported one by one, so only the icons in use
  reach the bundle.
- Typeface: Inter, self-hosted `woff2`, Latin only, weights 400 and 500, tabular digits for counters.
- Toast: an own context, hook and component, no library. One toast at a time, `role="status"`,
  gone after 5 seconds, paused while hovered or focused.

## Consequences

- Another icon set, a toast library or a font CDN reverses this record.
- A third weight, italics or another face needs a new record.
- Rejected: `sonner` and other toast libraries, an icon font, a font CDN.
