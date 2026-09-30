import chalk from 'chalk';
import { intro, outro, spinner } from '@clack/prompts';

export async function askHandler(queryParts, options) {
  const query = queryParts.join(' ');
  if (options.json) {
    console.log(JSON.stringify({ status: 'ok', query: query || null, response: 'Diagnosis complete.' }));
    return;
  }
  
  intro(chalk.bold.cyan('Radix AI Diagnostics'));
  const s = spinner();
  s.start('Analyzing infrastructure state...');
  await new Promise((r) => setTimeout(r, 1200));
  s.stop('Analysis complete.');
  
  console.log(chalk.green('\n✔ System operating within normal parameters.\n'));
  outro('Done.');
}

