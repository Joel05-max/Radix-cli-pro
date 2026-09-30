import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as p from '@clack/prompts';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function registerFixCommand(program) {
  program
    .command('fix')
    .description('Automated multi-platform system remediation and resource cleanup')
    .option('--auto', 'Bypass prompts and execute all recommended auto-remediations')
    .action(async (options) => {
      p.intro(chalk.bold.cyan('🛠️ Radix Auto-Remediation Engine'));

      const auto = options.auto || false;

      // 1. Docker Cleanup Strategy
      let runDockerFix = auto;
      if (!auto) {
        runDockerFix = await p.confirm({
          message: 'Prune dangling Docker images, volumes, and stopped containers?',
          initialValue: true,
        });
      }

      if (p.isCancel(runDockerFix)) {
        p.cancel('Operation cancelled.');
        return;
      }

      if (runDockerFix) {
        const s = p.spinner();
        s.start('Pruning dangling Docker system resources...');
        try {
          const { stdout } = await execAsync('docker system prune -f');
          s.stop(chalk.green('✔ Docker system prune completed successfully.'));
        } catch (err) {
          s.stop(chalk.yellow('⚠️ Docker engine not active or permission denied; skipped.'));
        }
      }

      // 2. Kubernetes Stuck Pod Purge Strategy
      let runK8sFix = auto;
      if (!auto) {
        runK8sFix = await p.confirm({
          message: 'Purge failed or evicted Kubernetes pods across namespaces?',
          initialValue: false,
        });
      }

      if (p.isCancel(runK8sFix)) {
        p.cancel('Operation cancelled.');
        return;
      }

      if (runK8sFix) {
        const s = p.spinner();
        s.start('Scanning for evicted or failed Kubernetes pods...');
        try {
          const purgeCmd =
            'kubectl delete pods --field-selector=status.phase=Failed -A --ignore-not-found';
          await execAsync(purgeCmd);
          s.stop(chalk.green('✔ Kubernetes failed pod purge executed.'));
        } catch (err) {
          s.stop(chalk.yellow('⚠️ kubectl not configured or cluster unreachable; skipped.'));
        }
      }

      p.outro(chalk.bold.green('Auto-remediation pass completed cleanly!'));
    });
}
