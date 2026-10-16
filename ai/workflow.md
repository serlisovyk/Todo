# Task Workflow

End-to-end sequence for taking a Linear task in this repo. `AGENTS.md` states the
non-negotiable rules; this file is the full flow.

## 1. Pick up the task

- Read the Linear issue (`MY-<n>`) in full, including its checklists, its «Решения автора»
  section and its "blocked by" relations. Do not start a task whose blockers are not `Done`.
- Check `ai/decisions/` for anything the task would contradict — especially
  `2026-10-16-rejected-features.md`. If it reverses a decision, say so before starting.
- If the scope is ambiguous or conflicts with a rule or decision record, ask **before**
  writing anything.

## 2. Branch

- Branch off the latest `main`, named `my-<n>-<slug>` (e.g. `my-149-storage-layer`) —
  lowercase issue id, short English slug.
- Do not use Linear's `gitBranchName` as-is: it prepends a username and its slug is a
  transliteration of the Russian title. Write your own short English slug.
- Never commit task work directly on `main`.
- Running several tasks at once: one `git worktree` per branch under `.claude/worktrees/`
  (ignored by git), each with its own `pnpm install` — see "Parallel work" below.

## 3. Move the task to In Progress

Set the Linear issue state to `In Progress` when work actually starts — not when it is
merely planned.

## 4. Orient

Read in this order, stopping once you have what the task needs:

1. `ai/map.md` — where things live and what the project deliberately lacks.
2. The `ai/rules/*` of the area you touch, and the decision records of what you touch
   (index in `ai/decisions/README.md`).
3. The matching skill in `ai/skills/` — `feature` for anything user-facing.

Do not explore the code from scratch when the map answers the question.
`ai/superpowers/` is the archive of past tasks: read only the plan or spec of the feature
you change.

## 5. Spec + plan — one commit, before code

- **Plan** — for anything touching more than one or two files, or with more than one
  reasonable approach. Say what will change and how it will be verified; cite decision
  records, do not retell them (`ai/rules/docs.md`).
- **Spec** — when the task changes observable behavior (UI flows, stored data, keyboard,
  what a screen reader hears).
- Write them under `ai/superpowers/plans/` and `ai/superpowers/specs/` as
  `<YYYY-MM-DD>-<slug>.md`, reusing the branch slug so spec, plan, branch, and issue pair up.
- Commit spec + plan together as a **single commit**, before any implementation commit.
- If the issue says something is to be "decided in the plan" (`решить в плане`), stop after
  the plan commit and hand the plan to the author. Continue only after approval, updating
  the plan with the author's answers.
- A trivial, single-file, single-approach change does not need a plan file — use judgment,
  don't manufacture ceremony.

## 6. Implement

- Follow the plan; commit in logical units, not one giant snapshot. Inspect `git status`
  and `git diff` before each commit.
- Every commit goes through the pre-commit hook once the repo has one. Never bypass it with
  `--no-verify`; fix what it reports.
- Conventional Commit messages in English (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`,
  `build:`, `ci:`, `chore:`) — specific, never `update` or `changes`.
- Use the matching skill instead of improvising a pattern that already exists.
- If reality diverges from the plan, update the plan file in the same change.

## 7. Keep docs in the same change

Only what the change made wrong, within the limits of `ai/rules/docs.md`:

- `README.md` — when what a user sees, the scripts, or the structure changed.
- `ai/map.md` — when a file, folder, storage key, or script was added, removed, renamed,
  or moved.
- `ai/rules/*` or `ai/skills/*` — when the change reshaped a pattern.
- `ai/decisions/` — a new dated record when the change meets the criteria in its
  `README.md`.
- A doc that crosses its size limit is trimmed in this same change.

## 8. Verify

- The checks in `AGENTS.md` (Verification).
- Use a code or UI change in `pnpm dev`: desktop (keyboard, mouse) and 320px wide, both
  themes, `prefers-reduced-motion` for anything animated, and a reload for anything stored.
  A green build does not prove a UI change works.
- No automated tests exist. Do not add them, and do not report their absence as a gap.

## 9. Definition of Done gate

Walk `ai/rules/definition-of-done.md` point by point. Fix what fails before moving on.

## 10. Self-review

Run the `review` skill over the diff. Fix what you find, or state plainly why a finding is
being left alone.

## 11. Author approval — required stop

Nothing is merged and nothing is marked done without the author's explicit approval.
Hand over the report (step 12) and stop — silence or a neutral reply is not a yes.
Requested changes go back through steps 6–10; fold a small fix into the commit that
introduced it (`--fixup` + autosquash) rather than always adding a new commit.

## 12. Report

In Russian (it is chat, not a file):

- **what was done** — plain language, point by point, readable without opening the diff or
  the plan;
- branch (and worktree path, if any) and the commit list;
- verification output and what was checked by hand in the browser;
- self-review findings and what was done about each;
- anything deliberately left out of scope.

## 13. Merge — locally, no pull request

After approval:

```bash
git switch main
git pull --ff-only
git switch my-<n>-<slug>
git rebase main            # re-run the checks if the rebase brought in new commits
git switch main
git merge --ff-only my-<n>-<slug>
pnpm lint && pnpm format:check && pnpm build    # every check listed in AGENTS.md
git push origin main
git branch -d my-<n>-<slug>
```

- Once CI exists, check that it is green on `main` after the push; a red `main` is fixed
  right away with a follow-up commit.
- History stays linear: rebase onto `main`, then fast-forward. Never force-push `main`.
- If the branch was pushed (for a preview), delete it on the remote too
  (`git push origin --delete my-<n>-<slug>`).
- Remove the worktree if one was used (`git worktree remove <path>`).
- Move the Linear issue to `Done` and comment with the merged commit SHAs, the author's
  decisions, what was checked and what was not.

## Parallel work

- One task per worktree: `git worktree add .claude/worktrees/my-<n>-<slug> -b my-<n>-<slug> main`,
  then `pnpm install` inside it. In Claude Code, enter it with `EnterWorktree` (`path`).
- Run at most two tasks at a time, and only when they touch different areas of the code
  (storage, state, components, styles). Two tasks that change the same files, the same
  stored format or the same context never run together.
- Before a batch starts, the orchestrator asks the author every foreseeable decision and
  writes the answers into the issues («Решения автора»), so the tasks go from the plan
  straight to the code (`ai/prompts/orchestrator.md`).
- Merge one branch at a time, rebasing the next one onto the updated `main` before its merge.
- Repo-wide changes (build or lint config, file moves, the Фундамент milestone) run alone,
  never alongside other branches.
