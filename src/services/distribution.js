import fs from 'fs';
import https from 'https';
import http from 'http';

export class DistributionService {
  constructor(configPath = 'radix.json') {
    this.config = this.loadConfig(configPath);
  }

  loadConfig(path) {
    try {
      if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data).distribution || {};
      }
    } catch (err) {
      console.warn(`[Distribution] Warning: Could not parse config at ${path}`);
    }
    return {};
  }

  async notify(payload, channelOverride = null) {
    const channels = channelOverride 
      ? [channelOverride] 
      : Object.keys(this.config.channels || {});

    if (channels.length === 0) {
      console.log('[Distribution] No notification channels configured.');
      return;
    }

    const results = [];
    for (const ch of channels) {
      const channelConfig = this.config.channels?.[ch] || { type: ch };
      try {
        const res = await this.dispatch(ch, channelConfig, payload);
        results.push({ channel: ch, success: true, res });
      } catch (error) {
        console.error(`[Distribution] Failed to send via ${ch}:`, error.message);
        results.push({ channel: ch, success: false, error: error.message });
      }
    }
    return results;
  }

  async dispatch(channelName, config, payload) {
    const url = config.url || process.env[`RADIX_${channelName.toUpperCase()}_WEBHOOK`];
    if (!url) {
      throw new Error(`Missing webhook URL for channel '${channelName}'`);
    }

    let body = {};
    if (config.type === 'slack') {
      body = {
        text: `*Radix Engine Alert: ${payload.title || 'Remediation Event'}*\n${payload.message}`,
        attachments: payload.details ? [{ color: payload.severity === 'CRITICAL' ? '#FF0000' : '#36a64f', fields: payload.details }] : []
      };
    } else if (config.type === 'msteams') {
      body = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": payload.title || "Radix Notification",
        "themeColor": payload.severity === 'CRITICAL' ? "FF0000" : "0076D7",
        "title": payload.title || "Radix Engine Notification",
        "text": payload.message
      };
    } else {
      body = payload;
    }

    return this.postRequest(url, body);
  }

  postRequest(targetUrl, body) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const urlObj = new URL(targetUrl);
      const client = urlObj.protocol === 'https:' ? https : http;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = client.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

export default DistributionService;
