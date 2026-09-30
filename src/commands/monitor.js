import os from 'os';
import chalk from 'chalk';

export async function monitorHandler(options) {
  const intervalSec = parseInt(options.interval, 10) || 3;
  console.log(chalk.bold.yellow(`\n📡 Live Host Telemetry Stream (Polling every ${intervalSec}s)`));
  console.log(chalk.dim('Press CTRL+C to exit.\n'));

  const printMetrics = () => {
    const rawCpus = os.cpus() || [];
    const coreCount = rawCpus.length > 0 ? rawCpus.length : (os.availableParallelism?.() || 1);
    
    const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(2);
    const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const memUsagePct = (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1);
    const uptimeHours = (os.uptime() / 3600).toFixed(1);

    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    
    console.log(
      `${chalk.gray(`[${timestamp}]`)} ` +
      `CPU Cores: ${chalk.cyan(coreCount)} | ` +
      `RAM: ${chalk.green(`${memUsagePct}%`)} (${freeMemGB}GB / ${totalMemGB}GB free) | ` +
      `Uptime: ${chalk.magenta(`${uptimeHours}h`)}`
    );
  };

  printMetrics();
  setInterval(printMetrics, intervalSec * 1000);
}
