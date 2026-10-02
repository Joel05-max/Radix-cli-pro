import * as p from '@clack/prompts';
import chalk from 'chalk';
import { executeRemediation } from '../fix.js';

export async function fixCommand(options) {
  p.intro(chalk.bold.cyan('🛠️  Radix Automated Remediation Engine'));

  if (!options.auto) {
    const shouldProceed = await p.confirm({
      message: 'Run automated remediation playbooks on the current workspace?'
    });

    if (p.isCancel(shouldProceed) || !shouldProceed) {
      p.cancel('Remediation canceled.');
      return;
    }
  }

  const spinner = p.spinner();
  spinner.start('Executing remediation strategies...');

  const result = await executeRemediation(options);
  spinner.stop(chalk.green('✔ Remediation complete.'));

  console.log('\n' + chalk.bold.underline('Actions Performed:'));
  result.actions.forEach(act => console.log(` • ${act}`));

  p.outro(chalk.bold.green('Workspace successfully optimized!'));
}
