import test from 'node:test';
import assert from 'node:assert';
import { runAudit } from '../src/index.js';
import { runFix } from '../src/fix.js';
import { initI18n } from '../src/i18n/index.js';

test('commands module - multi-language integration checks', async (t) => {
  await initI18n();

  await t.test('audit command executes and returns localized structure', async () => {
    const auditRes = await runAudit();
    assert.strictEqual(auditRes.status, 'healthy');
    assert.strictEqual(auditRes.healthScore, 100);
    assert.ok(Array.isArray(auditRes.checks));
  });

  await t.test('fix command executes and returns localized message', async () => {
    const fixRes = await runFix(true);
    assert.strictEqual(fixRes.applied, true);
    assert.strictEqual(fixRes.auto, true);
    assert.ok(typeof fixRes.message === 'string');
  });
});
