---
description: Add edge case tests for an existing test file
agent: tester
argument-hint: Path to the existing test file
---

# Add Edge Case Tests

Review the existing test file the user provides. Add tests for any
edge cases not already covered.

Focus on:
- Boundary values (empty arrays, max integers, very long strings)
- Type mismatches (passing a number where a string is expected)
- Concurrent modifications (adding while iterating)
- Missing optional fields
- Duplicate entries

Run all tests after adding the new cases and fix any failures.