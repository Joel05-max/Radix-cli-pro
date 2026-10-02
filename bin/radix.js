kcat << 'EOF' > bin/radix.js
#!/usr/bin/env node

import { runAudit } from '../src/index.js';
import { startDashboardServer } from '../src/server.js';
import * as fixModule from '../src/fix.js';
import { askAI } from '../src/ask.js';
import { initCommand } from '../src/commands/init.js';
import { initI18n, t, getActiveLocale } from '../src/i18n/index.js';

initI18n();

const runFixFn = fixModule.runFix || fixModule.default || fixModule.executeFix || (() => {});

const args = process.argv.filter(arg => !arg.startsWith('--lang=')).slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
${t('cli.title')} (v2.2.0)

${t('cli.usage')}
  radix <command> [options]

${t('cli.commands')}
  audit          ${t('cli.cmd_audit')}
  init           ${t('cli.cmd_init')}
  fix [--auto]   ${t('cli.cmd_fix')}
  ask <query>    ${t('cli.cmd_ask')}
  ui             ${t('cli.cmd_ui')}

${t('cli.options')}
  -v, --version  Show current version
  -h, --help     Display help manual
  --lang=<code>  Set language (en, de, es, fr)
  `);
  process.exit(0);
}

if (command === '-v' || command === '--version') {
  console.log('Radix CLI Pro v2.2.0');
  process.exit(0);
}

switch (command) {
  case 'init':
    await initCommand();
    break;
  case 'audit':
    await runAudit();
    break;
  case 'fix':
    await runFixFn(args.includes('--auto'));
    break;
  case 'ask': {
    const query = args.slice(1).join(' ');
    const result = await askAI(query, { lang: getActiveLocale() });
    console.log(result.answer || result.error);
    break;
  }
  case 'ui':
    startDashboardServer(3000);
    console.log('🚀 Radix Dashboard listening at http://localhost:3000');
    break;
  default:
    console.error(t('cli.unknown_cmd', { cmd: command }));
    process.exit(1);
}
EOF
