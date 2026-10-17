# Plan: styling the open list of the pill selects (MY-164)

Branch `my-164-select-picker`. Linear issue MY-164, milestone Визуал, after MY-151 (`PillSelect`), MY-153
(the edit form that reuses it) and MY-157 (the theme), all merged. The spec is
`ai/superpowers/specs/2026-10-17-select-picker.md`. The filter panel will reuse `PillSelect` later and
get the same list without extra work.

## The author's answers (issue, «Решения автора», 2026-10-17)

All questions are answered, so the work goes from this commit to the code:

- The list is styled with `appearance: base-select`; a browser without it keeps the system list.
- No custom JavaScript listbox: the native `<select>` stays (decision `native-selects`).
- A separate task in «Визуал».
- The dots and flags in the options are markup inside `<option>` (a dot with `data-category`, a `Flag`
  with `data-priority`, as in the pill) if React 19 renders it without warnings; otherwise a data
  attribute on `<option>` and `::before`. **Checked: React 19.2.8 renders a `<span>` and an `<svg>`
  inside `<option>` with no console output in development (StrictMode, headless Chrome 155), and the
  DOM keeps them. The choice is markup.**

## Browser support

Sources, read on 2026-10-17: the MDN `browser-compat-data` JSON on `main`
(`css/properties/appearance.json`, `css/selectors/picker.json`, `checkmark.json`, `picker-icon.json`,
`html/elements/selectedcontent.json`), the Chrome post "The select element can now be customized with
CSS" (2025-03-24) and the WebKit post "WebKit Features for Safari 27.0" (2026-09-17).

| Browser | `appearance: base-select` | `::picker(select)` | `::checkmark` | `selectedcontent` |
| ------- | ------------------------- | ------------------ | ------------- | ----------------- |
| Chrome  | 135                       | 135                | 133           | 135               |
| Edge    | 135 (Chromium)            | 135                | 133           | 135               |
| Safari  | 27                        | 27                 | 27            | 27                |
| Firefox | 149 behind two prefs only | no                 | no            | no                |

- Firefox 149 and later parse `base-select` only with `dom.select.customizable_select.enabled` and
  `layout.css.appearance-base.enabled` set to `true`; by default it is off, so `@supports` is false and
  the system list stays. Firefox has neither `::picker(select)` nor `::checkmark`.
- Safari 27: the WebKit post describes customizable select; I could not confirm the date Safari 27
  left beta from the pages I could reach, so it is listed as 27 and not as "shipped on a date".
- Tested here: headless Chrome 155.0.8059.84 supports all of it and renders the open list in a
  screenshot. No Chrome flag turns it off (`--disable-features` and `--disable-blink-features` with the
  feature name changed nothing), so the unsupported case is checked by rewriting the stylesheet's
  `@supports` condition to an unknown value through DevTools request interception: the page then
  behaves exactly like a browser that does not know `base-select`. Firefox and Edge are not installed
  here; Edge shares Chromium's data.

## Deliberate choices

- **One progressive enhancement block.** The base rules of `pill-select.css` stay as they are; one
  `@supports (appearance: base-select)` block at the end holds everything new. Without support none of
  it applies, and the marks and the sizer below stay `display: none` so a browser that renders
  `<option>` children (Firefox might) shows text only.
- **`PillSelect` takes `renderMark(id)` instead of `children`.** The caller knows how a category dot
  or a priority flag is drawn; the select knows where it goes. It calls `renderMark(value)` for the
  closed pill's indicator, as before, and `renderMark(id)` for each option, wrapped in
  `.pill-select-mark`. One function replaces the duplicated indicator markup, and the four call
  sites (`TodoForm`, `TodoEditForm`) pass the same element as before. The issue lists only
  `components/pill-select/` as touched; the marks need data only the callers hold, so the two forms
  change by those four call sites and nothing else. A render function is not an `on<Action>` callback,
  so `react.md` gets a clause for a `render<Thing>` prop that draws one item.
- **The closed pill is the system's text, not the option's markup.** Checked in Chrome 155: with
  `base-select` and no author button the closed select shows the selected option's plain text, so the
  mark inside the option is not drawn a second time next to the indicator.
- **Centred items and a hidden sizer keep the closed pill as it is.** `base-select` turns the select
  into an inline flex box whose button is stretched to the top (the text sits 1px higher) and sizes it
  by the selected option, so the pill would change width with every choice. `align-items: center`
  restores the text position (pixel-identical at 320px in both themes, hover and focus included).
  `.pill-select-sizer` is a visually hidden, `aria-hidden` stack of every label inside the
  `<label>`, with the select's horizontal padding and border, so the pill keeps the width of its widest
  option. It is still 0.94px narrower than the system select on desktop (Shopping, 154.06px against
  155px): the system rounds the text width up to a whole pixel and CSS cannot. A pill that hugs its
  value was rejected: the neighbouring pill and the button would jump on every choice.
