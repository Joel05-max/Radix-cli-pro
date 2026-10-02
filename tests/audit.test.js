import test from 'node:test';
import assert from 'node:assert/strict';
import { runAudit } from '../src/commands/audit.js';

test('runAudit returns valid audit schema', async () => {
  const result = await runAudit();

  assert.ok(result.timestamp, 'Timestamp should exist');
  assert.equal(typeof result.score, 'number', 'Score should be a number');
  assert.equal(typeof result.summary.totalChecks, 'number', 'totalChecks should be a number');
  assert.ok(result.summary.totalChecks >= 5, 'Should execute at least 5 checks');
  assert.equal(result.checks.packageJson.status, 'PASS', 'package.json check should pass');
});
