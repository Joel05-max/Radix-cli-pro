#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { askHandler } from './commands/ask.js';
import { monitorHandler } from './commands/monitor.js';
import { initHandler } from './commands/init.js';
import { fixHandler } from './commands/fix.js';
import { reportHandler } from './commands/report.js';

const program = new Command();

program
  .name('radix')
  .description(chalk.cyan('⚡ Radix CLI - Predictive Infrastructure Engine & AI Auto-Remediation'))
  .version('1.4.0', '-v, --version', 'Output the current version');

// --- radix ask ---
program
  .command('ask')
  .description('Conversational AI issue diagnosis')
  .argument('[query...]', 'Natural language infrastructure query')
  .option('--json', 'Output results in JSON format')
  .action(askHandler);

// --- radix monitor ---
program
  .command('monitor')
  .description('Live server telemetry stream with AI alerts')
  .option('--interval <seconds>', 'Polling interval in seconds', '3')
  .action(monitorHandler);

// --- radix fix ---
program
  .command('fix')
  .description('Interactive auto-patch engine')
  .option('--dry-run', 'Preview patch diffs without modifying disk')
  .action(fixHandler);

// --- radix report ---
program
  .command('report')
  .description('Generate executive audit report')
  .option('-o, --output <path>', 'Output file path', './radix-audit-report.html')
  .action(reportHandler);

// --- radix init ---
program
  .command('init')
  .description('Initialize local .radixrc configuration')
  .action(initHandler);

program.parse(process.argv);
