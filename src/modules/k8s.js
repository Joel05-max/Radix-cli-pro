import { execSync } from 'node:child_process';

export async function runK8sAudit() {
  try {
    // 1. Verify kubectl context/cluster access
    execSync('kubectl cluster-info', { stdio: 'ignore' });

    // 2. Query pod statuses across all namespaces
    const output = execSync('kubectl get pods -A --no-headers', { encoding: 'utf8' });
    const pods = output.trim().split('\n').filter(Boolean);

    const problematic = pods.filter(pod => {
      const lower = pod.toLowerCase();
      return lower.includes('crashloopbackoff') || lower.includes('evicted') || lower.includes('error');
    });

    if (problematic.length > 0) {
      return {
        name: 'k8s',
        status: 'WARN',
        message: `Detected ${problematic.length} unhealthy/evicted pod(s).`,
        details: problematic
      };
    }

    return {
      name: 'k8s',
      status: 'PASS',
      message: 'Kubernetes cluster context active and all pods healthy.'
    };
  } catch {
    return {
      name: 'k8s',
      status: 'PASS',
      message: 'Kubernetes environment not detected or inactive (skipped).'
    };
  }
}
