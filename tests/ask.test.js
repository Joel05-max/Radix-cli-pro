import test from 'node:test';
import assert from 'node:assert/strict';
import { registerAskCommand } from '../src/commands/ask.js';

test('askCommand - Execution & Response Handling', async (t) => {
  await t.test('initializes and exports registration function correctly', () => {
    assert.strictEqual(typeof registerAskCommand, 'function');
  });
});
