# Plan: author footer, repository link, category counts, title counter (MY-167)

Branch `my-167-footer-counts`. Linear issue MY-167, milestone Полировка, after MY-163 (the README). It runs in
parallel with MY-168 (an error boundary around the app), which also edits `app.jsx`, `components/index.js` and the
map, so the edits to those files stay small and local, and whichever branch merges second rebases. The spec is
`ai/superpowers/specs/2026-10-19-footer-counts.md`.

## The author's answers (issue, «Решения автора», 2026-10-19)

The footer is plain text, name and year, no link. The repository link is an icon in the header, next to the theme
switch, a new tab, named by its `title`, 44px. The counts count every task of a category, like the tasks-left
counter. "All categories" has no mark and leaves no slot. The title counter shows at 20 left. The toolbar gap is
`--space-6`. What the issue left to the plan is decided below: how a screen reader learns about the counter, and
what the repository icon is.

## Decisions taken in this plan

- **The repository icon is a small component of the app's own, `GithubIcon`.** `lucide-react` 1.58 ships no GitHub
  icon (brand icons were removed; no file or alias of that name is in the package), and a dependency is not
  allowed. Options: a generic lucide icon (`Code`, `GitBranch`, `GitFork`), the filled Octicons mark as an inline
  SVG, or the old lucide drawing, a stroked mark. The generic icons do not say "GitHub" (a fork icon reads as "fork
  this"), and the filled mark is a heavier shape next to stroked icons. The old lucide drawing (ISC licence, a
  single 24px viewBox, stroke 2, round caps) is recognisable and sits with the other icons, so it is the choice; the
  `title` carries the rest. It is its own folder `github-icon` (one component per file, `react.md`), set from CSS
  like the lucide icons, and `aria-hidden`.
- **The link is `GithubLink`, not a variant of `IconButton`.** `IconButton` is a button named by its `title`; a link
  is another element and another contract (`href`, a new tab). `GithubLink` repeats the 15 lines of the button's look
  (44px, muted, text colour on hover) rather than making `IconButton` render two elements; if a second icon link
  ever appears, the two merge then.
