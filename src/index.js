#!/usr/bin/env node

import { Command } from 'commander';
import { registerDockerCommand } from './commands/docker.js';
import { registerK8sCommand } from './commands/k8s.js';

const program = new Command();

program
  .name('radix')
  .description('Radix CLI Engine')
  .version('1.4.0');

// Register diagnostic commands
registerDockerCommand(program);
registerK8sCommand(program);

program.parse(process.argv);
