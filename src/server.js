import http from 'node:http';
import { runAudit } from './index.js'; // or './commands/audit.js' based on your index structure

export function startDashboardServer(port = 3000) {
  const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    // 1. SSE Stream Endpoint
    if (req.url === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const interval = setInterval(async () => {
        const data = await runAudit();
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }, 3000);

      req.on('close', () => clearInterval(interval));
      return;
    }

    // 2. Static Audit REST Endpoint
    if (req.url === '/api/audit') {
      const data = await runAudit();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
    }

    // Fallback HTML Dashboard
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Radix Workspace Dashboard</title>
        <style>
          body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 2rem; }
          .card { background: #1e293b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <h1>Radix Real-time Workspace Monitor</h1>
        <div id="status" class="card">Connecting to SSE stream...</div>

        <script>
          const evtSource = new EventSource('/api/events');
          evtSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            document.getElementById('status').innerHTML = \`
              <h3>Health Score: \${data.healthScore || data.score}%</h3>
            \`;
          };
        </script>
      </body>
      </html>
    `);
  });

  return server.listen(port);
}
