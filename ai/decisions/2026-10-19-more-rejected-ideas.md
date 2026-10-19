# More ideas the author rejected

Date: 2026-10-19 · Status: accepted

## Context

The features are built and the author went through the ideas still open. These were rejected on purpose, so they are
not proposed again. `rejected-features` stays in force whole; this record only adds to it.

## Decision

Do not build, set up or propose these again unless the author explicitly asks:

| Idea                                                                       | Why it was rejected                                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Undo for Mark all                                                          | The opposite button already undoes it (`footer-acts-on-all-tasks`)                      |
| A keyboard-shortcut help screen                                            | Two shortcuts: `/` hinted by the search placeholder, Undo is the standard Ctrl or Cmd+Z |
| Dependabot                                                                 | It works through pull requests and the repo has none (`local-merge-without-pr`)         |
| Manual checks on real devices and screen readers (NVDA, VoiceOver, Safari) | Out of proportion for a one-page app; speech is read from the accessibility tree        |
| Lighthouse or axe in CI                                                    | CI stays lint, format, build and size (`scope.md`); the audit runs both by hand         |
| A custom domain                                                            | The Vercel address is the public one (`vercel-and-link-previews`); a domain is upkeep   |

## Consequences

- Reviews and reports do not list these as missing. The gaps the audit left open (NVDA, VoiceOver, real Safari, real
  devices) stay open by decision.
- It narrows the audit layer of `accessibility-and-seo`: its NVDA step is not done. Keyboard, zoom, 320px, the
  accessibility tree, and Lighthouse and axe run by hand stay.
- Reversing any item needs an explicit request from the author and a new dated record.
