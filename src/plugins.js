import fs from 'node:fs';
import path from 'node:path';

export async function loadCustomPlugins(cwd = process.cwd()) {
  const customRules = [];
  const configPath = path.join(cwd, 'radix.config.js');

  if (fs.existsSync(configPath)) {
    try {
      const userConfig = await import(`file://${configPath}`);
      if (Array.isArray(userConfig.default?.rules)) {
        customRules.push(...userConfig.default.rules);
      }
    } catch (err) {
      console.warn(`[Plugins] Failed to load radix.config.js: ${err.message}`);
    }
  }

  return customRules;
}

export async function executePlugins(cwd = process.cwd()) {
  const plugins = await loadCustomPlugins(cwd);
  const results = [];

  for (const plugin of plugins) {
    try {
      const res = await plugin.check();
      results.push({
        name: plugin.name || 'custom-plugin',
        status: res.passed ? 'PASS' : 'WARN',
        message: res.message || 'Custom check completed.'
      });
    } catch (err) {
      results.push({
        name: plugin.name || 'custom-plugin',
        status: 'FAIL',
        message: `Plugin execution error: ${err.message}`
      });
    }
  }

  return results;
}
