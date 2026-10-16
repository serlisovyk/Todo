# Style Rules

Prettier decides the formatting; these are the rules it does not. They follow the workspace code
style standard plus this project's naming (decision `structure-and-naming`).

## General

- **No comments in code** — JavaScript, JSX, CSS, HTML and the root configs. Names and small
  functions say what the code does; a durable "why" goes to a rule, a skill or a decision record.
- Early `return` instead of nested `if` / `else`; no nested ternaries.
- **A clean `return`:** a name, a literal, one call or a boolean of names. A `reduce`, a `map`, a
  comparison or a ternary is computed into a `const` first:

  ```js
  const remaining = todos.filter((todo) => !todo.completed)
  const hasCompleted = remaining.length < todos.length

  return { remaining, hasCompleted }
  ```

- **Named conditions:** a long condition becomes named `const`s or early returns, one idea per line.
- Booleans start with `is`, `has`, `can` or `should` (`isEditing`, `hasCompleted`).
- No magic numbers or strings: shared values come from `constants/`.
- Repeated scaffolding (a `try` / `catch` around every call) goes into one private helper.
- **Blank lines group steps** (read, compute, write); a guard of one or two lines has none inside.
- Parameter names say what they are (`todoId`, `isCompleted`), not a bare `x` or `data`.

## Classes

Only `storage/` uses classes. State is in private fields (`#items`), helpers are private methods,
handlers are ordinary methods; an arrow-function field only for a function that is both added and
removed as a listener. One style per class.

## Files, names and imports

- Files and folders are kebab-case. A file that is not a component carries its role as a suffix:
  `categories.constants.js`, `todos.utils.js`, `todos.context.jsx`, `local-storage.repository.js`.
- A component has no suffix: `components/theme-toggle/theme-toggle.jsx` + `theme-toggle.css`.
- A hook is `use-<name>.js`.
- Names in code: components and classes PascalCase, hooks `use<Name>`, functions camelCase verbs,
  constants `UPPER_SNAKE_CASE`.
- Every folder of JavaScript modules has an `index.js` that re-exports its public names, named
  exports only — a top-level folder (`components/`, `utils/`) and every folder inside it
  (`components/todo-item/`). It appears with the folder's first file, never as an empty
  placeholder. `components/index.js` re-exports each component folder (`./todo-item`), and the
  folder's `index.js` re-exports its file (`./todo-item.jsx`). `styles/` has no `index.js`: a new
  global stylesheet is added to `styles/style.css`, the one stylesheet `main.jsx` imports.
- `@/` is `src/` (Vite alias, `jsconfig.json` for editors). Imports across folders go through it
  and the folder's barrel: `import { TodoItem } from '@/components'`. Inside one folder a sibling
  is imported directly (`./todo-item.jsx`), never through its own `index.js`.
- One component uses another through that component's folder barrel
  (`import { TodoItem } from '@/components/todo-item'`), never through `@/components`, which
  re-exports the importer itself and would form a cycle.
- ESLint checks the kebab-case file and folder names and reports, in `src/`, a default export, a
  `../` import and a module importing its own folder's barrel.

## JSX and text

- Interface texts are English and sentence case (`Add task`, `Clear completed`); one action has one
  name wherever it shows.
- Icons come from `lucide-react`, imported by name; an icon next to text is decorative, an icon-only
  button is named by `aria-label`.
- Text for assistive technology only uses the `.sr-only` class, not `display: none` or `hidden`.

## CSS

- Plain CSS with native nesting; no preprocessor, CSS Modules, CSS-in-JS or utility framework.
- A component's stylesheet sits next to it and is imported by it. Class names start with the
  component's name (`.todo-item`, `.todo-item-title`); a state is an attribute the markup already
  has (`[aria-expanded='true']`, `:checked`) or an `is-*` class.
- States and children nest inside their rule (`&:hover`, `&:focus-visible`); a media query sits
  inside the selector it changes, as a strict range without `=`: `@media (width < 480px)`,
  `@media (width > 768px)`.
- `:hover` only inside `@media (hover: hover)`, so a tap leaves no hover look.
- **Colours only through tokens** in `styles/tokens.css`: the light value on `:root`, the dark one
  on `:root[data-theme='dark']`. `#`, `rgb(`, `hsl(` appear nowhere else; a new colour gets both
  values and a contrast check in both themes.
- Colour tokens are named by role, never by hue: `--color-surface`, `--color-text-muted`,
  `--color-category-work`. A field or a checkbox is outlined with `--color-border-control`;
  `--color-border` is for decorative dividers only.
- Spacing (`--space-*`), radii (`--radius-*`), font sizes and weights (`--font-size-*`,
  `--font-weight-*`), line heights, durations (`--duration-*`, `--ease-out`) and sizes
  (`--touch-target`, `--content-max-width`) come from the token scales; no other literal for them.
- Text uses the two weight tokens only (400 and 500) and inherits the font from `body`.
- Every `@keyframes` lives in `styles/animations.css`; `prefers-reduced-motion` turns motion off.
- One `:focus-visible` rule in the base styles draws the ring for every control; never
  `outline: none` without a replacement. A `transition` names its properties, never `all`.
