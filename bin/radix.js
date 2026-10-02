#!/usr/bin/env node

import { initI18n, t } from '../src/i18n/index.js';
import { runAudit } from '../src/index.js';
import { runFix } from '../src/fix.js';
import { askAI } from '../src/ask.js';

async function main() {
  const args = process.argv.slice(2);
  let lang = null;

  const langIdx = args.indexOf('--lang');
  if (langIdx !== -1 && args[langIdx + 1]) {
    lang = args[langIdx + 1];
  }

  await initI18n(lang);

  const command = args[0];

  if (args.includes('--version') || args.includes('-v')) {
    console.log('v2.2.0');
    return;
  }

  switch (command) {
    case 'audit':
      await runAudit();
      break;
    case 'fix':
      await runFix(args.includes('--auto'));
      break;
    case 'ask': {
      const prompt = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
      await askAI(prompt);
      break;
    }
    default:
      console.log(`Radix CLI Pro v2.2.0 - ${t('cli.welcome')}`);
      console.log(`\nUsage:\n  radix audit\n  radix fix [--auto]\n  radix ask "<query>"\n`);
      break;
  }
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
