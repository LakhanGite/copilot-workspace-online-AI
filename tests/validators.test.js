import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateId,
  ValidationError,
} from '../src/utils/validators.js';

describe('validators', () => {
  it('validateTitle accepts normal titles and rejects empty/long', () => {
    const ok = validateTitle('Hello');
    assert.strictEqual(ok, 'Hello');
    assert.throws(() => validateTitle('   '), ValidationError);
    const long = 'x'.repeat(201);
    assert.throws(() => validateTitle(long), ValidationError);
  });

  it('validateDescription accepts optional and rejects too long', () => {
    assert.strictEqual(validateDescription(undefined), '');
    assert.strictEqual(validateDescription(null), '');
    assert.strictEqual(validateDescription('desc'), 'desc');
    const long = 'a'.repeat(1001);
    assert.throws(() => validateDescription(long), ValidationError);
  });

  it('validateStatus and validatePriority accept allowed values and reject others', () => {
    assert.strictEqual(validateStatus(undefined), 'todo');
    assert.strictEqual(validateStatus('In-Progress'), 'in-progress');
    assert.throws(() => validateStatus('unknown'), ValidationError);
    assert.strictEqual(validatePriority(undefined), 'medium');
    assert.strictEqual(validatePriority('HIGH'), 'high');
    assert.throws(() => validatePriority('super'), ValidationError);
  });

  it('validateId accepts valid ids and rejects bad ones', () => {
    assert.strictEqual(validateId('abc-123'), 'abc-123');
    assert.throws(() => validateId(''), ValidationError);
    assert.throws(() => validateId(123), ValidationError);
    assert.throws(() => validateId('a'.repeat(65)), ValidationError);
  });
});
