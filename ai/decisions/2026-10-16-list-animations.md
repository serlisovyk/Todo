# List animations are a progressive enhancement

Date: 2026-10-16 · Status: accepted (not implemented)

## Context

Completed tasks move to the bottom and deleted ones disappear. When the list changes instantly, the
eye cannot follow what happened.

## Decision

- A new row enters with CSS `@starting-style`, no JavaScript.
- Completing, deleting, Undo, clearing completed tasks and changing filters run inside a View
  Transition (`document.startViewTransition` + `flushSync`); each row's `view-transition-name`
  comes from its id.
- The transition is feature-detected and skipped under `prefers-reduced-motion`; it never blocks,
  queues or drops the next action.
- Every `@keyframes` lives in `styles/animations.css`, durations come from tokens.

## Consequences

- Without the API or with reduced motion the list changes instantly and nothing errors.
- Rejected: an animation library.
