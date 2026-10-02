import test from 'node:test';
import assert from 'node:assert';
import { askAI } from '../src/ask.js';

test('ask module - localized AI diagnostic responses', async (t) => {
  await t.test('returns English response by default', async () => {
    const res = await askAI('check memory', { lang: 'en' });
    assert.strictEqual(res.success, true);
    assert.ok(res.answer.includes('[AI Diagnostic]'));
  });

  await t.test('returns German localized response', async () => {
    const res = await askAI('check memory', { lang: 'de' });
    assert.strictEqual(res.success, true);
    assert.ok(res.answer.includes('[KI-Diagnose]'));
  });

  await t.test('returns Spanish localized response', async () => {
    const res = await askAI('check memory', { lang: 'es' });
    assert.strictEqual(res.success, true);
    assert.ok(res.answer.includes('[Diagnóstico IA]'));
  });

  await t.test('returns French localized response', async () => {
    const res = await askAI('check memory', { lang: 'fr' });
    assert.strictEqual(res.success, true);
    assert.ok(res.answer.includes('[Diagnostic IA]'));
  });
});
