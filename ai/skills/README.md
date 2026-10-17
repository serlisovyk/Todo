# Skills

Repo-local skill playbooks. Tool-agnostic Markdown — any AI agent (Claude, Codex, others) reads
them directly. Each file has `name` + `description` frontmatter so it maps to a matching skill
entry when a tool supports one. A skill is a recipe; what must hold is in `ai/rules/`. The other
docs are listed in `AGENTS.md`.

- [feature](feature.md) — how a feature flows through constants, utils, storage, context, hooks,
  components and styles; recipes for a task field, a filter, a toast, an icon button, a
  text button, a file in or out, an animation.
- [storage](storage.md) — adding a repository implementation and changing the stored format:
  the validator, the version bump, the migration table.
- [review](review.md) — self-review of a diff: regressions, scope creep, accessibility, docs drift.
