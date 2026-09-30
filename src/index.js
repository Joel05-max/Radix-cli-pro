#!/usr/bin/env node

import { Command } from 'commander';
import { registerDockerCommand } from './commands/docker.js';

const program = new Command();

program
  .name('radix')
  .description('Radix CLI Engine')
  .version('1.4.0');

// Register diagnostic commands
registerDockerCommand(program);

program.parse(process.argv);
