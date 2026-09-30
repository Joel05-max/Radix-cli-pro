import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as p from '@clack/prompts';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function registerDockerCommand(program) {
  program
    .command('docker')
    .description('Run automated health, container, and resource diagnostics on Docker')
    .action(async () => {
      p.intro(chalk.bold.cyan('🐳 Radix Docker Diagnostics Engine'));

      const s = p.spinner();
      s.start('Checking Docker daemon availability...');

      try {
        await execAsync('docker info');
        s.stop(chalk.green('✔ Docker daemon is running and reachable.'));
      } catch (err) {
        s.stop(chalk.red('✖ Docker engine is not accessible or not running.'));
        p.note(
          chalk.yellow('Ensure Docker is installed and your user has permission to access the socket.')
        );
        return;
      }

      s.start('Inspecting active containers and health checks...');
      try {
        const { stdout: psOutput } = await execAsync(
          'docker ps --format "{{.ID}}|{{.Names}}|{{.Status}}|{{.Image}}"'
        );

        const containers = psOutput
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [id, name, status, image] = line.split('|');
            return { id, name, status, image };
          });

        s.stop(chalk.green(`Found ${containers.length} running container(s).`));

        if (containers.length > 0) {
          console.log('\n' + chalk.underline.bold('Container Status Summary:'));
          containers.forEach((c) => {
            const isUnhealthy = c.status.toLowerCase().includes('unhealthy');
            const statusFormatted = isUnhealthy
              ? chalk.red(c.status)
              : chalk.green(c.status);
            console.log(` • ${chalk.cyan(c.name)} (${chalk.dim(c.id)}) -> ${statusFormatted}`);
          });
        }
      } catch (err) {
        s.stop(chalk.yellow('⚠️ Unable to list containers.'));
      }

      s.start('Analyzing storage & dangling resources...');
      try {
        const { stdout: dfOutput } = await execAsync(
          'docker system df --format "{{.Type}}|{{.TotalCount}}|{{.Size}}|{{.Reclaimable}}"'
        );

        s.stop(chalk.green('✔ Storage analysis complete.'));
        console.log('\n' + chalk.underline.bold('Docker System Resource Usage:'));

        const rows = dfOutput.trim().split('\n').filter(Boolean);
        rows.forEach((row) => {
          const [type, total, size, reclaimable] = row.split('|');
          console.log(
            ` • ${chalk.bold(type)}: ${total} items | Size: ${chalk.yellow(
              size
            )} | Reclaimable: ${chalk.green(reclaimable)}`
          );
        });
      } catch (err) {
        s.stop(chalk.yellow('⚠️ Unable to retrieve system storage metrics.'));
      }

      p.outro(chalk.bold.green('Docker diagnostic scan finished cleanly.'));
    });
}

