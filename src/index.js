const notifyCommand = require('./commands/notify');

// ... existing CLI command definitions ...

program
  .command('notify')
  .description('Broadcast execution reports and remediation status across multi-channel webhooks')
  .option('-c, --channel <channel>', 'Target channel (e.g., slack, msteams, webhook)')
  .option('-m, --message <message>', 'Custom notification message body')
  .option('-t, --title <title>', 'Notification header/title')
  .option('-s, --severity <severity>', 'Severity level (INFO, WARNING, CRITICAL)', 'INFO')
  .option('-r, --report <filepath>', 'Path to compliance snapshot or audit report JSON')
  .action(async (options) => {
    await notifyCommand(options);
  });
