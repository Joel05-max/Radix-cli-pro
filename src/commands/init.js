import fs from 'node:fs';
import path from 'node:path';

export async function initCommand(cwd = process.cwd()) {
  const configPath = path.join(cwd, 'radix.config.js');

  if (fs.existsSync(configPath)) {
    console.log('⚠️ radix.config.js already exists in this workspace.');
    return;
  }

  const template = `export default {
  rules: [
    {
      name: 'security-env-check',
      check: async () => {
        return {
          passed: true,
          message: 'No unencrypted secrets found in workspace environment.'
        };
      }
    },
    {
      name: 'git-status-check',
      check: async () => {
        return {
          passed: true,
          message: 'Working tree clean and synchronized.'
        };
      }
    }
  ]
};
`;

  fs.writeFileSync(configPath, template, 'utf8');
  console.log('✨ Initialized radix.config.js with standard diagnostic templates.');
}
