import { input, select, confirm } from '@inquirer/prompts';
import ora from 'ora';
import chalk from 'chalk';
import { testConnection, pool } from '../db.js';
import { writeRadixConfig, configExists } from '../config.js';
export async function handleInitCommand(options) {
    console.log(chalk.bold.cyan('\n  --- RADIX INTERACTIVE SETUP ---\n'));
    const alreadyExists = await configExists();
    if (alreadyExists && !options.force) {
        const overwrite = await confirm({
            message: 'radix.json already exists in this directory. Do you want to overwrite it?',
            default: false,
        });
        if (!overwrite) {
            console.log(chalk.yellow('Setup aborted. Existing radix.json preserved.'));
            return;
        }
    }
    let workspaceSlug = 'default-workspace';
    let projectId = '';
    let projectName = '';
    const dbConnected = await testConnection();
    if (dbConnected) {
        const spinner = ora('Fetching available workspaces and projects...').start();
        try {
            const wsResult = await pool.query('SELECT name, slug FROM workspaces ORDER BY created_at DESC LIMIT 10');
            spinner.stop();
            if (wsResult.rows.length > 0) {
                workspaceSlug = await select({
                    message: 'Select a Workspace:',
                    choices: wsResult.rows.map((row) => ({
                        name: `${row.name} (${row.slug})`,
                        value: row.slug,
                    })),
                });
            }
            else {
                workspaceSlug = await input({
                    message: 'Enter your Workspace slug:',
                    default: 'my-team-workspace',
                });
            }
            const projResult = await pool.query(`SELECT p.id, p.name 
         FROM projects p 
         JOIN workspaces w ON p.workspace_id = w.id 
         WHERE w.slug = $1 
         ORDER BY p.created_at DESC`, [workspaceSlug]);
            if (projResult.rows.length > 0) {
                const selectedProj = await select({
                    message: 'Select a Project to link to this repository:',
                    choices: projResult.rows.map((row) => ({
                        name: row.name,
                        value: JSON.stringify({ id: row.id, name: row.name }),
                    })),
                });
                const parsed = JSON.parse(selectedProj);
                projectId = parsed.id;
                projectName = parsed.name;
            }
        }
        catch {
            spinner.fail('Failed to fetch records from database.');
        }
    }
    if (!projectId) {
        if (!dbConnected) {
            console.log(chalk.dim('ℹ Database connection offline. Falling back to manual parameters.'));
        }
        projectName = await input({
            message: 'Enter Project Name:',
            default: 'my-radix-service',
            validate: (val) => (val.trim().length > 0 ? true : 'Project name cannot be empty.'),
        });
        projectId = await input({
            message: 'Enter Project UUID:',
            default: '00000000-0000-0000-0000-000000000000',
        });
    }
    const branch = await input({
        message: 'Primary Git branch for audit monitoring:',
        default: 'main',
    });
    const automatedProtection = await confirm({
        message: 'Enable automated protection triggers on audit faults?',
        default: true,
    });
    const channel = await select({
        message: 'Preferred notification channel for audit alerts:',
        choices: [
            { name: 'Email', value: 'email' },
            { name: 'Slack Webhook', value: 'slack' },
            { name: 'Custom Webhook', value: 'webhook' },
            { name: 'In-App Only', value: 'in_app' },
        ],
    });
    const recipient = await input({
        message: channel === 'email' ? 'Alert recipient email:' : 'Webhook URL / Channel target:',
        default: channel === 'email' ? 'devops@company.com' : 'https://hooks.slack.com/services/...',
    });
    const failSeverity = await select({
        message: 'Minimum severity level that breaks CI builds:',
        choices: [
            { name: 'Critical (Only block on severe vulnerability/faults)', value: 'critical' },
            { name: 'Warning (Block on moderate issues)', value: 'warning' },
            { name: 'Info (Strict mode - block on any issue)', value: 'info' },
        ],
    });
    const config = {
        projectId,
        projectName,
        workspaceSlug,
        branch,
        automatedProtection,
        notifications: { channel, recipient },
        auditRules: {
            ignorePaths: ['node_modules', 'dist', '.git', 'coverage'],
            failSeverity,
        },
    };
    const spinner = ora('Writing radix.json configuration...').start();
    try {
        const savedPath = await writeRadixConfig(config);
        spinner.succeed(chalk.green('Successfully initialized Radix configuration!'));
        console.log(chalk.dim(`Config saved to: ${savedPath}\n`));
        console.log(JSON.stringify(config, null, 2));
    }
    catch (err) {
        spinner.fail(chalk.red(`Failed to save configuration: ${err.message}`));
    }
    finally {
        if (dbConnected) {
            await pool.end();
        }
    }
}
