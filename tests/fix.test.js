import { describe, it, expect } from 'vitest';
import { registerFixCommand } from '../src/commands/fix.js';
import { Command } from 'commander';

describe('Fix Diagnostic Command Registration', () => {
  it('should attach the fix command to the program instance with options', () => {
    const program = new Command();
    registerFixCommand(program);

    const fixCmd = program.commands.find((cmd) => cmd.name() === 'fix');
    expect(fixCmd).toBeDefined();
    expect(fixCmd.description()).toContain('remediation');
    
    const autoOption = fixCmd.options.find((opt) => opt.long === '--auto');
    expect(autoOption).toBeDefined();
  });
});
