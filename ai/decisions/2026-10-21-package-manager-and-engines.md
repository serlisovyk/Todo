# `packageManager` and `engines` pin pnpm and Node, and CI takes pnpm from `package.json`

Date: 2026-10-21 · Status: accepted

## Context

`pnpm` left `packageManager` and `engines` out, "unless a later decision needs one". Then any pnpm and any Node
could install the project, and the CI workflow named pnpm 12 on its own: a second home for a version. The author
asked for both fields. This record replaces `pnpm` and restates what stays in force.

## Decision

- `package.json` has `"packageManager": "pnpm@12.3.4"`, the pnpm that made the lockfile, and
  `"engines": { "node": ">=22" }`. No `pnpm` key in `engines` (it would repeat `packageManager`) and no integrity
  hash after the version.
- The CI step `pnpm/action-setup` has no `version:` input and reads `packageManager`; `node-version` in the workflow
  is 22, the floor of `engines`.
- Still in force from `pnpm`: `pnpm` for every install and script, `pnpm-lock.yaml` the only lockfile, and
  `pnpm install --frozen-lockfile` in CI.

## Consequences

- pnpm 12 records the pinned pnpm in `pnpm-lock.yaml`, and `--frozen-lockfile` fails until it is there: a new pnpm
  is a change of `packageManager` plus an install that updates the lockfile, in the same commit.
- A Node below 22 gets pnpm's engines warning; the Node of the workflow and `engines` move together.
- Rejected: `version: 12` in the workflow next to `packageManager` (two homes for one version, and the action can
  refuse both); a `pnpm` key in `engines`; a hash on `packageManager`; a `LICENSE` file, which the author declined
  in the same pass.
