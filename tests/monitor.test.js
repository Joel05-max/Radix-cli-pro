import { describe, it, expect } from 'vitest';
import { registerMonitorCommand } from '../src/commands/monitor.js';
import { Command } from 'commander';

describe('Monitor Command Registration', () => {
  it('should attach the monitor command with interval option', () => {
    const program = new Command();
    registerMonitorCommand(program);

    const monitorCmd = program.commands.find((cmd) => cmd.name() === 'monitor');
    expect(monitorCmd).toBeDefined();
    expect(monitorCmd.description()).toContain('real-time');

    const intervalOpt = monitorCmd.options.find((opt) => opt.long === '--interval');
    expect(intervalOpt).toBeDefined();
  });
});
