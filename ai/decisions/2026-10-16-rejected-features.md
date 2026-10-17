# Features the author rejected

Date: 2026-10-16 · Status: accepted

## Context

While planning the Linear project Todo, a long list of ideas was reviewed with the author. The
accepted ones became Linear issues; the rest were rejected on purpose, so the project stays
proportional to its size.

## Decision

Do not build or propose these again unless the author explicitly asks:

| Idea                                         | Why it was rejected                                          |
| -------------------------------------------- | ------------------------------------------------------------ |
| TypeScript                                   | The author chose JavaScript (`react-and-javascript`)         |
| Automated tests, contract tests              | Checked by hand in the browser (`no-automated-tests`)        |
| HTTP repository, MSW, json-server            | No backend; localStorage and IndexedDB already show the swap |
| Due dates and a date picker                  | Overkill for this app                                        |
| User-defined categories                      | A feature of its own; the fixed list is enough               |
| Drag and drop ordering                       | Fights the sort, needs a library and keyboard handling       |
| `useReducer` or a state manager              | Too heavy for this size (`state-in-context-and-hooks`)       |
| Feature folders                              | Flat role folders chosen (`structure-and-naming`)            |
| Authentication, a backend                    | No server                                                    |
| Subtasks, recurring tasks, reminders         | Out of proportion for a small todo app                       |
| A single-key shortcut for a new task (`N`)   | `/` is the only one, its hint is the search placeholder      |
| PWA (manifest, service worker), i18n         | Overkill for this project                                    |
| Tailwind, CSS Modules, CSS-in-JS             | Plain CSS with tokens (`plain-css-and-tokens`)               |
| A toast library                              | An own toast is a few lines (`ui-dependencies`)              |
| Vercel agent skills (`react-best-practices`) | The rules here cover what applies; not vendored              |

## Consequences

- Reviews and reports do not list these as missing.
- Reversing any item needs an explicit request from the author and a new dated record.
