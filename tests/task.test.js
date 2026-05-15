import assert from 'node:assert';
import { describe, it } from 'node:test';
import Task from '../src/models/task.js';
import { ValidationError } from '../src/utils/validators.js';

describe('Task model', () => {
  it('creates a task with defaults and serializes to JSON', () => {
    const t = new Task({ id: 'id-1', title: 'Test' });
    const j = t.toJSON();
    assert.strictEqual(j.id, 'id-1');
    assert.strictEqual(j.title, 'Test');
    assert.strictEqual(j.status, 'todo');
    assert.strictEqual(j.priority, 'medium');
    assert.ok(j.createdAt);
    assert.ok(j.updatedAt);
  });

  it('updates fields and refreshes updatedAt', async () => {
    const t = new Task({ id: 'id-2', title: 'Orig' });
    const before = t.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    t.update({ title: 'New', priority: 'high' });
    assert.strictEqual(t.title, 'New');
    assert.strictEqual(t.priority, 'high');
    assert.notStrictEqual(t.updatedAt, before);
  });

  it('throws on invalid title', () => {
    assert.throws(() => new Task({ id: 'x', title: '   ' }), ValidationError);
  });
});
