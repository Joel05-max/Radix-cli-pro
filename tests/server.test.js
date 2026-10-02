import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { startDashboardServer } from '../src/server.js';

test('Dashboard Server - REST & SSE endpoints', (t, done) => {
  const port = 3005;
  startDashboardServer(port);

  http.get(`http://localhost:${port}/api/audit`, (res) => {
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json');
    done();
  });
});
