#!/usr/bin/env node

import { Command } from 'commander';
import { auditCommand } from '../src/commands/audit.js';

const program = new Command();

program
  .name('radix')
  .description('Radix CLI - Workspace Diagnostics Engine')
  .version('1.0.0');

program
  .command('audit')
  .description('Run workspace diagnostic checks')
  .option('--json', 'Output results as structured JSON string')
  .action(async (options) => {
    await auditCommand(options);
  });

program.parse(process.argv);
