import { validateTitle, validateDescription, validateStatus, validatePriority, validateId } from '../utils/validators.js';

/**
 * Task model representing a single task.
 */
export class Task {
  /**
   * @param {object} params
   * @param {string} params.id
   * @param {string} params.title
   * @param {string} [params.description]
   * @param {string} [params.status]
   * @param {string} [params.priority]
   * @param {string} [params.createdAt]
   * @param {string} [params.updatedAt]
   */
  constructor(params) {
    this.id = validateId(params.id);
    this.title = validateTitle(params.title);
    this.description = validateDescription(params.description);
    this.status = validateStatus(params.status);
    this.priority = validatePriority(params.priority);
    const now = params.createdAt || new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = params.updatedAt || now;
  }

  /**
   * Update mutable fields on the task.
   * @param {object} patch
   */
  update(patch = {}) {
    if (patch.title !== undefined) this.title = validateTitle(patch.title);
    if (patch.description !== undefined) this.description = validateDescription(patch.description);
    if (patch.status !== undefined) this.status = validateStatus(patch.status);
    if (patch.priority !== undefined) this.priority = validatePriority(patch.priority);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Task;
