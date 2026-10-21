# Plan: docs cleanup, pinned pnpm and Node, assets-performance rules (MY-173)

Branch `my-173-docs-cleanup`. Linear issue MY-173, milestone Полировка, the last task of the batch (after MY-170, MY-171
and MY-172): it cleans the final state and runs alone, because it touches the docs of the whole repo. MY-174 comes
after it and owns the `theme-color` meta of `index.html`, so this task does not touch `index.html`. No spec: nothing
changes for a user, and no file under `src/` changes.

## The author's answers (issue, «Решения автора», 2026-10-19 and 2026-10-21)

Clean the docs without bloat, one fact in one place. `engines` and `packageManager` yes, `LICENSE` no. The archive
`ai/superpowers/` stays as it is. A rules file `ai/rules/assets-performance.md` is added (2026-10-21). The plan decides
what the issue left open: whether CI keeps its `version:` for pnpm.

## What was measured first

| Doc                        | Lines | Bytes | Limit (`ai/rules/docs.md`) |
| -------------------------- | ----- | ----- | -------------------------- |
| `ai/map.md`                | 148   | 11977 | 150 lines, 12 KB           |
| `ai/rules/architecture.md` | 71    | 5284  | about 150 lines            |
| `ai/rules/react.md`        | 98    | 7514  | about 150 lines            |
| `ai/rules/style.md`        | 130   | 9378  | about 150 lines            |
| `ai/skills/feature.md`     | 143   | 11503 | about 12 KB                |
| `ai/skills/storage.md`     | 94    | 6381  | about 12 KB                |
| `ai/skills/review.md`      | 71    | 4912  | about 12 KB                |
| `ai/skills/og-image.md`    | 61    | 4121  | about 12 KB                |

Found by reading every doc against `src/`, the configs and the tree:

- The map holds 62 list items and 23 of them are over the "about 150 characters" of `docs.md`; `utils/` is 567
  characters and `hooks/` 412. The "Folder / Holds" table repeats the layers table of `architecture.md`, and "Where is the
  recipe" repeats the Skills and Read First lists of `AGENTS.md`.
- A script over every `[...](...)` link, every backticked path and every `decision` slug in the docs outside the
  archive found one broken name: `categories.constants.js` in `style.md` (there is no such file). No current doc cites a
  superseded record.
- The decision index lists the 39 records in force and leaves the 8 superseded ones out entirely, so they cannot be
  found from it; the issue's "9 of 44, mixed in" is out of date.
- The record `pnpm` says "No `packageManager` or `engines` field", which this task reverses.
- Not for this task, reported only: the accepted record `list-motion-without-view-transitions` names `animations.css`,
  which a later cleanup dropped, and `react-and-javascript` and `state-in-context-and-hooks` cite superseded records.
  Records are not rewritten.
- No `.map` file is in `dist/`: `vite.config.js` sets no `build.sourcemap`, so source maps are off.

## Decisions taken in this plan

- **CI drops `version: 12` from `pnpm/action-setup`.** With `packageManager` set the action reads the version from
  `package.json`, and the two together make it fail as "multiple versions specified". One home for the version, so a
  bump is one line. `node-version: 22` already equals `engines.node` `>=22`; it stays a literal, since `setup-node`
  needs a version that exists, not a range.
- **`packageManager` is `pnpm@12.3.4`**, the pnpm that is installed and that made the lockfile: the lockfile records
  its format (`9.0`), not a pnpm version. No integrity hash is added. `engines` is `{ "node": ">=22" }` only, no `pnpm`
  key (it would repeat `packageManager`). The first run showed that pnpm 12 records the pinned pnpm in `pnpm-lock.yaml`
  (a new first YAML document of about 100 lines, no line removed) and that `--frozen-lockfile` fails without it. So the
  lockfile changes once, by `pnpm install` and never by hand, and the frozen install passes afterwards. The other way,
  `engines` alone with no `packageManager`, leaves the lockfile as it is; it is a question in the report.
- **A new decision record** `package-manager-and-engines` (dated 2026-10-21) restates what stays in force of `pnpm`
  (pnpm for every install, the one lockfile, `--frozen-lockfile` in CI) and reverses its "no `packageManager` or
  `engines`". The old record only changes its `Status` line to `superseded by …`, the one change `ai/decisions/README.md`
  allows. This goes one step past the issue's "do not rewrite the records", and is the way `README.md` of the decisions
  says a reversal is made. The record also notes the author's no to a `LICENSE` file, and `scope.md` lists it among the
  things not added without a request.
- **The decision index** keeps its three topic groups for the records in force, in the same order, and gets a fourth
  group "Superseded" at the end: one line per replaced record, with `→` and a link to its replacement. A sentence under
  "Status" tells the next agent to move a line there when it supersedes a record. Every file in `ai/decisions/` is then
  in the index, and the records in force are the first three groups.
- **The map loses what is homed elsewhere**, not what is unique: the table and its intro (the layers are in
  `architecture.md`, naming, barrels and `@/` in `style.md`), "Where is the recipe" (`AGENTS.md`, `ai/skills/README.md`),
  the "update it when" sentence (`docs.md`, the Definition of Done), the `@keyframes` clause (`style.md`). The three
  fat list items (`hooks/`, `utils/`, `storage/`) split into sub-items of one idea each. The goal is 125 to 130 lines.
  Every path and name it keeps is checked against the tree.
- **`assets-performance.md` is a rules file of about 45 lines**, every point taken from `index.html`, `base.css`,
  `.size-limit.json`, the build and the records, not invented: the font (self-hosted Latin-subset `woff2` in
  `public/fonts/`, a preload with `crossorigin`, `font-display: swap`, no font CDN); what `public/` holds; the page
  metadata (absolute production URLs, the size and alt of `og:image` equal to the file, `twitter:*` mirrors `og:*`, the
  card under 200 kB and outside the budgets, true text); no sitemap, no web app manifest, no third-party runtime
  scripts, no production source maps; a budget raised only on purpose, with a decision record, comparing the production
  build before and after. Where each rule was written before moves here: `scope.md` (third-party scripts, font CDN,
  manifest), the `og-image` skill (the 200 kB, the 1200×630 and the alt rules; it keeps the recipe and links the rule),
  the map's `public/` line. It is linked from `AGENTS.md` (Read First), the map and the Definition of Done. The records
  keep their why and are not edited. `style.md` and `docs.md` held no copy.

## Order of work

One commit each, after this plan:

1. `ai/map.md`.
2. `ai/rules/assets-performance.md`, its links, and the duplicates removed from `scope.md` and `og-image.md`.
3. The stale rules (`style.md` and whatever else the pass finds in `ai/rules/`).
4. The skills (`feature`, `review`, `storage`, `og-image`): recipes that lead to the current patterns, each within its
   limit (`feature.md` is at 11.5 KB of 12, so a line added is a line cut).
5. `package.json` and `ci.yml`, with the lines of the map and `AGENTS.md` that name the manager.
6. The record `package-manager-and-engines` and the `Status` line of `pnpm`.
7. The decision index.
8. A fix commit only if the link check finds more.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`; the Definition of Done walked.
- `pnpm install --frozen-lockfile` passes with `packageManager` set, and the lockfile diff is only the added document.
- The link script again after the last commit: no broken link, no cited superseded record.
- Lines and bytes of every limited doc, before and after, in the report.
- A browser check is not needed: no code or UI changes. `dist/` is built only to run `pnpm size`.
