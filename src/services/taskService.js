import Task from '../models/task.js';
import { validateId } from '../utils/validators.js';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const store = [];

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create a new task and store it in memory.
 * @param {object} input
 */
export function createTask(input) {
  const id = generateId();
  const task = new Task({ ...input, id });
  store.push(task);
  return task;
}

export function getTask(id) {
  const key = validateId(id);
  const t = store.find((x) => x.id === key) || null;
  return t;
}

export function updateTask(id, patch) {
  const key = validateId(id);
  const t = store.find((x) => x.id === key);
  if (!t) throw new NotFoundError(`task not found: ${id}`);
  t.update(patch);
  return t;
}

export function deleteTask(id) {
  const key = validateId(id);
  const idx = store.findIndex((x) => x.id === key);
  if (idx === -1) throw new NotFoundError(`task not found: ${id}`);
  store.splice(idx, 1);
  return true;
}

/**
 * List tasks with optional filtering and sorting.
 * @param {object} [opts]
 * @param {object} [opts.filter]
 * @param {string} [opts.sort] - 'priority' or 'createdAt'
 * @param {string} [opts.order] - 'asc' or 'desc'
 */
export function listTasks(opts = {}) {
  const { filter = {}, sort = 'createdAt', order = 'desc' } = opts;
  let result = store.slice();
  if (filter.status) {
    result = result.filter((t) => t.status === String(filter.status).toLowerCase());
  }
  if (filter.priority) {
    result = result.filter((t) => t.priority === String(filter.priority).toLowerCase());
  }

  if (sort === 'priority') {
    const rank = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => rank[a.priority] - rank[b.priority]);
  } else if (sort === 'createdAt') {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (order === 'desc') result.reverse();
  return result;
}

export { NotFoundError };
