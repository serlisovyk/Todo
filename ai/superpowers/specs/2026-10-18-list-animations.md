# Spec: motion of the list, CSS only (MY-158)

Decisions in force: `list-motion-without-view-transitions` (the new record that restates `list-animations`),
`filters-and-search` (the search never animates the list), `theme-three-states` (the circle reveal is its own
View Transition), `footer-acts-on-all-tasks`, `design-tokens` (durations are tokens), `accessibility-and-seo`
(WCAG 2.2 AA, both themes) and `js-budget-90-kb`.

## What moves

| Change                                         | Motion                                                                                                     |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| A task is added (the add form keeps the focus) | the new row fades in and slides down a few pixels                                                          |
| A task is checked or unchecked                 | the box fills or empties, the check fades and grows, the title turns muted and the strike-through fades in |
| Mark all as done, Mark all as active           | the same, on every row that keeps its place                                                                |
| Everything else                                | nothing: the list changes at once                                                                          |

"Everything else" is the reorder of a checked row (it jumps to the bottom), a delete, Undo, Clear completed, a
change of status, category or sort, the search, an edit, an import, a change from another tab and the first
load. The Undo toast, the counter and the live regions are the feedback there.

Every duration is `--duration-base`. A task that is checked or unchecked animates where it stands and also when its
row travels to a new place: the check fills the box while the row jumps. The strike-through is a fade in the
colour, not a stroke that sweeps. Mark all animates the rows that keep their place; a row it moves changes at once.

## Input is never lost

Nothing here takes the page's input: no View Transition runs for the list, so a click or a tap at any moment after
another action lands. Several fast clicks on different checkboxes, or a delete followed at once by another row,
all take effect, and the list matches the storage.

## Reduced motion and forced colors

- Under `prefers-reduced-motion: reduce` every change above is instant: the tokens are zero, there is no
  per-component rule and no script to check.
- In forced colors an unchecked title has no strike-through, a checked one has, and the check mark is visible only
  on a checked box.

## Focus and what a screen reader hears

Unchanged. After a toggle that hides the row, a delete and Clear completed the focus has already moved to the next
row, else the previous one, else the checked status radio. After Undo it lands on the restored task, after Undo of
Clear completed on its button, after Mark all on the other Mark all button. The counter, the filter result and the
toast speak through their live regions once each.

## The theme switch

Unchanged: the circle reveal is a View Transition of the document. A click during its half second is lost, which
is accepted because a theme change is rare.

## Look

Rows take their colours, spacing and durations from the tokens; nothing new is drawn. At 320px and on the desktop,
in both themes, a checked row keeps its text, its check mark and its borders intact.

## Out of scope

A reorder, delete, Undo or filter animation (FLIP through the Web Animations API is the way if one is wanted), a
View Transition for the list, animating the rows around a new task, and an edit or an import animation.
