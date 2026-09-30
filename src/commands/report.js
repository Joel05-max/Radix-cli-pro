import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as p from '@clack/prompts';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function registerReportCommand(program) {
  program
    .command('report')
    .description('Generate an automated diagnostic health snapshot report')
    .option('-o, --output <path>', 'Output file path', 'radix-report.json')
    .action(async (options) => {
      p.intro(chalk.bold.cyan('📊 Radix Automated Diagnostic Report Generator'));

      const s = p.spinner();
      s.start('Gathering system and environment telemetry...');

      const reportData = {
        timestamp: new Date().toISOString(),
        system: {
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
          totalMemMB: Math.round(os.totalmem() / (1024 * 1024)),
          freeMemMB: Math.round(os.freemem() / (1024 * 1024)),
        },
        services: {
          docker: { status: 'unknown' },
          k8s: { status: 'unknown' },
        },
      };

      // Check Docker Daemon
      try {
        await execAsync('docker info');
        reportData.services.docker.status = 'active';
      } catch (err) {
        reportData.services.docker.status = 'unreachable';
      }

      // Check K8s Context
      try {
        const { stdout } = await execAsync('kubectl config current-context');
        reportData.services.k8s.status = 'active';
        reportData.services.k8s.context = stdout.trim();
      } catch (err) {
        reportData.services.k8s.status = 'unreachable';
      }

      s.stop(chalk.green('✔ Telemetry gathered successfully.'));

      s.start(`Writing report to ${options.output}...`);
      try {
        const targetPath = path.resolve(process.cwd(), options.output);
        await fs.writeFile(targetPath, JSON.stringify(reportData, null, 2), 'utf-8');
        s.stop(chalk.green(`✔ Diagnostic report generated at: ${chalk.bold(targetPath)}`));
      } catch (err) {
        s.stop(chalk.red(`✖ Failed to write report file: ${err.message}`));
      }

      p.outro(chalk.bold.green('Report generation pass finished cleanly!'));
    });
}
