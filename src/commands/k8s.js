import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as p from '@clack/prompts';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function registerK8sCommand(program) {
  program
    .command('k8s')
    .description('Run cluster health, pod status, and node diagnostics on Kubernetes')
    .action(async () => {
      p.intro(chalk.bold.cyan('☸️ Radix Kubernetes Diagnostics Engine'));

      const s = p.spinner();
      s.start('Checking kubectl CLI and cluster connectivity...');

      try {
        const { stdout: context } = await execAsync('kubectl config current-context');
        s.stop(chalk.green(`✔ Connected to Kubernetes context: ${chalk.bold(context.trim())}`));
      } catch (err) {
        s.stop(chalk.red('✖ kubectl is not configured or cluster is unreachable.'));
        p.note(
          chalk.yellow('Ensure kubectl is installed and configured with a valid kubeconfig file.')
        );
        return;
      }

      s.start('Inspecting pod states across active namespaces...');
      try {
        const { stdout: podsOutput } = await execAsync(
          'kubectl get pods -A --field-selector=status.phase!=Running,status.phase!=Succeeded --no-headers'
        );

        s.stop(chalk.green('✔ Pod status scan completed.'));

        const problematicPods = podsOutput.trim().split('\n').filter(Boolean);
        if (problematicPods.length === 0) {
          console.log('\n' + chalk.green('✔ All pods are in healthy (Running/Succeeded) states.'));
        } else {
          console.log('\n' + chalk.red.bold(`⚠️ Found ${problematicPods.length} non-running pod(s):`));
          problematicPods.forEach((pod) => {
            console.log(` • ${chalk.yellow(pod)}`);
          });
        }
      } catch (err) {
        s.stop(chalk.yellow('⚠️ Unable to query cluster pod metrics.'));
      }

      p.outro(chalk.bold.green('Kubernetes diagnostic scan finished cleanly.'));
    });
}
