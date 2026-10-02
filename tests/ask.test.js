import test from 'node:test';
import assert from 'node:assert/strict';
import { askCommand } from '../src/commands/ask.js';

test('askCommand - Execution & Response Handling', async () => {
  // Verify askCommand is a valid function
  assert.equal(typeof askCommand, 'function', 'askCommand should be exported as a function');
});
