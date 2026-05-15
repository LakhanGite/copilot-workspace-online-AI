---
description: Generate unit tests for a source module
agent: tester
argument-hint: Path to the source file to test (e.g. src/models/task.js)
---

# Generate Unit Tests

Your goal is to generate unit tests for the module the user specifies.

## Steps

1. Read the target source file.
2. Identify all exported functions and classes.
3. Generate tests that cover:
   - Normal inputs with expected outputs
   - Edge cases (empty strings, zero, negative numbers, null, undefined)
   - Error conditions (invalid types, missing required fields)
4. Use the built-in Node.js `node:assert` module and Node.js test runner.
5. Save the test file to `tests/` using the convention `<module>.test.js`.
6. Run the tests with `node --test` and fix any failures.