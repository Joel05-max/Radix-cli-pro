#!/usr/bin/env node

import { Command } from 'commander';
import { registerDockerCommand } from './commands/docker.js';
import { registerK8sCommand } from './commands/k8s.js';
import { registerFixCommand } from './commands/fix.js';
import { registerAskCommand } from './commands/ask.js';
import { registerReportCommand } from './commands/report.js';
import { registerMonitorCommand } from './commands/monitor.js';
import { registerProviderCommand } from './commands/provider.js';

const program = new Command();

program
  .name('radix')
  .description('Radix CLI Engine')
  .version('1.5.0');

// Register all core diagnostic, monitoring, provider, remediation, and report commands
registerDockerCommand(program);
registerK8sCommand(program);
registerFixCommand(program);
registerAskCommand(program);
registerReportCommand(program);
registerMonitorCommand(program);
registerProviderCommand(program);

program.parse(process.argv);
