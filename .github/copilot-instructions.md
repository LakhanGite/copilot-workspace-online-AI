# Task Manager - Project Conventions

## Language and Runtime

- JavaScript, Node.js 20+.
- Use ES module syntax (`import`/`export`), not CommonJS (`require`).

## Code Style

- Use 2-space indentation.
- Use single quotes for strings.
- Use `const` by default; use `let` only when reassignment is needed. Never use `var`.
- Add JSDoc comments to all exported functions and classes.

## Error Handling

- Use `try/catch` blocks around operations that may fail.
- Throw `Error` objects with descriptive messages. Do not throw plain strings.
- Log errors with `console.error`, not `console.log`.

## Data Model

- The Task entity has: id, title, description, status (todo/in-progress/done),
  priority (low/medium/high), createdAt, updatedAt.
- Store all data in memory using plain JavaScript data structures.

## Testing

- Use the built-in Node.js `assert` module.
- Test files end with `.test.js`.
- Each test function tests exactly one behavior.