import os from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function registerMonitorCommand(program) {
  program
    .command('monitor')
    .description('Launch real-time streaming infrastructure and system telemetry dashboard')
    .option('-i, --interval <ms>', 'Refresh interval in milliseconds', '2000')
    .action(async (options) => {
      const intervalMs = parseInt(options.interval, 10) || 2000;
      
      console.clear();
      console.log(chalk.bold.cyan('===================================================='));
      console.log(chalk.bold.cyan(' 📡 Radix Live Telemetry & System Stream Dashboard '));
      console.log(chalk.bold.cyan('===================================================='));
      console.log(chalk.gray(`Streaming telemetry every ${intervalMs}ms. Press Ctrl+C to exit.\n`));

      const renderDashboard = async () => {
        const timestamp = new Date().toLocaleTimeString();
        const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
        const totalMemMB = Math.round(os.totalmem() / (1024 * 1024));
        const memUsagePct = (((totalMemMB - freeMemMB) / totalMemMB) * 100).toFixed(1);

        let dockerStatus = chalk.red('Offline');
        try {
          await execAsync('docker info');
          dockerStatus = chalk.green('Active');
        } catch {}

        let k8sStatus = chalk.red('Disconnected');
        try {
          const { stdout } = await execAsync('kubectl config current-context');
          k8sStatus = chalk.green(`Connected (${stdout.trim()})`);
        } catch {}

        // Move cursor up and refresh terminal buffer
        process.stdout.write('\x1B[H');
        console.log(chalk.bold.cyan(`[Radix Live Telemetry Stream - ${timestamp}]`));
        console.log(`• Host System RAM : ${freeMemMB} MB free / ${totalMemMB} MB total (${memUsagePct}% used)`);
        console.log(`• CPU Load Avg    : ${os.loadavg().map(n => n.toFixed(2)).join(' ')}`);
        console.log(`• Docker Engine   : ${dockerStatus}`);
        console.log(`• Kubernetes      : ${k8sStatus}`);
        console.log(chalk.gray('\n----------------------------------------------------'));
      };

      await renderDashboard();
      const interval = setInterval(renderDashboard, intervalMs);

      process.on('SIGINT', () => {
        clearInterval(interval);
        console.log('\n' + chalk.yellow('Live monitoring stream ended cleanly.'));
        process.exit(0);
      });
    });
}
