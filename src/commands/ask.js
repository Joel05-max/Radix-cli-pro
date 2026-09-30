import * as p from '@clack/prompts';
import chalk from 'chalk';

export async function registerAskCommand(program) {
  program
    .command('ask')
    .description('Interactive infrastructure assistant and query engine')
    .argument('[query...]', 'Natural language infrastructure question')
    .action(async (queryWords) => {
      p.intro(chalk.bold.cyan('🤖 Radix AI & Infrastructure Assistant'));

      let query = queryWords ? queryWords.join(' ') : '';

      if (!query) {
        query = await p.text({
          message: 'What infrastructure problem or task can I help you resolve?',
          placeholder: 'e.g., How do I inspect failing pods in Kubernetes?',
          validate(value) {
            if (value.length === 0) return 'Please enter a valid question or command.';
          },
        });
      }

      if (p.isCancel(query)) {
        p.cancel('Query cancelled.');
        return;
      }

      const s = p.spinner();
      s.start('Analyzing query context...');

      // Simulated context parsing engine for CLI infrastructure tasks
      setTimeout(() => {
        s.stop(chalk.green('✔ Context analyzed successfully.'));

        console.log('\n' + chalk.bold.underline('Suggested Action Plan:'));
        
        const lower = query.toLowerCase();
        if (lower.includes('docker') || lower.includes('container')) {
          console.log(` • Run ${chalk.cyan('radix docker')} to perform engine & container health scans.`);
          console.log(` • Run ${chalk.cyan('radix fix')} to purge dangling volumes and unused images.`);
        } else if (lower.includes('k8s') || lower.includes('pod') || lower.includes('cluster') || lower.includes('kubernetes')) {
          console.log(` • Run ${chalk.cyan('radix k8s')} to check failed/evicted cluster pods.`);
          console.log(` • Run ${chalk.cyan('radix fix --auto')} to automatically clean failed states.`);
        } else {
          console.log(` • Run ${chalk.cyan('radix docker')} or ${chalk.cyan('radix k8s')} for targeted diagnostics.`);
          console.log(` • Use ${chalk.cyan('radix fix')} to run auto-remediation routines.`);
        }

        p.outro(chalk.bold.green('Assistant session completed.'));
      }, 600);
    });
}
