# React 19 and Vite in plain JavaScript, no TypeScript

Date: 2026-10-16 · Status: accepted

## Context

Todo is a one-page portfolio app, scaffolded with Vite, React 19 and the React Compiler in
JavaScript. During planning TypeScript was proposed, mainly to make the storage contract a real
interface. The author chose to stay in JavaScript.

## Decision

- React 19 with the React Compiler (`babel-plugin-react-compiler` through
  `@rolldown/plugin-babel`), Vite, JavaScript ESM in `.js` and `.jsx` files.
- No TypeScript, no `tsconfig.json`, and no JSDoc types as a substitute (code has no comments).
- The storage contract is a base class instead of an interface (decision `repository-storage`).

## Consequences

- A request that implies TypeScript reverses this record and needs the author's explicit ask and
  a new dated record.
- Contracts are kept by base classes, by validation at the storage boundary, and by the rules.
- A `jsconfig.json` may exist only to teach editors the `@/` alias.
