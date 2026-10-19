# The footer names the author, and the header links to the repository

Date: 2026-10-19 · Status: accepted

## Context

The page carried no name and no way to the source. The author wanted both, small: a signature at the bottom of
the page and a link to the repository a visitor finds without opening the README. `lucide-react`, the icon source
(`ui-dependencies`), ships no GitHub icon since it dropped its brand icons, and a dependency for one icon is
out of scope (`scope.md`).

## Decision

- The footer is the page's `<footer>`, outside `<main>`: plain text, the author's name, a middle dot and the
  current year, muted and centred, with no link and no copyright sign. It sits at the bottom of the window when the
  content is short. It is not the tasks footer.
- The repository link is an icon at the top right of the header, beside the theme switch, opening in a new tab.
  It is a link, not a button. One `title` is its name and its tooltip and says it opens in a new tab
  (`tooltips-as-title`); the target is 44px, in the look of an icon button.
- Its icon is `GithubIcon`, a small component of the app's own, in the stroke style of the other icons. `GithubLink`
  is its own component: `IconButton` is a button.

## Consequences

- The repository address and the link's label are constants. Another brand icon would be another small component,
  not a dependency.
- Rejected: a link in the footer text, or a text link "GitHub" in the header (the author chose the icon in the
  corner); a generic `lucide-react` icon (`Code`, `GitFork`) that does not say GitHub, a fork icon reading as an
  action; the filled Octicons mark, heavier than the stroked icons beside it; a dependency for brand icons; an
  `aria-label` beside the `title`; a footer that floats under a short list.
