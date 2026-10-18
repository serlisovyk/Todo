# The Undo toast keeps its 5-second limit, a conscious deviation from WCAG 2.2.1

Date: 2026-10-18 · Status: accepted

## Context

A toast leaves after 5 seconds and waits only while the pointer or the focus is inside it. WCAG 2.2.1 (Timing
Adjustable, level A) wants a time limit set by the content to be turned off, adjusted or extended; this one is
none of those, and `accessibility-and-seo` aims at WCAG 2.2 AA. The audit raised it. The Undo button comes after
the whole page in the tab order, so a keyboard user rarely reaches it in time by Tab.

## Decision

- The limit stays 5 seconds, with the pause on hover and focus. The author accepts the deviation from 2.2.1.
- It is accepted because:
  - Ctrl or Cmd+Z runs the toast's action from anywhere outside a text field while the toast is up, so Tab is not
    needed, and `aria-keyshortcuts` exposes the shortcut;
  - the toast waits while it is hovered or focused;
  - the action is a convenience: missing it costs the deleted or cleared tasks and nothing else, and the message
    itself is announced once through the live region.

## Consequences

- The audit lists the deviation as known and decided, not as a finding to fix.
- Every toast keeps `TOAST_DURATION`: no setting, no longer timer for toasts with an action, no toast that stays
  until it is dismissed.
- Rejected: 20 seconds for toasts with an action (a toast that long covers the bottom of the page); no timer while
  an action is offered (it needs a close button and a rule for the next toast); a setting for the duration.
