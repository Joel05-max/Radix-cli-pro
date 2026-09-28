#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { handleInitCommand } from './commands/init.js';
import { pool } from './db.js';
import { AuditRunner } from './auditRunner.js';
const program = new Command();
program
    .name('radix')
    .description('Radix Platform CLI - System diagnostics & automated audit engine')
    .version('1.0.0');
program
    .command('init')
    .description('Interactively initialize a radix.json configuration file')
    .option('-f, --force', 'Overwrite existing radix.json without prompting')
    .action(async (options) => {
    await handleInitCommand(options);
});
program
    .command('audit')
    .description('Run a local security and health audit on the current workspace project')
    .option('-p, --project-id <uuid>', 'Target Radix Project UUID')
    .option('-d, --dir <path>', 'Path to project root directory', '.')
    .action(async (options) => {
    console.log(chalk.bold.cyan('\n  --- RADIX AUDIT ENGINE ---\n'));
    const spinner = ora('Initializing audit job...').start();
    const runner = new AuditRunner(options.projectId);
    try {
        const jobId = await runner.createJob();
        spinner.succeed(`Audit job created (ID: ${chalk.dim(jobId)})`);
        const auditSpinner = ora('Scanning repository and running diagnostic tree...').start();
        const result = await runner.runAudit(jobId, options.dir);
        if (result.status === 'passed') {
            auditSpinner.succeed(chalk.green(`Audit PASSED! Health Score: ${result.health_score}/100`));
        }
        else {
            auditSpinner.warn(chalk.yellow(`Audit FAULT DETECTED! Health Score: ${result.health_score}/100`));
        }
        console.log('\n' + chalk.bold('Diagnostic Summary:'));
        console.log(`  ${chalk.bold('Symptom:')}    ${result.surface_symptom}`);
        console.log(`  ${chalk.bold('Root Cause:')} ${result.isolated_root_cause}`);
    }
    catch (err) {
        spinner.fail(chalk.red(`Audit execution failed: ${err.message}`));
    }
    finally {
        await pool.end();
    }
});
program.parse(process.argv);
