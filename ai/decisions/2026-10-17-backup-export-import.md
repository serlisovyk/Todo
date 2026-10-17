# Backup by JSON export and import, in a row of its own, merged by id

Date: 2026-10-17 · Status: accepted

## Context

Tasks live in one browser only: clearing site data or changing computers loses them. Export and import are
also the only way to move tasks between the localStorage and IndexedDB backends. `export-and-import` set the
file and the merge and put both buttons in the footer, which is absent with no tasks; Import has to work then,
and a summary that counts tasks already there as "skipped" says too little. This record replaces it and
restates what stays in force.

## Decision

- Export downloads `todo-backup-YYYY-MM-DD.json` with `{ app: 'todo', version, exportedAt, todos }`, `version`
  being the stored data format version, through a `Blob` and `<a download>`, no library.
- Import reads a file chosen through a real button that opens a hidden file input. A file over 1 MB is rejected
  unread. The whole file is checked first: an object, `app` is `'todo'`, a known `version`, `todos` is an
  array. Otherwise an error toast explains it and nothing changes.
- Each task goes through the storage validator; a broken one is skipped.
- Tasks merge by `id`: new ones are written in one `restore` call, existing ones are left as they are (a
  repeated `id` in the file too), with no confirmation and no Undo. A toast reports the result, parts that are
  zero left out: "Imported 8 tasks, 2 already there, 1 skipped", and "Nothing new: 8 already there" when
  nothing was imported.
- The buttons are a row of their own under the list and the footer, always on screen: Import always, Export
  while tasks exist. Both act on all tasks (`footer-acts-on-all-tasks`); the footer is not changed.

## Consequences

- The backup shares the storage format version: a format change updates the export and the import check.
- Rejected: the buttons in the footer, which is absent with no tasks; an import that replaces everything after
  a confirmation; one "skipped" count for tasks already there and broken ones.
