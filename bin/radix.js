#!/usr/bin/env node

import { Command } from 'commander';
import { auditCommand } from '../src/commands/audit.js';
import { registerAskCommand } from '../src/commands/ask.js';
import { startDashboardServer } from '../src/server.js';

const program = new Command();

program
  .name('radix')
  .description('Radix Workspace Diagnostic Engine')
  .version('1.0.0');

program
  .command('audit')
  .description('Run live diagnostics against the current workspace')
  .option('--json', 'Output results as JSON')
  .action(auditCommand);

// Register ask command via Commander registration function
registerAskCommand(program);

program
  .command('ui')
  .description('Start the Web Dashboard UI server')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .action((options) => {
    startDashboardServer(parseInt(options.port, 10));
  });

program.parse(process.argv);
