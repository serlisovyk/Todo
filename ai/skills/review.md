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
  button cancels and never saves, an empty title keeps the old one), toggle, delete and Undo (back at the same place), clear completed and Undo, mark
  all. Completed tasks stay at the bottom under every sort; the counter matches the list.
- **Filters and search**: status, category, sort and query combine; a reload restores them from
  the URL; unknown values in the URL are ignored; the empty list says which case it is ("No tasks
  yet" or "No tasks match your filters"); the highlight marks every match and special characters
  are plain text.
- **Storage**: a reload keeps everything; broken or foreign data gives an empty list without a
  crash and is not overwritten until something changes; blocked or full storage gives a toast,
  not a crash; two tabs stay in sync; both backends behave the same.
- **Theme**: light, dark and system all work; system follows the OS live; no frame in the wrong
  theme on load.
- **Accessibility in the browser**: every flow by keyboard alone; focus after each action; a
  screen reader hears names, states and each announcement once (the accessibility tree lists no
  description equal to a name); tooltips on icon buttons, chips and pills; contrast in both themes;
  320px and 200% zoom without horizontal scroll; reduced motion (durations from the tokens, no
  `prefers-reduced-motion` block in a component).
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
- Animation checked only with motion enabled.
- Stored data checked without a reload, or only with clean storage.

## Report

State what was checked and what was found — fix it or say plainly why a finding is being left
alone, per `ai/workflow.md`'s report step.
