import { runDockerAudit } from './modules/docker.js';
import { runK8sAudit } from './modules/k8s.js';
import { runProviderAudit } from './modules/provider.js';
import { executePlugins } from './plugins.js';

export async function runAudit() {
  const checks = [];

  // Core diagnostics
  checks.push(await runDockerAudit());
  checks.push(await runK8sAudit());
  checks.push(await runProviderAudit());

  // Dynamic custom plugins
  const pluginResults = await executePlugins();
  checks.push(...pluginResults);

  const passed = checks.filter(c => c.status === 'PASS').length;
  const warnings = checks.filter(c => c.status === 'WARN').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;

  const total = checks.length;
  const healthScore = total > 0 ? Math.round((passed / total) * 100) : 100;

  return {
    healthScore,
    summary: { total, passed, warnings, failed },
    checks
  };
}

export { auditCommand } from './commands/audit.js';
