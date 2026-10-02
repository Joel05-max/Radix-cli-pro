import test from 'node:test';
import assert from 'node:assert/strict';
import { startDashboardServer } from '../src/server.js';

test('startDashboardServer starts HTTP server and responds on /api/audit', async () => {
  const server = startDashboardServer(0); // Port 0 assigns a random free port
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/api/audit`);
  const data = await res.json();

  assert.equal(res.status, 200, 'HTTP status should be 200');
  assert.ok(data.timestamp, 'Response should contain audit timestamp');
  assert.equal(typeof data.score, 'number', 'Score should be a number');

  server.close();
});
