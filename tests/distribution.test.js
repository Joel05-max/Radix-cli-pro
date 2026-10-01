import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import DistributionService from '../src/services/distribution.js';

test('DistributionService - Initialization & Configuration', async (t) => {
  await t.test('loads empty configuration gracefully when config file is missing', () => {
    const distribution = new DistributionService('non-existent-config.json');
    assert.deepEqual(distribution.config, {});
  });

  await t.test('loads valid distribution configuration from radix.json', () => {
    const distribution = new DistributionService('radix.json');
    assert.ok(distribution.config);
  });
});

test('DistributionService - Payload Formatting & Dispatch Rules', async (t) => {
  const distribution = new DistributionService('radix.json');

  await t.test('returns graceful message when no channels are configured', async () => {
    const results = await distribution.notify({
      title: 'Test Notification',
      message: 'Testing channel execution'
    }, 'non_existent_channel');

    assert.ok(Array.isArray(results));
    assert.strictEqual(results[0].success, false);
    assert.match(results[0].error, /Missing webhook URL/);
  });
});
