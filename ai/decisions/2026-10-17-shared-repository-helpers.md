# Helpers shared by repositories are ordinary methods of the base class

Date: 2026-10-17 · Status: accepted

## Context

Every repository needs the same task logic: check a task and reject when it is invalid, build a new
task (`id`, `completed: false`, both timestamps) and apply a patch to a stored one (keep `id` and
`createdAt`, set `updatedAt`). The style rule makes a class helper a private method, but `#private`
methods are not inherited, so a second implementation cannot call the first one's helpers.

## Decision

- `TodoRepository` holds these helpers beside the contract as ordinary methods:
  `requireValidTodo(candidate)`, `buildTodo(input)` and `applyPatch(current, patch)`. The last two
  return a task that passed the validator. Their names say what they do, so none is mistaken for a
  contract operation.
- An implementation calls them and never repeats that logic. A helper only one class uses stays a
  private method of that class.
- The base class holds the contract and the helpers shared by implementations, nothing else: no
  state and no storage code. Reshaping it further needs the author.

## Consequences

- Building and patching a task are written once, so every backend stores the same task for the same
  input.
- The helpers read the clock and `crypto.randomUUID()`.
- Rejected: helpers in `utils/` — it holds pure functions and these read the clock and generate
  ids; duplicating the code in each implementation — the copies drift apart (a patch that changes
  `createdAt`, a task stored without the check).
