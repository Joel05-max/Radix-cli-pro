import test from 'node:test';
import assert from 'node:assert';
import { startDashboardServer } from '../src/server.js';

test('Dashboard Server - REST & SSE endpoints', async (t) => {
  const server = startDashboardServer(0);
  const address = server.address();
  const port = address.port;

  await t.test('GET /api/audit returns valid audit structure', async () => {
    const res = await fetch(`http://localhost:${port}/api/audit`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(typeof body.healthScore === 'number');
    assert.ok(Array.isArray(body.checks));
    assert.ok(body.summary);
  });

  server.close();
});
