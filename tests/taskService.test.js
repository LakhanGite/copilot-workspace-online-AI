import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  listTasks,
  NotFoundError,
} from '../src/services/taskService.js';

describe('taskService', () => {
  it('creates and retrieves a task', () => {
    const t = createTask({ title: 'Svc Test', description: 'svc' });
    const got = getTask(t.id);
    assert.ok(got);
    assert.strictEqual(got.title, 'Svc Test');
  });

  it('updates a task and throws on missing id', () => {
    const t = createTask({ title: 'To Update' });
    const updated = updateTask(t.id, { status: 'done', priority: 'low' });
    assert.strictEqual(updated.status, 'done');
    assert.strictEqual(updated.priority, 'low');
    assert.throws(() => updateTask('no-id', { title: 'x' }), NotFoundError);
  });

  it('deletes a task and errors when deleting non-existent', () => {
    const t = createTask({ title: 'To Delete' });
    const id = t.id;
    const ok = deleteTask(id);
    assert.strictEqual(ok, true);
    assert.throws(() => deleteTask(id), NotFoundError);
  });

  it('listTasks supports filtering and sorting', () => {
    // ensure fresh items
    const a = createTask({ title: 'A', priority: 'high' });
    const b = createTask({ title: 'B', priority: 'low' });
    const c = createTask({ title: 'C', priority: 'medium' });
    const byPriorityDesc = listTasks({ sort: 'priority', order: 'desc' });
    // highest priority first
    assert.strictEqual(byPriorityDesc[0].priority, 'high');
    const filtered = listTasks({ filter: { priority: 'low' } });
    assert.ok(filtered.every((x) => x.priority === 'low'));
  });
});
