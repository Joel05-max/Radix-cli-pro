const DistributionService = require('../services/distribution');
const fs = require('fs');
const path = require('path');

/**
 * CLI Command Handler for Multi-Channel Distribution
 */
async function notifyCommand(options) {
  const distribution = new DistributionService();

  let payload = {
    title: options.title || 'Radix Engine Diagnostic & Remediation Report',
    severity: options.severity || 'INFO',
    message: options.message || 'Automated execution notification from Radix Engine CLI.',
    details: []
  };

  // If a report file is provided, load summary details
  if (options.report) {
    const reportPath = path.resolve(options.report);
    if (fs.existsSync(reportPath)) {
      try {
        const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        payload.message += `\nLoaded report from: ${options.report}`;
        if (reportData.summary) {
          payload.details.push({
            title: 'Summary',
            value: JSON.stringify(reportData.summary, null, 2)
          });
        }
      } catch (err) {
        console.warn(`[Notify] Could not parse report JSON at ${reportPath}:`, err.message);
      }
    } else {
      console.warn(`[Notify] Specified report file not found: ${reportPath}`);
    }
  }

  console.log(`[Notify] Broadcasting notification via target channel(s)...`);
  const results = await distribution.notify(payload, options.channel || null);

  if (results && results.length > 0) {
    results.forEach(res => {
      if (res.success) {
        console.log(`✓ [${res.channel}] Notification delivered successfully.`);
      } else {
        console.error(`✗ [${res.channel}] Delivery failed: ${res.error}`);
      }
    });
  } else {
    console.log('[Notify] No notifications were sent. Check your radix.json channels configuration.');
  }
}

module.exports = notifyCommand;
