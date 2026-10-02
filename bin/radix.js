#!/usr/bin/env node

import { runAudit } from '../src/index.js';
import { startDashboardServer } from '../src/server.js';
import { runFix } from '../src/fix.js';
import { initCommand } from '../src/commands/init.js';

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
Radix CLI Pro - Modular Diagnostic & Remediation Engine (v2.1.0)

Usage:
  radix <command> [options]

Commands:
  audit          Run workspace health checks and dynamic plugins
  init           Scaffold a standard radix.config.js plugin config
  fix [--auto]   Execute remediation strategies (interactive or automated)
  ask <query>    Query AI diagnostics for technical recommendations
  ui             Start real-time SSE web telemetry dashboard (Port 3000)

Options:
  -v, --version  Show current version
  -h, --help     Display help manual
  `);
  process.exit(0);
}

if (command === '-v' || command === '--version') {
  console.log('Radix CLI Pro v2.1.0');
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
    await runFix(args.includes('--auto'));
    break;
  case 'ui':
    startDashboardServer(3000);
    console.log('🚀 Radix Dashboard listening at http://localhost:3000');
    break;
  default:
    console.error(`Unknown command: ${command}. Run "radix --help" for usage.`);
    process.exit(1);
}
