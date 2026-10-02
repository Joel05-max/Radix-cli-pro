import { execSync } from 'node:child_process';

export async function runProviderAudit() {
  const activeProviders = [];

  // Check AWS CLI context
  try {
    execSync('aws sts get-caller-identity', { stdio: 'ignore' });
    activeProviders.push('AWS');
  } catch {}

  // Check GCP CLI context
  try {
    execSync('gcloud auth list --filter=status:ACTIVE --format="value(account)"', { stdio: 'ignore' });
    activeProviders.push('GCP');
  } catch {}

  // Check Azure CLI context
  try {
    execSync('az account show', { stdio: 'ignore' });
    activeProviders.push('Azure');
  } catch {}

  if (activeProviders.length === 0) {
    return {
      name: 'provider',
      status: 'PASS',
      message: 'No active cloud provider CLI credentials detected (skipped).'
    };
  }

  return {
    name: 'provider',
    status: 'PASS',
    message: `Active credentials validated for: ${activeProviders.join(', ')}.`
  };
}
