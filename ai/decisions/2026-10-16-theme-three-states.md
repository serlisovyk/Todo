# Theme: light, dark or system, set before the first paint

Date: 2026-10-16 · Status: accepted (not implemented)

## Context

A two-state switch (light and dark, following the system only until the first choice) was
considered. The author wanted "system" as a third choice that can be picked again at any time.

## Decision

- Three icon radio buttons in the header — Sun, Moon, Monitor. The choice is saved under
  `todo:theme` as `light`, `dark` or `system`; no value means `system`, which follows the OS live
  (`matchMedia` change).
- `<html data-theme>` is always set. A plain script in `<head>` reads the saved choice and sets it
  before the first paint: the one direct storage read outside `storage/`. Its key and values are
  literals that must match the constants.
- `theme-color` and `color-scheme` follow the theme. The switch reveals the new theme as a circle
  from the button (a View Transition), skipped under reduced motion or without the API.

## Consequences

- ESLint allows the storage read in the head script only.
- Rejected: a two-state toggle, a `prefers-color-scheme` block in CSS.
