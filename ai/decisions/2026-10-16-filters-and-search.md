# Filters in a panel and in the URL; search highlights matches

Date: 2026-10-16 · Status: accepted (not implemented)

## Context

A row of six category chips under the toolbar read like a legend and crowded the screen. Filter
state could live in component state, in storage or in the URL.

## Decision

- Status (All, Active, Completed) is a radio group on screen.
- Category and sort (Newest first, Oldest first, Priority) live in a "Filters" disclosure panel
  that opens under the toolbar and pushes the list down (`aria-expanded`), not a popover. A dot on
  the button shows a non-default choice; the panel has "Reset filters".
- Status, query, category and sort are the URL query (`URLSearchParams` + `replaceState`): defaults
  are not written, unknown values are ignored, no router.
- Search is case-insensitive on the title; matches are wrapped in `<mark>` without
  `dangerouslySetInnerHTML`.
- `/` focuses the search (not while typing), `Escape` clears it. The placeholder shows the `/` hint,
  so the shortcut is discoverable without a help screen.

## Consequences

- A new filter follows the `feature` skill.
- Rejected: category chips on screen, a popover or a modal for filters, filters in localStorage.
