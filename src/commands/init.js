import { intro, outro, text, select } from '@clack/prompts';
import chalk from 'chalk';
import { saveConfig, loadConfig } from '../utils/config.js';

export async function initHandler() {
  intro(chalk.bold.cyan('⚡ Radix Engine Configuration Wizard'));

  const existingConfig = await loadConfig();

  const provider = await select({
    message: 'Select default AI Engine Provider:',
    options: [
      { value: 'openai', label: 'OpenAI (GPT-4o / GPT-4o-mini)' },
      { value: 'anthropic', label: 'Anthropic (Claude 3.5 Sonnet)' },
      { value: 'gemini', label: 'Google Gemini (Gemini 1.5 Pro)' },
      { value: 'ollama', label: 'Local Model (Ollama / Llama3)' }
    ],
    initialValue: existingConfig.provider || 'openai'
  });

  const model = await text({
    message: 'Enter target model name:',
    placeholder: 'gpt-4o',
    defaultValue: provider === 'anthropic' ? 'claude-3-5-sonnet' : provider === 'gemini' ? 'gemini-1.5-pro' : 'gpt-4o'
  });

  const apiKey = await text({
    message: 'Enter API Key (press Enter to use environment variable RADIX_API_KEY):',
    placeholder: 'sk-...',
    defaultValue: existingConfig.apiKey || ''
  });

  await saveConfig({
    provider,
    model,
    apiKey: apiKey || null,
    telemetryInterval: 3
  });

  console.log(chalk.green('\n✔ Saved configuration to ~/.radixrc successfully.\n'));
  outro('Radix CLI configured.');
}
