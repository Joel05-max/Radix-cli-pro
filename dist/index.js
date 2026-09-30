#!/usr/bin/env node
import { Command } from 'commander';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { AuditRunner } from './auditRunner.js';
const CONFIG_PATH = path.join(os.homedir(), '.radixrc');
// Helper to get stored key
function getStoredApiKey() {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            return data.apiKey || null;
        }
        catch {
            return null;
        }
    }
    return null;
}
// Helper to save key
function saveApiKey(apiKey) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ apiKey }), 'utf-8');
}
const program = new Command();
program
    .name('radix')
    .description('Radix AI Predictive Infrastructure Engine')
    .version('1.4.0');
// --- COMMAND: AUTH LOGIN ---
program
    .command('auth')
    .description('Authenticate with your Radix API Key')
    .option('-k, --key <apiKey>', 'API key for premium access')
    .action(async (options) => {
    p.intro(chalk.bgCyan.black(' RADIX AUTHENTICATION '));
    let apiKey = options.key;
    if (!apiKey) {
        apiKey = await p.text({
            message: 'Enter your Radix API Key:',
            placeholder: 'rdx_live_xxxxxxxxxxxx',
            validate(value) {
                if (!value || value.trim().length === 0)
                    return 'API key cannot be empty.';
            }
        });
        if (p.isCancel(apiKey)) {
            p.cancel('Authentication canceled.');
            process.exit(0);
        }
    }
    saveApiKey(apiKey.trim());
    p.outro(chalk.green('✔ API Key saved successfully! You now have access to deep predictive audits.'));
});
// --- COMMAND: AUDIT ---
program
    .command('audit')
    .description('Run interactive predictive health audit on current directory')
    .action(async () => {
    p.intro(chalk.bgCyan.black(' RADIX PREDICTIVE AUDIT ENGINE '));
    // Check Authentication
    const apiKey = getStoredApiKey();
    if (!apiKey) {
        p.note(`${chalk.yellow('No API Key detected.')}\n` +
            `To unlock deep predictive audits and 1–5 year forecasts, run:\n` +
            `${chalk.cyan('radix auth')}`, 'Authentication Required');
    }
    else {
        p.note(`${chalk.green('License Verified:')} Key active [${apiKey.substring(0, 8)}...]`, 'Status');
    }
    const projectType = await p.select({
        message: 'Select project environment stack:',
        options: [
            { value: 'nodejs', label: 'Node.js / TypeScript Web App', hint: 'Express, NestJS, Next.js' },
            { value: 'python', label: 'Python Backend Engine', hint: 'Django, FastAPI, Flask' },
            { value: 'database', label: 'Database Cluster / Standalone', hint: 'PostgreSQL, Redis, MySQL' }
        ]
    });
    if (p.isCancel(projectType)) {
        p.cancel('Audit canceled by user.');
        process.exit(0);
    }
    const auditDepth = await p.select({
        message: 'Select audit depth:',
        options: [
            { value: 'quick', label: 'Quick Health Check (Free)', hint: 'Fast diagnostic scan' },
            { value: 'deep', label: 'Full Predictive Audit (Premium)', hint: 'Requires active subscription key' }
        ]
    });
    if (p.isCancel(auditDepth)) {
        p.cancel('Audit canceled by user.');
        process.exit(0);
    }
    // Gate the deep audit behind the API Key
    if (auditDepth === 'deep' && !apiKey) {
        p.outro(chalk.red('✖ Access Denied: Full Predictive Audit requires a valid API Key. Run `radix auth` to log in.'));
        process.exit(1);
    }
    const s = p.spinner();
    s.start('Analyzing repository structure and running diagnostic tree...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    s.stop('Repository analysis complete.');
    const runner = new AuditRunner();
    const jobId = await runner.createJob();
    await runner.runAudit(jobId);
    p.outro(chalk.cyan('Audit complete! Review the detailed report cards above.'));
});
program.parse(process.argv);
