# `eslint-plugin-jsx-a11y` runs on ESLint 10 through an allowed peer

Date: 2026-10-16 · Status: accepted

## Context

The author chose `eslint-plugin-jsx-a11y` to catch accessibility mistakes at commit time. Its
latest release declares ESLint up to 9 as its peer, while the repo runs ESLint 10. A probe file on
ESLint 10 got the expected errors: a click handler on a `div`, an `img` without `alt`, an `a`
without `href`, a label without a control.

## Decision

- Keep `eslint-plugin-jsx-a11y` with its flat `recommended` config.
- Allow ESLint 10 as its peer in `pnpm-workspace.yaml` (`peerDependencyRules.allowedVersions`), so
  `pnpm install` stays clean and a new peer warning still means something.

## Consequences

- When the plugin declares ESLint 10, remove the override.
- If one of its rules breaks on ESLint 10, wrap the plugin with `fixupPluginRules` from
  `@eslint/compat` before considering anything else.
- Rejected: staying on ESLint 9, a fork of the plugin, ignoring a permanent install warning.
