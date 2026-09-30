import { describe, it, expect } from 'vitest';
import { registerAskCommand } from '../src/commands/ask.js';
import { Command } from 'commander';

describe('Ask Diagnostic Assistant Command Registration', () => {
  it('should attach the ask command to the program instance', () => {
    const program = new Command();
    registerAskCommand(program);

    const askCmd = program.commands.find((cmd) => cmd.name() === 'ask');
    expect(askCmd).toBeDefined();
    expect(askCmd.description()).toContain('assistant');
  });
});
