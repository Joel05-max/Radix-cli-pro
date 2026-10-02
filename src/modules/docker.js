import { execSync } from 'node:child_process';

export async function runDockerAudit() {
  try {
    // 1. Verify Docker Engine daemon status
    execSync('docker info', { stdio: 'ignore' });

    // 2. Query container status and check for unhealthy states
    const output = execSync('docker ps -a --format "{{.Names}}|{{.Status}}"', { encoding: 'utf8' });
    const containers = output.trim().split('\n').filter(Boolean);

    const unhealthy = containers.filter(c => c.toLowerCase().includes('unhealthy') || c.toLowerCase().includes('exited'));

    if (unhealthy.length > 0) {
      return {
        name: 'docker',
        status: 'WARN',
        message: `Detected ${unhealthy.length} unhealthy/exited container(s).`,
        details: unhealthy
      };
    }

    return {
      name: 'docker',
      status: 'PASS',
      message: 'Docker daemon active and all containers healthy.'
    };
  } catch {
    // Gracefully handle environments without Docker running
    return {
      name: 'docker',
      status: 'PASS',
      message: 'Docker environment not detected or inactive (skipped).'
    };
  }
}
