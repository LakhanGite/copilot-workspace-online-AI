**Project Overview**

Task Manager CLI is a small, workshop-friendly command-line application for creating and managing tasks in memory. It provides CRUD operations (create, read, update, delete) for tasks that include title, description, status, priority, and timestamps. Users can filter tasks by status or priority and sort results by priority or creation date. The project targets Node.js 20+ and uses only built-in Node.js modules.

**User Stories**

1. As a user, I want to create a new task so that I can track work I need to do.
   - Acceptance criteria:
     - The CLI supports a `create` command accepting `title`, optional `description`, and optional `priority`.
     - New tasks default to `status: todo` when not specified.
     - `createdAt` and `updatedAt` are set on creation.

2. As a user, I want to list all tasks so I can see my current work items.
   - Acceptance criteria:
     - The CLI supports a `list` command that prints tasks in a readable table or list.
     - By default, tasks are listed sorted by `createdAt` descending.

3. As a user, I want to update a task so I can change its status, priority, title, or description.
   - Acceptance criteria:
     - The CLI supports an `update <id>` command with flags to change `title`, `description`, `status`, and `priority`.
     - `updatedAt` is refreshed when a task is modified.
     - Validation enforces allowed `status` and `priority` values.

4. As a user, I want to delete a task so I can remove completed or irrelevant items.
   - Acceptance criteria:
     - The CLI supports a `delete <id>` command that removes the task from memory.
     - Deleting a non-existent id returns a useful error and non-zero exit code.

5. As a user, I want to filter tasks by `status` or `priority` so I can focus on a subset.
   - Acceptance criteria:
     - The `list` command accepts `--status` and `--priority` filters.
     - Combining filters (status + priority) returns the intersection.

6. As a user, I want to sort tasks by priority or creation date so I can prioritize work.
   - Acceptance criteria:
     - The `list` command accepts `--sort` with values `priority` or `createdAt` and optional `--order` (asc/desc).
     - Priority sort orders as high > medium > low when descending.

**Data Model**

- Task (entity)
  - `id`: string (UUID or incremental string)
  - `title`: string (required)
  - `description`: string (optional)
  - `status`: string enum {`todo`, `in-progress`, `done`} (default: `todo`)
  - `priority`: string enum {`low`, `medium`, `high`} (default: `medium`)
  - `createdAt`: ISO 8601 timestamp string
  - `updatedAt`: ISO 8601 timestamp string

Notes:
- Data is stored in memory only; no persistence between runs.
- Use simple utilities to generate `id` (e.g., timestamp-based id) to avoid external deps.

**File Structure**

Suggested layout under `src/`:

- `src/cli.js`: CLI entrypoint and argument parsing (uses `process.argv`).
- `src/tasks.js`: Task model operations (in-memory store, CRUD functions, filter/sort helpers).
- `src/storage.js`: Simple in-memory storage abstraction (wraps an array and exposes find/create/update/delete).
- `src/format.js`: Helpers for formatting output (table or compact list).
- `src/utils.js`: small helpers (id generation, timestamps, validation functions).
- `bin/taskmgr`: small executable wrapper that runs `node src/cli.js` (optional).
- `README.md`: usage and examples (project root).
- `docs/project-plan.md`: this plan.

CLI commands (examples):

- `taskmgr create --title "Buy milk" --description "2 liters" --priority high`
- `taskmgr list --status todo --sort priority --order desc`
- `taskmgr update 123 --status done`
- `taskmgr delete 123`

**Implementation Phases**

1. Initial scaffolding (2-3 hours)
   - Create project layout, `src/` files, and minimal `bin/taskmgr` runner.
   - Implement `utils.js` (id, timestamps, validation).

2. In-memory storage and model (2-3 hours)
   - Implement `storage.js` and `tasks.js` with full CRUD and filter/sort helpers.
   - Add unit test harness or simple manual test script (optional).

3. CLI and formatting (2-3 hours)
   - Implement `cli.js` argument parsing, map commands to `tasks.js` operations.
   - Implement `format.js` for readable output and human-friendly priority sorting.

4. Validation, edge cases, and polish (1-2 hours)
   - Input validation, helpful error messages, exit codes.
   - Improve UX: confirmations on delete (flag to bypass), clear examples in `README.md`.

5. Final review and handoff (30-60 minutes)
   - Walk through README usage examples, ensure no external dependencies, and verify Node.js 20+ compatibility.


Scope constraints:

- Data remains in memory; persistent storage is explicitly out of scope for this exercise.
- No external libraries; rely on Node.js built-ins only.

**Error Handling & Validation**

- Fail-fast conventions:
   - Validate inputs early and return a non-zero exit code on error.
   - Print concise, user-friendly error messages; avoid raw stack traces unless `--debug` is provided.
   - Use exit codes: `0` for success, `1` for resource errors (e.g., not found), `2` for invalid usage/validation, `3` for internal errors.

- CLI input validation rules:
   - `title`: required, non-empty string, max length 200 characters. Missing or empty -> exit `2` and message `"title is required"`.
   - `description`: optional string, max length 1000 characters; truncate or reject with exit `2` if excessively long.
   - `status`: optional, must be one of `todo`, `in-progress`, `done`; invalid value -> exit `2` and show allowed values.
   - `priority`: optional, must be one of `low`, `medium`, `high`; invalid value -> exit `2` and show allowed values.
   - `id` inputs: validate format (simple numeric or timestamp-based id) and return `1` if the referenced task doesn't exist.

- Command/flag parsing:
   - Unknown commands or flags print a short usage hint and exit `2`.
   - Missing required arguments print usage and an example invocation.

- Operation errors:
   - `update` or `delete` on a non-existent id prints `"task not found: <id>"` and exits `1`.
   - On failed internal operations (unexpected exceptions), print a short message and exit `3`. In `--debug` mode include the stack trace.

- UX considerations:
   - Prefer corrective suggestions in errors (e.g., show allowed `status` values when validation fails).
   - For destructive actions (delete) require `--yes` to skip confirmation, otherwise prompt interactively.

Saved: this document will live at `docs/project-plan.md` in the repository root.
