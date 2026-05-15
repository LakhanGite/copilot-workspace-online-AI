# Task Manager — Schema & Architecture

**1. Data Models**

- **Task**
  - `id` (string, required)
    - Description: stable identifier for a task. Implementation: timestamp-based string or UUID-like string.
    - Validation: non-empty; matches `/^[a-zA-Z0-9-_:.]+$/` (simple, implementation-defined).
    - Rules:
      - Required.
      - Type: string.
      - Pattern: only letters, digits, `-`, `_`, `:`, `.`.
      - Length: 1 - 64 characters recommended.
  - `title` (string, required)
    - Validation: non-empty, max length 200.
    - Rules:
      - Required.
      - Type: string.
      - Trim whitespace; treat empty after trim as invalid.
      - Length: 1 - 200 characters.
  - `description` (string, optional)
    - Validation: max length 1000.
    - Rules:
      - Optional.
      - Type: string when provided.
      - Length: 0 - 1000 characters; reject or truncate values above this threshold depending on CLI flag (`--truncate-description`).
  - `status` (string, required)
    - Allowed values: `todo`, `in-progress`, `done`.
    - Rules:
      - Required (defaults to `todo` when omitted on creation).
      - Type: string.
      - Case-insensitive match allowed but stored normalized to lower-case canonical value.
  - `priority` (string, required)
    - Allowed values: `low`, `medium`, `high`.
    - Rules:
      - Required (defaults to `medium` when omitted on creation).
      - Type: string.
      - Case-insensitive match allowed but stored normalized to lower-case canonical value.
  - `createdAt` (string, required)
    - ISO 8601 timestamp (e.g., `new Date().toISOString()`), set on creation.
    - Rules:
      - Required.
      - Type: string in ISO 8601 format.
      - Set by server (library) on creation; validation accepts `Date.parse()`-able strings.
  - `updatedAt` (string, required)
    - ISO 8601 timestamp, updated on every modification.
    - Rules:
      - Required.
      - Type: string in ISO 8601 format.
      - Updated on every successful modification to reflect change time.

Notes:
- All data is stored in memory (an array of Task objects). No persistence layer is included.
- IDs may be generated via a small helper to avoid external dependencies.

**2. File Structure**

Repository files (top-level and `src/`):

- `src/cli.js` — CLI entrypoint: parse args, route commands to `tasks` API.
- `src/tasks.js` — Task domain API: high-level CRUD, filter, and sort operations.
- `src/storage.js` — In-memory storage abstraction: array management, find/create/update/delete primitives.
- `src/format.js` — Output formatting helpers: human-readable table/list renderers.
- `src/utils.js` — Utilities: id generation, timestamp helpers, validation helpers, enums.
- `bin/taskmgr` — Optional executable wrapper invoking `node src/cli.js` (executable file).
- `docs/project-plan.md` — Project plan (source of truth for features and validation rules).
- `docs/schema.md` — This schema document.
- `README.md` — Usage instructions and examples.

Directory layout example:

```
.
├─ bin/taskmgr
├─ docs/
│  ├─ project-plan.md
│  └─ schema.md
├─ src/
│  ├─ cli.js
│  ├─ tasks.js
│  ├─ storage.js
│  ├─ format.js
│  └─ utils.js
└─ README.md
```

**3. Module Responsibilities**

- `src/utils.js`
  - Exports:
    - `generateId()` -> string
    - `nowIso()` -> string
    - `validateTitle(title)` -> {ok, error}
    - `validateDescription(desc)` -> {ok, error}
    - `validateStatus(value)` -> {ok, error}
    - `validatePriority(value)` -> {ok, error}
    - `STATUS`, `PRIORITY` enums
  - Dependencies: none.
  - Purpose: centralize small pure helpers and validation rules referenced across modules.

- `src/storage.js`
  - Exports:
    - `create(task)`
    - `findById(id)`
    - `update(id, patch)`
    - `deleteById(id)`
    - `list()` -> array of tasks
  - Dependencies: `utils.js` (for id validation, optional helpers).
  - Purpose: single source of truth for in-memory data operations; keep data manipulation consistent and testable.

- `src/tasks.js`
  - Exports:
    - `createTask({title, description, priority, status})` -> Task
    - `getTask(id)` -> Task | null
    - `updateTask(id, patch)` -> Task
    - `deleteTask(id)` -> boolean
    - `listTasks({filter, sort, order})` -> Task[]
  - Dependencies: `storage.js`, `utils.js` (validation and timestamps), `format.js` for pre-formatted outputs if needed.
  - Purpose: implement business rules (defaults, validation, updatedAt handling, priority sorting semantics).

- `src/format.js`
  - Exports:
    - `formatList(tasks, options)` -> string
    - `formatTask(task)` -> string
  - Dependencies: none or `utils.js` for display ordering of priorities.
  - Purpose: separate presentation concerns from business logic.

- `src/cli.js`
  - Exports: none (CLI entrypoint).
  - Responsibilities:
    - Parse `process.argv` and map commands: `create`, `list`, `update`, `delete`.
    - Validate flags and call `tasks.js` functions.
    - Handle exit codes and top-level error handling.
  - Dependencies: `tasks.js`, `format.js`, `utils.js`.

**4. Error Handling Strategy**

High-level rules:

- Validate early and fail fast. Use descriptive messages and non-zero exit codes.
- Throw `Error` objects inside modules; CLI translates them to exit codes and user-facing messages.

Error types and mapping:

- `ValidationError` (thrown by `utils.js` / `tasks.js` when inputs are invalid)
  - Where: `utils.js` validators, `tasks.js` when applying business rules.
  - CLI exit code: `2`.
  - Message example: `"invalid priority: must be one of low, medium, high"`.

- `NotFoundError` (logical error when a requested task id is absent)
  - Where: `storage.js.findById` returns null; `tasks.js` throws when operations require an existing task.
  - CLI exit code: `1`.
  - Message example: `"task not found: 123"`.

- `OperationError` / `InternalError` (unexpected exceptions)
  - Where: unexpected exceptions in any module (e.g., programming error).
  - CLI exit code: `3`.
  - CLI behavior: print short message and include stack trace when `--debug` is provided.

CLI behavior on errors:

- Unknown command or bad flags -> print usage hint and exit `2`.
- Validation failures -> print corrective message (allowed values) and exit `2`.
- Not found -> print `task not found: <id>` and exit `1`.
- Internal exceptions -> print `internal error` + suggest `--debug`, exit `3`.

Implementation notes:

- Keep error classes small and local (e.g., simple JS classes extending `Error`), no external libraries.
- Wrap top-level CLI invocation in a `try/catch` that maps errors to messages and exit codes.

---

This document is intentionally minimal and aligned with `docs/project-plan.md` validation rules and Node.js built-in-only constraint.
