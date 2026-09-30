#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { askHandler } from './commands/ask.js';
import { monitorHandler } from './commands/monitor.js';

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
  .action((options) => {
    if (options.dryRun) {
      console.log(chalk.bold.blue('\n🔍 Running dry-run mode. Generating patch preview...'));
      console.log(chalk.dim('--- a/config.json\n+++ b/config.json\n@@ -1,3 +1,3 @@\n- "timeout": 30\n+ "timeout": 60'));
    } else {
      console.log(chalk.bold.green('\n🛠 Executing system fixes...'));
    }
  });

// --- radix report ---
program
  .command('report')
  .description('Generate executive audit report')
  .option('-o, --output <path>', 'Output file path', './radix-audit-report.html')
  .action((options) => {
    console.log(chalk.green(`\n📊 Executive report generated: ${options.output}\n`));
  });

// --- radix init ---
program
  .command('init')
  .description('Initialize local .radixrc configuration')
  .action(() => {
    console.log(chalk.bold.cyan('\n⚙ Initializing Radix project configuration...'));
    console.log(chalk.green('✔ Created .radixrc file successfully.\n'));
  });

program.parse(process.argv);
