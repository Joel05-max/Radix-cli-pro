import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as p from '@clack/prompts';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function registerProviderCommand(program) {
  program
    .command('provider')
    .description('Run Cloud & Infrastructure-as-Code (AWS, Terraform, Systemd) diagnostic scans')
    .option('--target <name>', 'Target provider to check (aws, terraform, systemd, all)', 'all')
    .action(async (options) => {
      p.intro(chalk.bold.cyan('☁️ Radix Cloud & IaC Provider Diagnostics'));

      const s = p.spinner();
      const results = {};

      if (options.target === 'all' || options.target === 'aws') {
        s.start('Checking AWS CLI configuration and identity...');
        try {
          const { stdout } = await execAsync('aws sts get-caller-identity');
          results.aws = chalk.green(`Active (${JSON.parse(stdout).Arn || 'Authenticated'})`);
        } catch (err) {
          results.aws = chalk.yellow('AWS CLI not configured or missing credentials');
        }
      }

      if (options.target === 'all' || options.target === 'terraform') {
        s.start('Checking Terraform CLI status...');
        try {
          const { stdout } = await execAsync('terraform version');
          const firstLine = stdout.split('\n')[0];
          results.terraform = chalk.green(`Available (${firstLine})`);
        } catch (err) {
          results.terraform = chalk.yellow('Terraform binary not found or non-executable');
        }
      }

      if (options.target === 'all' || options.target === 'systemd') {
        s.start('Checking Linux systemd init engine...');
        try {
          await execAsync('systemctl is-system-running');
          results.systemd = chalk.green('Systemd operational');
        } catch (err) {
          results.systemd = chalk.yellow('Systemd unavailable (container/Android environment detected)');
        }
      }

      s.stop(chalk.green('✔ Provider diagnostic pass completed.'));

      console.log('\n' + chalk.bold.underline('Diagnostic Findings:'));
      if (results.aws) console.log(`• AWS Cloud         : ${results.aws}`);
      if (results.terraform) console.log(`• Terraform IaC     : ${results.terraform}`);
      if (results.systemd) console.log(`• Systemd Init      : ${results.systemd}`);

      p.outro(chalk.bold.green('Provider scan finished cleanly!'));
    });
}
