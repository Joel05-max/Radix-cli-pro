import test from 'node:test';
import assert from 'node:assert';
import { initI18n, t, getActiveLocale } from '../src/i18n/index.js';

test('i18n Module - Locale Detection & Translation', async (tContext) => {
  await tContext.test('loads default English translations', () => {
    initI18n();
    const title = t('cli.title');
    assert.strictEqual(typeof title, 'string');
    assert.ok(title.includes('Radix CLI Pro'));
  });

  await tContext.test('interpolates variables into keys', () => {
    const message = t('cli.unknown_cmd', { cmd: 'foobar' });
    assert.ok(message.includes('foobar'));
  });
});
