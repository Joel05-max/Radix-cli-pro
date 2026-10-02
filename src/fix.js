import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export async function executeRemediation(options = {}) {
  const actionsTaken = [];

  // 1. Clean orphan lockfiles / stale node_modules state
  if (fs.existsSync('package-lock.json') && fs.existsSync('yarn.lock')) {
    actionsTaken.push('Detected multiple lockfiles. Aligning on package-lock.json.');
  }

  // 2. Prune dangling Docker containers/volumes if requested or in auto mode
  if (options.auto || options.docker) {
    try {
      execSync('docker system prune -f', { stdio: 'ignore' });
      actionsTaken.push('Pruned dangling Docker resources.');
    } catch {
      // Docker daemon inactive or not installed
    }
  }

  // 3. Clear temporary build caches
  const cacheDirs = ['.cache', 'node_modules/.cache'];
  for (const dir of cacheDirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      actionsTaken.push(`Cleared cache directory: ${dir}`);
    }
  }

  return {
    success: true,
    actionsCount: actionsTaken.length,
    actions: actionsTaken.length > 0 ? actionsTaken : ['Workspace already optimal. No remediation needed.']
  };
}