- **The list is a card of tokens.** `--color-surface`, a `--color-border` border (the list is a
  container like `.todo-form`, not a control outline, and its options carry text), `--radius-md`, a
  `--space-1` padding with `--radius-sm` options (concentric corners), `margin-block: --space-1` from
  the pill, and a shadow `0 --space-2 --space-6 --color-shadow`. `--color-shadow` is a new colour token
  with a light and a dark value (`rgb(24 24 27 / 0.16)`, `rgb(0 0 0 / 0.5)`); a shadow has no contrast
  to check. The list sets `color: var(--color-text)`: left alone, the browser gives its options plain
  black or white (read from the computed style), which is off the token.
- **Options.** `--touch-target` high, a flex row with `--space-3` gap, the mark first and the label
  after it, `::checkmark` pushed to the end in `--color-accent`. The option that has the focus gets
  `--color-surface-hover`; the hover fill is under `@media (hover: hover)`. Opened with the mouse, the
  chosen row has the focus, so it is filled with the check mark, and a hovered row is filled too. The
  keyboard highlight also keeps the global `:focus-visible` ring, which fits inside the list's padding.
  Contrast, light and
  dark: option text on the surface 17.7 and 15.2, on the hover surface 15.0 and 13.5; the check mark
  and the ring on the surface 5.4 and 6.1, on the hover surface 4.6 and 5.4; every dot and flag at
  least 3.9 on the hover surface.
- **Entry animation.** `transition: opacity var(--duration-base) var(--ease-out)` on the list and
  `@starting-style { opacity: 0 }`; `@media (prefers-reduced-motion: reduce)` sets `transition: none`.
  No exit animation and no `allow-discrete`: closing is instant, as for a native list. Sampled in
  Chrome: 0 to 1 over about 200ms; with reduced motion 1 from the first frame.
- **Position is the browser's.** The list opens on the side with more room, so it is on screen at 320px
  and in a short window; where neither side has room for five rows (a window 400px high) the browser
  caps the list at the room it has and scrolls inside it. `position-try-order: normal` (below the pill
  whenever it fits) was tried and rejected: in a window 300px high the list ran off the screen.
- **Forced colours.** Checked with the emulation: the list keeps the system colours, the keyboard
  option has the ring and the selected one the check mark. The mouse hover has no fill in that mode and
  the dot, a background, is not drawn, as in the closed pill today (the label says the same). Nothing
  added.

## Code

- `src/styles/tokens.css` — `--color-shadow` in both themes.
- `src/components/pill-select/pill-select.jsx` — `renderMark` replaces `children`; each option holds
  `.pill-select-mark` and the label; the `.pill-select-sizer` after the chevron.
- `src/components/pill-select/pill-select.css` — the two hidden rules and the `@supports` block.
- `src/components/todo-form/todo-form.jsx`, `src/components/todo-edit-form/todo-edit-form.jsx` — the
  four `PillSelect` calls pass `renderMark`. The edit form's `.pill-select` selector is unchanged: no
  class is renamed.

## Commits

1. spec and plan (this commit);
2. the shadow colour token;
3. `PillSelect` draws a mark in each option, hidden for now (`renderMark`);
4. the styled open list: the `@supports` block and the sizer;
5. docs: the new decision (it supersedes `native-selects`), the map, the rules, the feature skill.

## Docs

- `ai/decisions/` — a new record `base-select-pickers` that restates `native-selects` and adds the
  enhancement; `native-selects` goes to `superseded by`; the index gets the new line.
- `ai/map.md` — the `pill-select` line.
- `ai/rules/style.md` — one bullet: a newer CSS feature is an enhancement inside `@supports`, with the
  base rules as the fallback.
- `ai/rules/react.md` — the props bullet admits a `render<Thing>` prop that draws one item.
- `ai/skills/feature.md` — a recipe line for a picker.
- `README.md` — unchanged: it has no features list.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 90 kB; `main` is at
  79.43 kB gzip, CSS 2.7 kB, font 48.26 kB). The markup adds a few dozen bytes of JavaScript; the
  number is reported.
- In `pnpm dev` on port 5188, through headless Chrome over the DevTools protocol:
  - the open list of both selects of the add form and of the edit form, in both themes, at 1000px and
    320px, with the keyboard highlight and with the mouse; screenshots in the scratchpad;
  - keyboard: Space opens, arrows, Home, End, type-ahead, Enter picks, Esc closes and keeps the value;
    mouse: click, then click an option; touch emulation: a tap opens, a tap on an option picks; the chosen category and priority reach the task, through the
    add form and through the edit form, and survive a reload;
  - the accessibility tree: option names are the labels only; no console output;
  - the list fully on screen at 320px, in a short window and below a long page; entry animation
    sampled, and absent with reduced motion; forced colours;
  - the closed pill, byte for byte against `main` in the unsupported emulation (default, hover,
    focus) and pixel for pixel at 320px with the enhancement, both themes; the desktop width within
    1px as above;
  - the unsupported case: the marks and the sizer have `display: none`, the control's `appearance` is
    `none`, the closed pill is identical to `main`'s.
- The Definition of Done point by point, then the `review` skill over the diff.
