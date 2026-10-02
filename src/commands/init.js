import fs from 'node:fs/promises';
import path from 'node:path';
import { t } from '../i18n/index.js';

export async function initCommand() {
  const configPath = path.join(process.cwd(), 'radix.json');

  const defaultConfig = {
    version: "2.2.0",
    language: "auto",
    channels: [],
    rules: {
      docker: true,
      k8s: true,
      monitoring: true
    }
  };

  try {
    await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), { flag: 'wx' });
    console.log(`✅ ${t('init.success', { path: 'radix.json' })}`);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log(`⚠️  ${t('init.already_exists', { path: 'radix.json' })}`);
    } else {
      console.error(`❌ ${t('init.error', { error: err.message })}`);
    }
  }
}
