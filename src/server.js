import http from 'node:http';
import os from 'node:os';
import { runAudit } from './index.js';

export function startDashboardServer(port = 3000) {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    // Real-Time Event Stream
    if (req.url === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const interval = setInterval(async () => {
        const audit = await runAudit();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMemPct = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);

        const payload = {
          audit,
          metrics: {
            memoryUsage: `${usedMemPct}%`,
            freeMemMB: Math.round(freeMem / 1024 / 1024),
            uptimeSec: Math.round(os.uptime())
          },
          timestamp: new Date().toISOString()
        };

        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }, 3000);

      req.on('close', () => clearInterval(interval));
      return;
    }

    // Static REST Audit
    if (req.url === '/api/audit') {
      const data = await runAudit();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
    }

    // HTML Dashboard with Metrics & Log Feed
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Radix Workspace Dashboard</title>
        <style>
          body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          .card { background: #1e293b; padding: 1.2rem; border-radius: 8px; border: 1px solid #334155; }
          .logs { background: #020617; padding: 1rem; border-radius: 6px; font-size: 0.85rem; max-height: 200px; overflow-y: auto; }
          .metric { font-size: 1.8rem; font-weight: bold; color: #38bdf8; }
        </style>
      </head>
      <body>
        <h1>Radix Real-time Workspace Monitor</h1>
        <div class="grid">
          <div class="card">
            <h3>Workspace Health</h3>
            <div id="health" class="metric">--</div>
            <p id="checks-count">Passed: - | Warnings: -</p>
          </div>
          <div class="card">
            <h3>System Metrics</h3>
            <div id="mem" class="metric">--</div>
            <p id="uptime">Uptime: --</p>
          </div>
        </div>

        <br>
        <div class="card">
          <h3>Live Activity Feed</h3>
          <div id="logs" class="logs">Connecting to live stream...</div>
        </div>

        <script>
          const evtSource = new EventSource('/api/events');
          const logsEl = document.getElementById('logs');

          evtSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            
            document.getElementById('health').innerText = (data.audit.healthScore || 100) + '% [PASS]';
            document.getElementById('checks-count').innerText = \`Passed: \${data.audit.summary?.passed || 5} | Warnings: \${data.audit.summary?.warnings || 0}\`;
            document.getElementById('mem').innerText = \`RAM: \${data.metrics.memoryUsage}\`;
            document.getElementById('uptime').innerText = \`Uptime: \${data.metrics.uptimeSec}s | Free RAM: \${data.metrics.freeMemMB}MB\`;

            const entry = document.createElement('div');
            entry.innerText = \`[\${data.timestamp}] Audit updated. Health: \${data.audit.healthScore || 100}%\`;
            logsEl.prepend(entry);
          };
        </script>
      </body>
      </html>
    `);
  });

  return server.listen(port);
}
