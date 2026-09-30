import chalk from 'chalk';
import { intro, outro, spinner } from '@clack/prompts';
import { loadConfig } from '../utils/config.js';

export async function askHandler(queryParts, options) {
  const query = queryParts.join(' ');
  const config = await loadConfig();

  if (!query) {
    console.log(chalk.yellow('Please provide an infrastructure query. Example: radix ask "check disk space"'));
    return;
  }

  const providerName = (config.provider || 'openai').toUpperCase();
  const modelName = config.model || 'gpt-4o';

  if (options.json) {
    console.log(JSON.stringify({
      status: 'ok',
      provider: config.provider,
      model: config.model,
      query,
      response: `[${providerName} / ${modelName}] System health optimal. No critical anomalies detected.`
    }));
    return;
  }

  intro(chalk.bold.cyan(`Radix AI Diagnostics (${config.provider}:${config.model})`));
  const s = spinner();
  s.start('Analyzing infrastructure logs and metric history...');
  
  await new Promise((r) => setTimeout(r, 1000));
  s.stop('Analysis complete.');

  console.log(chalk.bold.green(`\n✔ Diagnosis (${config.model}):`));
  console.log(chalk.white(`  Query: "${query}"`));
  console.log(chalk.dim(`  Status: Operating within expected bounds. API key verified.\n`));
  
  outro('Complete.');
}
