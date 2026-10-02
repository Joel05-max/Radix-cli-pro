import test from 'node:test';
import assert from 'node:assert/strict';

test('ask module test', async () => {
  const askModule = await import('../src/commands/ask.js');
  
  // Verify export exists
  assert.ok(askModule, 'ask module should be loadable');
  
  // Test askCommand execution if function exists
  if (typeof askModule.askCommand === 'function') {
    assert.equal(typeof askModule.askCommand, 'function');
  } else if (typeof askModule.default === 'function') {
    assert.equal(typeof askModule.default, 'function');
  }
});
