import { describe, it, expect } from 'vitest';
import { registerK8sCommand } from '../src/commands/k8s.js';
import { Command } from 'commander';

describe('Kubernetes Diagnostic Command Registration', () => {
  it('should attach the k8s command to the program instance', () => {
    const program = new Command();
    registerK8sCommand(program);

    const k8sCmd = program.commands.find((cmd) => cmd.name() === 'k8s');
    expect(k8sCmd).toBeDefined();
    expect(k8sCmd.description()).toContain('cluster health');
  });
});