- **The header gets one `app-header-actions` pair, the switch and the link,** pushed to the right as one block
  (`margin-inline-start: auto` moves from `ThemeSwitch` to the pair: placing a component is the container's job).
  Without the pair the link, the last item, would wrap alone to the left of a second line. At 320px the title,
  the switch and the link need about 316px of the 288px there are (the switch alone is 150px of 44px targets, and
  the targets stay 44px), so the pair wraps to a second line at the right. The alternatives, hiding the logo or
  shrinking the targets, lose more than a line costs; from a 350px window it is one line (measured). The pair
  wraps inside itself too (`flex-wrap`, `min-width: 0`, right-aligned), so with 150 to 200% text the link drops
  under the switch instead of squeezing it, and the switch keeps the width it had alone.
- **The footer is pinned to the window's bottom** with `#root` as a flex column of the window's height and
  `margin-top: auto` on the footer. Without it the footer floats under a short list on a tall window. The header
  gets `width: 100%`, and so does the error screen, because a flex item with auto side margins would otherwise
  shrink to its content (the error screen measured 442px instead of its 672px maximum). The footer is not on the
  error screen: the boundary replaces the whole tree, header included. This puts `#root` in `base.css`, the one
  place that styles it. The toast clearance on `.app` is left as it is: the footer
  adds space below the last control and the fixed toast may cover the footer text for its five seconds, which is
  no control.
- **The year is read in render** (`new Date().getFullYear()`), the page's own current year; a tab open over New
  Year's Eve shows the old year until reload. If the purity lint rule rejects it, a module-level constant takes
  its place.
- **The counts are in the option label** (`Work (3)`), built by a pure util from the tasks, so `PillSelect` needs no
  new prop and the width sizer, which stacks every label, already measures the numbers.
- **The counter's announcement is by threshold, derived from the length.** The text of the status region is a pure
  function of the length: empty above 20 left, one fixed sentence from 20 to 1 left, one at the limit. React writes
  the text only when it differs, so the region speaks when the range changes and is silent between keystrokes, with
  no timer, no state and no effect. The exact number is the field's description, read on focus. Rejected: a status
  with the number (it speaks on every keystroke), a debounced "N characters left" (a timer for a field that cannot
  exceed its limit), `aria-live` on the visible counter (the same spam).
- **The counter is always in the DOM, empty until 20 left,** so the field's `aria-describedby` always points to an
  element that exists and the status region exists before its text changes. `:empty` hides it.
- **A mark is optional in `PillSelect`.** `renderMark` returning `false` renders no mark span in the option, and the
  closed pill's indicator is then empty, which its stylesheet reads (`:empty`) to take the smaller left padding. No
  new prop and no data attribute. The width sizer follows: its labels start 16px in and a marked one adds the 24px
  of the mark slot (`is-marked`), so the pill hugs its widest label with or without a mark ("All categories (N)" is
  24px narrower than it would be) and the pills that mark every option keep their width.

## Code

- `src/constants/app.constants.js` (new, barrel line) — `AUTHOR_NAME`, `REPOSITORY_URL`, `REPOSITORY_LINK_LABEL`.
- `src/constants/todos.constants.js` (barrel line) — `TITLE_COUNTER_THRESHOLD` (20).
- `src/utils/filters.utils.js` (barrel) — `getCategoryFilterOptions(todos)`: `CATEGORY_FILTERS` with the count in
  each label, on a private `countTodosInCategory` that reuses the existing `matchesCategory`.
- `src/utils/todos.utils.js` (barrel) — `getTitleCounterText(length)` and `getTitleCounterMessage(length)`.
- `src/hooks/use-filters-toolbar.js` — reads `todos` through `useTodos()` and returns `categoryOptions`.
- `src/components/filters-toolbar/` — passes `categoryOptions` to the Category pill; the toolbar gap is
  `--space-6`.
- `src/components/pill-select/` — no mark span in an option without a mark, a smaller left padding for the closed
  pill without a mark, and the sizer padded to match, so the pill is as wide as its widest option.
- `src/components/title-counter/` (new) — `TitleCounter({ id, length })`: the visible counter and the status region.
- `src/components/todo-form/`, `src/components/todo-edit-form/` — render it under the title input, set the input's
  `aria-describedby`; the edit form wraps label, input and counter in a field block like the add form's.
- `src/components/app-footer/`, `src/components/github-link/`, `src/components/github-icon/` (new) — as above;
  `src/components/app-header/` gains the pair; `theme-switch.css` loses its auto margin; `app.jsx` renders
  `AppFooter` after `<main>`; `src/styles/base.css` gets the `#root` rule and loses `min-height` on `body`.
- `src/components/index.js` — the four new names.

## Docs

- `ai/decisions/2026-10-19-footer-and-repository-link.md` (new): the footer is plain text, the repository link an
  icon in the header, and why the icon is the app's own. `ai/decisions/2026-10-19-category-counts.md` (new): the
  counts ignore the status and the search. Both in the index.
- `ai/map.md` — the new components, the new constants file and the changed descriptions, cut elsewhere: it is at 149
  lines and 11.9 KB, and the limit is 150 and 12 KB.
- `ai/rules/style.md` — icons come from `lucide-react` except a brand mark it lacks; `ai/rules/react.md` — the
  title counter's region is a second polite region by the same rule as the tasks-left counter.
- `ai/skills/feature.md` — the picker recipe (an optional mark) and the filter recipe (the counts).
- `README.md` — the four components in Project Structure and the header line.

## Out of scope

The forms' pills with counts, a link in the footer, counts that follow the filters, a warning colour at the limit,
a debounced count announcement, `forced-colors`.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 90 kB; `main` is 84.57 kB, CSS
  3.6 kB of 8): report the sizes.
- In `pnpm dev` (port 5186), headless Chrome over the DevTools protocol, in both themes, desktop and 320px:
  the footer text and the current year, centred, muted, at the window's bottom with an empty list and after the
  content with a long one; the repository link in the accessibility tree (name from the `title`, no description),
  the new tab, 44px, the focus ring, the header on one line at 375px and the pair on a second at 320px; the
  counts after an add, a delete, Undo, an edit of a category and an import, with the status and the search set;
  each option's accessible name with its count; the pill's width with 8, 12 and more tasks and under 480px; no mark
  slot on "All categories" in the closed pill and the open list; the counter at 179, 180, 199 and 200 characters and
  after a paste of 300 in both forms, its contrast, the live-region log (a MutationObserver on the status regions)
  showing one message on crossing in and one at the limit and none per keystroke; the gap between the search field
  and the pills equals the other block gaps; keyboard only and a tap in touch emulation; reduced motion; the
  console. Screenshots go to `scratchpad\my167\`.
- Then `ai/rules/definition-of-done.md` and the `review` skill over the diff.
