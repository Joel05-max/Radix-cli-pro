import { describe, it, expect } from 'vitest';
import { registerDockerCommand } from '../src/commands/docker.js';
import { Command } from 'commander';

describe('Docker Diagnostic Command Registration', () => {
  it('should attach the docker command to the program instance', () => {
    const program = new Command();
    registerDockerCommand(program);

    const dockerCmd = program.commands.find((cmd) => cmd.name() === 'docker');
    expect(dockerCmd).toBeDefined();
    expect(dockerCmd.description()).toContain('automated health');
  });
});
