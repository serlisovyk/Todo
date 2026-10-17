# Definition of Done

A change is done when all of the following hold. Use it as the gate before handing a change over
for approval.

## Code

- New code follows `ai/rules/architecture.md`, `ai/rules/react.md` and `ai/rules/style.md`: the
  layer that owns it, named exports, kebab-case files, cross-folder imports through `@/`.
- Components never touch storage; every `localStorage` and `indexedDB` access is in `storage/`
  (the theme script in `<head>` is the one documented exception).
- Every read of stored data tolerates failure — blocked or full storage, broken JSON, an unknown
  version — and the app still starts; nothing is written at start.
- Shared values come from `constants/`; colours, spacing, radii, font sizes and durations from
  the tokens.
- No comments, no inline styles, no app state on `window`.
- Stale code, styles and constants left behind by the change are removed.
- Nothing from `ai/rules/scope.md` or `ai/decisions/2026-10-16-rejected-features.md` slipped in.

## Accessibility

- Controls are real elements (`<button>`, `<input>`, `<select>`, `<form>`) with an accessible name;
  an icon-only button is named by its `title`, a control named by a label has the `title` on the
  label, and no name is read twice (decision `tooltips-as-title`).
- Everything works from the keyboard, the focus ring is visible, and after adding, editing,
  deleting or closing a panel the focus lands somewhere meaningful.
- Text contrast is at least 4.5:1, icons and control borders at least 3:1, in **both** themes.
- A change a screen-reader user must hear is announced through the polite live region.
- New animation takes its duration from a `--duration-*` token, which reduced motion zeroes; a script
  that waits for a transition or starts a View Transition checks the query itself.
- Touch targets are at least 44px; the layout works from 320px wide to desktop and at 200% zoom with
  no horizontal scroll.

## Docs (in the same change, within `ai/rules/docs.md`)

- `README.md`: a short line, only if what a user sees, the scripts or the structure changed.
- `ai/map.md`: only if a file, folder, storage key or script was added, renamed or removed.
- `ai/rules/*` or `ai/skills/*`: only if the change reshaped a pattern.
- `ai/decisions/`: a new dated record if the change meets the criteria in its `README.md`.
- No doc went over its limit; one that did was trimmed in this change.

## Verification

- Every check listed under "Verification" in `AGENTS.md` passes.
- A change to code or UI was used in the browser — desktop with keyboard and mouse, 320px wide,
  both themes, and a reload for anything stored — not just built.
- Reported: what changed, which commands were run, whether they passed, and anything that could
  not be verified. Never claim the project builds or lints unless the command was run and passed.
- No automated test suite exists — do not add one unless explicitly asked, and do not report its
  absence as a gap.
