---
name: feature
description: Use when adding or changing a user-facing feature in the Todo app — which layer owns its values, stored data, state, logic, markup and styles, and how they connect.
---

# Feature

## When to use

Adding or changing anything a user sees or anything that touches the tasks: a field, a control,
a filter, a toast, an animation, the stored format.

## Steps

1. Read `ai/map.md` and the rules (`architecture`, `react`, `style`); do not rediscover the code.
2. Split the feature across the layers before writing code:
   - **Constants** — every new shared value (a storage key, a list of options, a limit, a
     duration JS needs) in the matching `*.constants.js`, re-exported from `constants/index.js`.
   - **Utils** — the logic as pure functions in a `*.utils.js`: filtering, sorting, validating,
     splitting text, the list change an action applies. No React, no DOM, no storage.
   - **Storage** — only when the stored data or the repository changes: `ai/skills/storage.md`.
   - **Context** — a folder `context/<name>/` with the object (`<name>.context.js`), the provider
     (`<name>.provider.jsx`) and the hook. The state is `useState` in the provider; the action
     changes the UI first, writes through the repository, and on failure rolls back and sets
     `error` for the toast to show. It never throws or rejects; a caller that needs a result gets
     an empty one on failure (`null`, `[]`).
   - **Hook** — what components call (`useTodos()`: the tasks, `isLoading`, `error` and the
     actions), `use-<name>.js` in the context's folder. The folder's barrel exports only the
     provider and the hook, so the object stays internal. A browser API (the URL, `matchMedia`, a
     document key listener) gets its own `use-*` hook in `hooks/` that cleans up after itself, and
     so does a component's own logic (a form's fields, submit and focus): `use-<component>.js`.
   - **Component** — a folder in `components/` with its `.jsx`, its `index.js` and its `.css`
     once it has rules; `components/index.js` re-exports the folder. It reads through the hook,
     renders, and reports actions through `on<Action>` props or the hook's actions. Another
     component imports it from `@/components/<name>`.
   - **Files** — a new folder gets its `index.js` with its first file; every new public name is
     re-exported there, and other folders import it through `@/<folder>`.
   - **Styles** — colours and sizes from the tokens, keyframes in `animations.css`, reduced
     motion handled; a category or priority colour through `data-category` / `data-priority`.
3. Providers are wired in one place, inside `App`; nothing else calls `createRoot`.
4. Verify per `ai/rules/definition-of-done.md`: use the feature on desktop and at 320px, in both
   themes, and reload for anything stored.

## Recipes

**A task field** — the validator accepts it (a default for older data), `todo-form` sets it,
`todo-item` shows it. Export and import need nothing extra: they use the same validator
(decision `export-and-import`).

**A filter** — its allowed values and default in a constants file; its state in `use-filters`,
read from and written to the URL query with `history.replaceState` (a default is not written, an
unknown value is ignored); the filtering itself a pure function in `utils/`. The control is a
radio group: the status stays on screen, everything else goes into the Filters panel (decision
`filters-and-search`).

**A toast** — through the toast context: one toast at a time, `role="status"`, gone after
5 seconds, paused while hovered or focused. An undoable action keeps what it removed and puts it
back at the same position.

**An icon button** — a `lucide-react` icon, an `aria-label`, a touch target of at least 44px,
always visible (a touch screen has no hover).

**An animation** — `@starting-style` for an element that enters; a View Transition
(`document.startViewTransition` + `flushSync`) for a reorder or a removal, feature-detected and
skipped under reduced motion. It never blocks, queues or drops the next action (decision
`list-animations`).

## Avoid

What the rules and decisions do not already say loudly:

- The same data kept in two places: a copy of the tasks in a component, a counter in state.
- An effect that watches state to do what an event handler should do.
- A placeholder control, section or state for a feature that does not exist yet.
- A colour, spacing or duration literal outside the tokens.
