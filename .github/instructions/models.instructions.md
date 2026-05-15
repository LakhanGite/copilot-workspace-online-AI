---
applyTo: "src/models/**"
---

# Model File Instructions

- Export a single class per file.
- Validate all constructor arguments. Throw a `TypeError` with a
  descriptive message for invalid inputs.
- Include a `toJSON()` method that returns a plain object.
- Generate unique IDs using `crypto.randomUUID()`.
- Add JSDoc comments to the class and every public method.