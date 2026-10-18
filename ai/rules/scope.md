# Scope Rules

This is a small portfolio todo app. Improve it without turning it into a larger application
template.

## Do Not Add Without Explicit Request

- TypeScript
- Test frameworks or automated tests
- State-management or server-state libraries (Redux, Zustand, TanStack Query, …) and `useReducer`
- A router
- A UI kit or utility CSS framework, CSS Modules, CSS-in-JS, a CSS preprocessor
- A toast, date, form or validation library
- A backend, an HTTP API, a mock server (MSW, json-server)
- Authentication, analytics, third-party runtime scripts, a font CDN
- A service worker or PWA manifest, i18n
- Windows contrast themes (`forced-colors`) are not tuned: out of scope by the author's decision

## Dependencies

- Runtime dependencies are `react`, `react-dom`, `lucide-react` (icons) and `idb` (the IndexedDB
  backend). Another one needs the author's explicit yes and a decision record.
- Tooling in scope: ESLint, Prettier, Husky + lint-staged, GitHub Actions CI, size-limit.

Features the author already rejected are listed in
`ai/decisions/2026-10-16-rejected-features.md` — do not propose them again.

## Prefer

- Small, focused improvements to the existing UI
- Accessibility fixes tied to the existing interface
- Keyboard and touch improvements
- Build and performance improvements that directly help the app

## Tradeoffs

- If a tool adds more maintenance than value, do not add it.
- If an optimization makes the source harder to understand, reconsider it.
- If a change is only useful for a much larger project, leave it out.
