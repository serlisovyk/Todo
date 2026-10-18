# Plan: motion of the list, CSS only (MY-158)

Branch `my-158-list-animations`. Linear issue MY-158, milestone Визуал, after MY-153 (delete and Undo), MY-154
(the footer) and MY-156 (the Filters panel), all done. The spec is `ai/superpowers/specs/2026-10-18-list-animations.md`.

## The author's answers (issue, «Решения автора», 2026-10-16, 2026-10-17 and «Учесть»; then the delegation)

- Animations are a progressive enhancement: without the API and under reduced motion everything is instant.
  Typing in the search does not animate. A new task enters with `@starting-style`, no script.
- Durations are short and come only from tokens; reduced motion zeroes them in `tokens.css`.
- «Учесть»: a root View Transition swallows clicks in Chrome; try a View Transition scoped to the list, measure
  the loss either way and refine `list-animations` with a new record if needed.
- Delegated, final: input must never be lost. Clicks are frequent in a list and a swallowed click is a bug, so the
  list uses no View Transition at all: CSS only, a new task through `@starting-style` and a checked task through
  transitions. The reorder, the delete, Undo, Mark all, Clear completed and the filter changes are instant, and
  the Undo toast and the live regions are their feedback.

## What was measured (headless Chrome 155, a prototype of the View Transition version)

- A document View Transition swallows every mouse and touch click on the page while it runs; the pointer events
  land on `html` and `pointer-events: none` on the pseudo-elements does not help. With 200 ms animations the
  transition lasts 213 to 245 ms and clicks are lost for about 215 to 225 ms after the action (a row, a status
  radio, the footer and the search all behaved the same); with 120 ms the window is about 140 ms, never zero.
- Four real clicks on four checkboxes registered 1 of 4 with 0 to 40 ms between them, 2 of 4 with 100 to 200 ms and
  4 of 4 from 250 ms. Taps are lost up to about 150 ms after the action and are mixed around 200 ms. The keyboard
  is never blocked.
- A transition scoped to the list (`element.startViewTransition`, available in this Chrome) keeps the rest of the
  page clickable but still swallows the list's own box, which is where the clicks are. It fails Chrome's layout
  check (`InvalidStateError: Prepaint layout check failed`) on a large share of mouse deletes (6 of 10, 9 of 12
  and 7 of 10 runs; keyboard deletes passed 10 of 10), so the row just vanishes, and it cannot animate when the list
  becomes the "No tasks" text (8 of 8 failed).
- A change run through a View Transition applies a frame after its click, which a click-heavy list should not pay.
- A row that React moves in the DOM (a check sends it down) is re-inserted, and the browser starts no CSS
  transition for a re-inserted element. `@starting-style` does apply to it, but nothing in the row's own state says
  "this one was just toggled": focus is not set yet at its first style pass (a gate on `:focus` and one on
  `:focus-within` both failed), and without a gate every checked row would fade in on a load or a search.

## Code

Layers follow `architecture.md`.

- `src/context/todos/todos.provider.jsx`, `src/hooks/use-filters.js`: `updateTodo`, `removeTodos` and `markAll` set
  the list with `setTodos((current) => …)` and `changeFilters` merges its patch into the filters of the current URL.
  An action applies to the latest state, not to the one of its own render, so quick actions never undo each other.
  This stands on its own and changes nothing the user sees.
- `src/components/todo-item/todo-item.css`:
  - a row enters with `@starting-style` (opacity and a short slide over `--duration-base`), only while the add
    form's title field has focus (`:root:has(.todo-form-title:focus)`), which is where the focus stays after adding
    a task; the rows a search brings back on a keystroke and the ones of the first load do not fade;
  - checking a task is a transition over `--duration-base` and `--ease-out`: the checkbox's `background-color` and
    border, the check mark's `opacity` and `scale` (it hid with `visibility`, which cannot fade), the title's
    `color` and `text-decoration-color` (the strike-through fades in; it starts transparent only under
    `@media (forced-colors: none)`, since forced colors turn a transparent decoration into a system colour and
    would strike every title);
  - a row that is toggling (`[data-toggling='true']`) has a `@starting-style` for the box, the check mark and the
    title with the look of the state it came from: a checked row starts unchecked and an unchecked one starts
    checked. So the row animates whether React moves its element (a check sends it down) or its neighbours
    (an uncheck), because the attribute is on the element from its first style pass.
- `src/hooks/use-todo-item.js`, `src/components/todo-item/todo-item.jsx`: `isToggling` is a small state that
  `handleToggle` sets and clears on the next animation frame; `TodoItem` renders it as `data-toggling` on the
  `<li>`. One frame is all the starting style needs: it is read at the first style pass after the commit, and a
  running transition does not depend on it afterwards. Clearing on `transitionend` was considered and left: it
  needs a handler, never fires under reduced motion or when a transition is cancelled, and a stale attribute could
  make a later re-insertion replay the check. The frame clears it in every case, so a search, a load or the next
  toggle never meets a stale one.
- Nothing else: no keyframes, no constant, and `animations.css` keeps only the theme's rule. Reduced motion needs
  no rule of its own: the tokens are zero, so the starting style changes nothing.

## Deliberate choices

- **No View Transition for the list**, document or scoped; the numbers above are the reason, and a new record says
  so. The theme switch keeps its document View Transition (the circle reveal): a theme change is rare and the loss
  of a click in that half second is accepted.
- **If a reorder animation is wanted later, FLIP through the Web Animations API:** it moves the rows without
  taking the page's input.
- **The enter style depends on the focused add form,** the one CSS-only sign of "a task was added": the other ways
  a row appears (search, load, filter, Undo, import) must not fade.
- **The toggling attribute is the one script-side sign of "this row was just toggled".** It is state in the row's
  hook, rendered through JSX, and it lives for one frame. Mark all does not set it, so a row that Mark all moves
  (rare: the order usually stays) changes at once, and a row that keeps its place animates.

## Docs

- Decisions: a new record `list-motion-without-view-transitions` restates `list-animations` (what stays: a new task
  through `@starting-style`, reduced motion through the tokens, keyframes in `animations.css`, no library) and
  replaces the View Transitions with CSS motion; `list-animations` becomes `superseded by` it; the index follows.
- `ai/skills/feature.md`: the animation recipe. `ai/skills/review.md`: a burst of fast clicks. The map needs no new
  line: no file or folder is added.
- `README.md` has no feature list; nothing to add.

## Out of scope

The Filters panel (MY-156, merged and untouched), the audit (MY-161), a reorder, delete, Undo or filter animation,
and a View Transition of any kind for the list.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 90 kB, `main` at the size the
  merged Filters panel left).
- In `pnpm dev` (port 5187), headless Chrome over the DevTools protocol, real mouse events: four fast clicks on
  different checkboxes at 0 to 40 ms gaps all land, a delete followed at once by another row lands, and the list
  matches the storage; a new task fades in only on add and the search typing animates nothing; the transitions run
  on a check that sends its row down, on one that leaves it in place and on unchecking, and the attribute is gone
  a frame later (also under reduced motion); focus after toggle, delete, Undo, Mark all and Clear
  completed equals `main`'s; the theme circle; reduced motion makes no transition; the keyboard; forced colors;
  320px and desktop in both themes. Screenshots go to `scratchpad\my158\`.
