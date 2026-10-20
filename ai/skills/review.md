---
name: review
description: Use to self-review a diff in the Todo repo for regressions, scope creep, accessibility, and docs drift before reporting a change done.
---

# Review

## When to use

Self-review pass before handing over any non-trivial change, per `ai/workflow.md`.

## Checklist

Walk the diff against `ai/rules/definition-of-done.md` and the rules of the areas it touches
(`architecture`, `react`, `style`, `scope`). Then check what the rules do not cover:

- **Tasks**: add, edit (Enter, the Save button or leaving the field saves, `Escape` or the Cancel
  button cancels and never saves, an empty title keeps the old one), toggle, delete and Undo (back at
  the same place), clear completed and Undo, mark all (both ways); a double click on a delete button, a checkbox, a
  footer button or Undo acts once and presses nothing under the toast, a keyboard press and a single click as before.
  Completed tasks stay at the bottom
  under every sort; the counter is the active tasks out of all, whatever the filters; a button that
  hides when used hands the focus on.
- **Filters and search**: status, category, sort and query combine; a reload restores them from
  the URL; unknown values in the URL are ignored; the empty list says which case it is ("No tasks
  yet" or "No tasks match your filters"); the highlight marks every match and special characters
  are plain text; a row that an edit hides hands the focus on; the live region says the result only
  when its text changes, so typing that keeps the count is quiet. The category and sort pills show the
  choice on every load, the Reset icon is there only while one of them is not the default, and it hands
  the focus to the category pill and leaves the status and the query alone, and its appearance moves no
  pill; the search hint shows whole at 320px, and the pills row has no horizontal scroll, with and without
  Reset. The category counts are every task of the category, whatever the status and the search, and follow
  an add, a delete, Undo, an edit, an import and a clear.
- **Storage**: a reload keeps everything; broken or foreign data gives an empty list without a
  crash and is not overwritten until something changes; blocked or full storage gives a toast,
  not a crash; two tabs stay in sync; both backends behave the same.
- **Backup**: an exported file imports back with nothing duplicated and nothing of the present tasks
  changed; a foreign, broken, oversized or wrong-version file changes nothing and says why; a refused
  write leaves no half-written import; a file from one backend imports into the other.
- **Theme**: light, dark and system all work; system follows the OS live; no frame in the wrong
  theme on load.
- **Accessibility in the browser**: every flow by keyboard alone; focus after each action; a
  screen reader hears names, states and each announcement once (the accessibility tree lists no
  description equal to a name, a link that opens a new tab says so); tooltips on icon buttons and links, chips and
  pills, none over an open picker; a live region fed by typing speaks at its thresholds, never per keystroke;
  contrast in both themes, hover and focus included; 320px and 200% zoom without horizontal scroll,
  and 150 to 200% text at 320px; the toast never hides the focused control; a click on a control
  below a form that closes on blur still lands, by mouse and by touch; Escape in an open picker
  closes the picker only; reduced motion (durations from the tokens, no `prefers-reduced-motion`
  block in a component).
- **React**: no state that could be derived; no manual memoization; effects only synchronize with
  something outside React and clean up; list keys are ids.
- **Scope**: nothing from `ai/rules/scope.md` or the rejected features slipped in; no unrelated
  rewrites; removed behaviour left no unused code, styles or constants.
- **Docs drift**: the docs still match the code, none went over its limit (`ai/rules/docs.md`),
  and a decision record exists if a durable decision was made.

## Verification gaps to catch

- Build green, but the change was never used in the browser.
- Checked on desktop only — never at 320px or by touch.
- Checked in one theme only.
- Checked in the default look only: not on hover, not with 200% text, not with a toast on screen.
- Animation checked only with motion enabled, or only with slow single clicks and never a burst of fast ones.
- Stored data checked without a reload, or only with clean storage.

## Report

State what was checked and what was found — fix it or say plainly why a finding is being left
alone, per `ai/workflow.md`'s report step.
