---
applyTo: "src/services/**"
---

# Service File Instructions

- Export functions, not classes.
- Every function that modifies data must return the modified object.
- Return copies of data, never direct references to internal state.
- Throw descriptive errors for "not found" and "invalid input" cases.
- Keep functions small. Each function handles one operation.