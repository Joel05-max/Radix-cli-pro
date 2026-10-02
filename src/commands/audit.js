import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Core Diagnostic Engine - Runs live checks against the target workspace directory
 */
export async function runAudit(options = {}) {
  const startTime = Date.now();
  const targetDir = options.dir ? path.resolve(options.dir) : process.cwd();

  const auditResult = {
    timestamp: new Date().toISOString(),
    score: 100,
    status: 'PASS',
    durationMs: 0,
    workspace: targetDir,
    checks: {
      packageJson: { status: 'PASS', message: '' },
      dependencies: { status: 'PASS', message: '', total: 0, outdated: [] },
      environment: { status: 'PASS', message: '', leaksDetected: false },
      gitignore: { status: 'PASS', message: '' },
      gitRepository: { status: 'PASS', message: '', isClean: true }
    },
    summary: { totalChecks: 5, passed: 0, warnings: 0, failed: 0 }
  };

  // 1. Check package.json presence & structure
  let pkgData = null;
  try {
    const pkgPath = path.join(targetDir, 'package.json');
    const pkgRaw = await fs.readFile(pkgPath, 'utf8');
    pkgData = JSON.parse(pkgRaw);
    auditResult.checks.packageJson.message = 'Valid package.json present';
    auditResult.summary.passed += 1;
  } catch (err) {
    auditResult.checks.packageJson.status = 'FAIL';
    auditResult.checks.packageJson.message = `package.json invalid or missing: ${err.message}`;
    auditResult.summary.failed += 1;
    auditResult.score -= 40;
  }

  // 2. Scan Dependencies & Lockfile
  if (pkgData) {
    const deps = { ...pkgData.dependencies, ...pkgData.devDependencies };
    const depCount = Object.keys(deps).length;
    auditResult.checks.dependencies.total = depCount;

    try {
      const lockPath = path.join(targetDir, 'package-lock.json');
      await fs.access(lockPath);
      auditResult.checks.dependencies.message = `${depCount} dependencies analyzed. package-lock.json verified.`;
      auditResult.summary.passed += 1;
    } catch {
      auditResult.checks.dependencies.status = 'WARN';
      auditResult.checks.dependencies.message = `${depCount} dependencies analyzed, but missing package-lock.json`;
      auditResult.summary.warnings += 1;
      auditResult.score -= 10;
    }
  } else {
    auditResult.checks.dependencies.status = 'FAIL';
    auditResult.checks.dependencies.message = 'Skipped: package.json missing';
    auditResult.summary.failed += 1;
  }

  // 3. Scan for committed secret/env leaks
  try {
    const files = await fs.readdir(targetDir);
    const suspiciousEnvs = files.filter(f => f.startsWith('.env') && f !== '.env.example');
    if (suspiciousEnvs.length > 0) {
      auditResult.checks.environment.status = 'WARN';
      auditResult.checks.environment.leaksDetected = true;
      auditResult.checks.environment.message = `Active environment files found in working root: ${suspiciousEnvs.join(', ')}`;
      auditResult.summary.warnings += 1;
      auditResult.score -= 15;
    } else {
      auditResult.checks.environment.message = 'No raw .env exposure in root';
      auditResult.summary.passed += 1;
    }
  } catch (err) {
    auditResult.checks.environment.status = 'WARN';
    auditResult.checks.environment.message = `Unable to scan env: ${err.message}`;
    auditResult.summary.warnings += 1;
  }

  // 4. Check .gitignore integrity
  try {
    const gitignorePath = path.join(targetDir, '.gitignore');
    const gitignoreRaw = await fs.readFile(gitignorePath, 'utf8');
    
    const missingRules = [];
    if (!gitignoreRaw.includes('node_modules')) missingRules.push('node_modules');
    if (!gitignoreRaw.includes('.env')) missingRules.push('.env');

    if (missingRules.length > 0) {
      auditResult.checks.gitignore.status = 'WARN';
      auditResult.checks.gitignore.message = `.gitignore exists but missing standard rules: ${missingRules.join(', ')}`;
      auditResult.summary.warnings += 1;
      auditResult.score -= 10;
    } else {
      auditResult.checks.gitignore.message = 'Valid .gitignore found with essential rules (node_modules, .env)';
      auditResult.summary.passed += 1;
    }
  } catch {
    auditResult.checks.gitignore.status = 'WARN';
    auditResult.checks.gitignore.message = 'Missing .gitignore file in workspace root';
    auditResult.summary.warnings += 1;
    auditResult.score -= 15;
  }

  // 5. Inspect git status
  try {
    const gitStatus = execSync('git status --porcelain', { cwd: targetDir, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    if (gitStatus.trim().length > 0) {
      auditResult.checks.gitRepository.status = 'WARN';
      auditResult.checks.gitRepository.isClean = false;
      auditResult.checks.gitRepository.message = 'Uncommitted working directory changes detected';
      auditResult.summary.warnings += 1;
      auditResult.score -= 10;
    } else {
      auditResult.checks.gitRepository.message = 'Git tree is clean';
      auditResult.summary.passed += 1;
    }
  } catch (err) {
    auditResult.checks.gitRepository.status = 'WARN';
    auditResult.checks.gitRepository.isClean = false;
    auditResult.checks.gitRepository.message = 'Directory is not a git repository or git CLI unavailable';
    auditResult.summary.warnings += 1;
  }

  // Normalize final engine status
  if (auditResult.summary.failed > 0) auditResult.status = 'FAIL';
  else if (auditResult.summary.warnings > 0) auditResult.status = 'WARN';
  else auditResult.status = 'PASS';

  auditResult.score = Math.max(0, auditResult.score);
  auditResult.durationMs = Date.now() - startTime;

  return auditResult;
}

/**
 * CLI Command Handler
 */
export async function auditCommand(options = {}) {
  const result = await runAudit(options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return result;
  }

  console.log('\n--- RADIX WORKSPACE AUDIT ---');
  console.log(`Workspace:   ${result.workspace}`);
  console.log(`Health Score: ${result.score}% [${result.status}]`);
  console.log(`Checks:      ${result.summary.passed} Passed, ${result.summary.warnings} Warnings, ${result.summary.failed} Failed`);
  console.log(`Execution:   ${result.durationMs}ms\n`);

  return result;
}
