import { describe, it, expect } from 'vitest';
import { registerProviderCommand } from '../src/commands/provider.js';
import { Command } from 'commander';

describe('Provider Command Registration', () => {
  it('should attach the provider command with target option', () => {
    const program = new Command();
    registerProviderCommand(program);

    const providerCmd = program.commands.find((cmd) => cmd.name() === 'provider');
    expect(providerCmd).toBeDefined();
    expect(providerCmd.description()).toContain('Cloud & Infrastructure-as-Code');

    const targetOpt = providerCmd.options.find((opt) => opt.long === '--target');
    expect(targetOpt).toBeDefined();
  });
});
