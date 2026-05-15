/**
 * Validation helpers for Task Manager
 */

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const STATUS = ['todo', 'in-progress', 'done'];
const PRIORITY = ['low', 'medium', 'high'];

/**
 * Validate and normalize a title.
 * @param {any} title
 * @returns {string}
 */
export function validateTitle(title) {
  if (typeof title !== 'string') throw new ValidationError('title must be a string');
  const s = title.trim();
  if (!s) throw new ValidationError('title is required');
  if (s.length > 200) throw new ValidationError('title too long (max 200)');
  return s;
}

/**
 * Validate and normalize a description.
 * @param {any} description
 * @returns {string}
 */
export function validateDescription(description) {
  if (description === undefined || description === null) return '';
  if (typeof description !== 'string') throw new ValidationError('description must be a string');
  if (description.length > 1000) throw new ValidationError('description too long (max 1000)');
  return description;
}

/**
 * Validate and normalize status.
 * @param {any} status
 * @returns {string}
 */
export function validateStatus(status) {
  if (status === undefined || status === null) return 'todo';
  const s = String(status).toLowerCase();
  if (!STATUS.includes(s)) throw new ValidationError(`invalid status: must be one of ${STATUS.join(', ')}`);
  return s;
}

/**
 * Validate and normalize priority.
 * @param {any} priority
 * @returns {string}
 */
export function validatePriority(priority) {
  if (priority === undefined || priority === null) return 'medium';
  const p = String(priority).toLowerCase();
  if (!PRIORITY.includes(p)) throw new ValidationError(`invalid priority: must be one of ${PRIORITY.join(', ')}`);
  return p;
}

/**
 * Validate id format.
 * @param {any} id
 * @returns {string}
 */
export function validateId(id) {
  if (typeof id !== 'string') throw new ValidationError('id must be a string');
  const s = id.trim();
  if (!s) throw new ValidationError('id is required');
  if (s.length > 64) throw new ValidationError('id too long');
  if (!/^[a-zA-Z0-9-_:.;]+$/.test(s)) throw new ValidationError('id contains invalid characters');
  return s;
}

export { ValidationError, STATUS, PRIORITY };
