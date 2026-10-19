# Spec: author footer, repository link, category counts, title counter (MY-167)

Decisions in force: `tooltips-as-title` (an icon-only control is named by its `title`, nothing else),
`filter-pills` and `base-select-pickers` (the Category pill and its open list), `footer-acts-on-all-tasks` (a
count ignores the filters), `todo-model` (a title is at most 200 characters), `design-tokens`,
`accessibility-and-seo` (WCAG 2.2 AA, both themes), `js-budget-90-kb` and `rejected-features`. Two records are new:
the footer and the repository link, and the category counts.

## The page footer

A `<footer>` outside `<main>`, the last thing on the page and the counterpart of the header, so a screen reader
lists it as the content-info landmark. It holds the plain text `Serhii Lisovyk · 2026`: the author's name, a
middle dot, and the current year read from the date when the page renders. It is no link, in the muted text colour,
centred, in the small font size.

It sits at the bottom of the page: right after the content on a long page, and at the bottom of the window when
the content is shorter than the window. It is not the tasks footer (`todo-footer`) and never depends on the tasks.

## The repository link

An icon at the top right of the header, next to the theme switch, to the right of it.

- A link, not a button: `https://github.com/serlisovyk/Todo`, opening in a new tab (`target="_blank"`,
  `rel="noopener noreferrer"`).
- Its name and its tooltip are one `title`, "Source code on GitHub (opens in a new tab)"; the icon is hidden
  from assistive technology and there is no `aria-label`, so the accessibility tree lists the name once and no
  description (`tooltips-as-title`). The name says it leaves the page.
- A 44px target, the look of an icon button: the 20px icon in the muted text colour, the text colour on hover where
  the device can hover, the page's focus ring on focus. A tap leaves no hover look.
- The icon is the GitHub mark in the stroke style of the other icons. `lucide-react` no longer ships it, so it is a
  small component of the app's own (see the plan).

The header keeps the logo and the title at the left and the two controls at the right. From a window 350px wide
(every common phone) they share one line. Below that the pair does not fit beside the title (the link is 44px more
than the switch alone needs), so it wraps as a pair to a second line, at the right.

## Counts in the Category pill

Every option of the Category pill ends with the number of tasks in it: `All categories (12)`, `Work (3)`,
`Study (0)`. The closed pill shows the chosen option the same way.

- A count is every task of the category, whatever the status filter and the search say, like the tasks-left
  counter. `All categories` is the number of all tasks. They are derived from the tasks on every render and never
  stored, so they change at once after an add, a delete, Undo, an edit of the category, a clear, an import and a
  change from another tab, and never after a change of the status or the search.
- A screen reader reads each option as its text, "Work (3)". The marks stay decorative.
- The pill is as wide as its widest option, which is `All categories (N)`, so it grows by one digit when the
  number of tasks reaches 10 and 100. Under 480px the pill takes a line of its own at the full width and does
  not move.
- The Category pills of the add form and the edit form show no counts.

## "All categories" has no mark

Only a real category has its dot. "All categories" has none, and leaves no slot for one:

- In the closed pill the text starts at the dot's left offset, the same distance from the edge as the right padding.
  When a category is chosen the dot is there and the text starts after it.
- In the open list the option is the text alone, with no empty gap before it. The category options keep their dot.
- The Sort pill and the pills of the forms always have a mark and look as before.

## The title counter

In the add form and in the edit form, under the title field, at the right.

- Hidden until 20 or fewer characters remain of the 200 the title may have, then `180 / 200` up to `200 / 200`: the
  number of characters in the field and the limit. It follows every keystroke and is gone again when the text is
  shortened below 180. It counts what the field holds, the same units as the field's limit, so what the counter
  says is what the field accepts.
- The field's limit is unchanged, so a longer paste is still cut at 200, and now the counter says `200 / 200`.
- The counter is muted text, readable on the form's and the row's background in both themes. It moves the content
  under it down once, when it appears, as the error message does.

### What a screen reader hears

- The counter is the field's description (`aria-describedby`), so focusing the field reads "Task title, edit, 185 /
  200". It is read there only when it has text.
- A polite live region of its own beside the field speaks only when its text changes, which is when the length
  enters or leaves a range, never per keystroke, because the text is the same everywhere inside a range:
  - 20 to 1 characters remain: "20 or fewer characters left", spoken when the counter appears and not again while
    typing goes on;
  - none remain: "Character limit of 200 reached".

  Deleting back out of a range says the text of the range it enters; below the first threshold the region is
  empty and says nothing. A form that opens with a title already near the limit does not speak; the description
  tells it on focus.

- The add form's own message region ("Task added", "Enter a task title.") is a different event and stays as it is.

## Spacing of the toolbar

The gap between the search field and the row of pills is `--space-6`, as between the other blocks of the page
(it was `--space-3`). The gap between the pills and Reset stays `--space-3`.

## The keyboard

- The repository link is a tab stop after the theme switch (its radio group is one stop), a link activated with
  Enter. Reading order in the header: the title, the theme group, the link.
- Nothing else changes: the counter and the footer text take no focus, the Category pill opens and chooses as before.

## Look

Colours, spacing, radii and sizes from the tokens, both themes. Reduced motion needs nothing of its own: the link's
colour change takes its duration from a token and nothing else animates. Forced colours are out of scope
(`scope.md`).

## Out of scope

A link in the footer, a copyright symbol, counts that follow the status or the search, counts in the forms' pills,
a counter above 200 or a warning colour, a debounced "N characters left" announcement, a language or theme
change of the footer, `forced-colors` styling.
