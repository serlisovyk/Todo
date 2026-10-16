# No automated tests

Date: 2026-10-16 · Status: accepted

## Context

During planning, unit tests for the filters and validators and one contract suite run against
every storage implementation were proposed. The author decided against tests: the app is small,
and every change is checked by hand in the browser anyway.

## Decision

- The project has no automated test suite, no test framework and no `test` script.
- Verification is lint, format check, build and bundle size, plus using the change in the
  browser: desktop and 320px, both themes, and a reload for anything stored.

## Consequences

- Do not add tests or a test framework unless the author explicitly asks.
- Do not report the absence of tests as a gap in reviews or reports.
- Manual browser verification is mandatory: it is the only check that exercises the app. The
  storage swap is proven by using the app with each `VITE_STORAGE` value.
