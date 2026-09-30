import { describe, it, expect } from 'vitest';
import { registerReportCommand } from '../src/commands/report.js';
import { Command } from 'commander';

describe('Report Generator Command Registration', () => {
  it('should attach the report command to the program instance', () => {
    const program = new Command();
    registerReportCommand(program);

    const reportCmd = program.commands.find((cmd) => cmd.name() === 'report');
    expect(reportCmd).toBeDefined();
    expect(reportCmd.description()).toContain('diagnostic health snapshot');
  });
});
