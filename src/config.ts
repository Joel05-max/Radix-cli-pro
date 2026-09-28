import fs from 'fs/promises';
import path from 'path';

export interface RadixConfig {
  $schema?: string;
  projectId: string;
  projectName: string;
  workspaceSlug: string;
  branch: string;
  automatedProtection: boolean;
  notifications: {
    channel: 'email' | 'slack' | 'webhook' | 'in_app';
    recipient: string;
  };
  auditRules: {
    ignorePaths: string[];
    failSeverity: 'info' | 'warning' | 'critical';
  };
}

export const CONFIG_FILE_NAME = 'radix.json';

export async function writeRadixConfig(config: RadixConfig, targetDir: string = '.'): Promise<string> {
  const filePath = path.resolve(targetDir, CONFIG_FILE_NAME);
  const jsonContent = JSON.stringify(config, null, 2);
  await fs.writeFile(filePath, jsonContent, 'utf-8');
  return filePath;
}

export async function configExists(targetDir: string = '.'): Promise<boolean> {
  const filePath = path.resolve(targetDir, CONFIG_FILE_NAME);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
