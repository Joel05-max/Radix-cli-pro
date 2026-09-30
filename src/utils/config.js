import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const CONFIG_PATH = path.join(os.homedir(), '.radixrc');

const DEFAULT_CONFIG = {
  provider: 'openai',
  model: 'gpt-4o',
  apiKey: process.env.RADIX_API_KEY || null,
  telemetryInterval: 3
};

export async function loadConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (err) {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}
