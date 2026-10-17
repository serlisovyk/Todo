# Backup by JSON export and import, merged by id

Date: 2026-10-16 · Status: superseded by 2026-10-17-backup-export-import.md

## Context

Tasks live in one browser only: clearing site data or changing computers loses them. Export and
import are also the only way to move tasks between the localStorage and IndexedDB backends.

## Decision

- Export downloads `todo-backup-YYYY-MM-DD.json` with `{ app: 'todo', version, exportedAt, todos }`,
  through a `Blob` and `<a download>`, no library.
- Import reads a file chosen through a real button. The whole file is checked first: an object,
  `app` is `'todo'`, a known `version`, `todos` is an array. Otherwise a toast explains it and
  nothing changes.
- Each task goes through the storage validator; a broken one is skipped.
- Tasks merge by `id`: new ones are added, existing ones are left as they are, no confirmation. A
  toast reports the result: "Imported 8 tasks, 2 skipped".
- Both buttons sit in the footer under the list.

## Consequences

- The backup shares the storage format version: a format change updates both.
- Rejected: an import that replaces everything after a confirmation.
