# The `/` shortcut stays a single-key shortcut that cannot be turned off

Date: 2026-10-17 · Status: accepted

## Context

`filters-and-search` gives the search the `/` key. WCAG 2.1.4 (Character Key Shortcuts, level A)
wants a shortcut made of one character to be switchable off, remappable, or active only while its
control has focus; `/` is none of these, and `accessibility-and-seo` aims at WCAG 2.2 AA. An audit
will flag it, and a later agent fixing the audit would likely add a setting or drop the key.

## Decision

- `/` stays as it is: one character, always active, with no way to turn it off. The author accepts
  this as a conscious deviation from 2.1.4.
- It is accepted because the key never fires inside an editable field (the fields the undo shortcut
  skips) or with Ctrl, Cmd or Alt held, and its only effect is moving the focus to the search field:
  nothing is changed or activated.

## Consequences

- The audit lists the deviation as known and decided, not as a finding to fix.
- No other single-character shortcut is added (`rejected-features`).
- Rejected: a setting that turns the shortcut off, since one key does not justify a settings screen;
  a modifier key, since one key with its hint in the placeholder is the point of
  `filters-and-search`; dropping the shortcut.
