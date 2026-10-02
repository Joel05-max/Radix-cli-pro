import http from 'http';
import { runAudit } from './commands/audit.js';

export function startDashboardServer(port = 3000) {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/api/audit') {
      const result = await runAudit();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }

    if (req.url === '/' || req.url === '/index.html') {
      const audit = await runAudit();
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Radix Workspace Dashboard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
    .card { background: #1e293b; border-radius: 8px; padding: 1.5rem; max-width: 600px; margin: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .status { font-weight: bold; padding: 0.25rem 0.75rem; border-radius: 4px; display: inline-block; }
    .PASS { background: #166534; color: #4ade80; }
    .WARN { background: #854d0e; color: #facc15; }
    .FAIL { background: #991b1b; color: #f87171; }
    ul { list-style: none; padding: 0; }
    li { background: #334155; margin: 0.5rem 0; padding: 0.75rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Radix Workspace Dashboard</h2>
    <p>Health Score: <strong>${audit.score}%</strong> <span class="status ${audit.status}">${audit.status}</span></p>
    <p><small>Workspace: ${audit.workspace}</small></p>
    <h3>Diagnostics Summary</h3>
    <ul>
      ${Object.entries(audit.checks).map(([key, check]) => `
        <li>
          <strong>${key}:</strong> <span class="status ${check.status}">${check.status}</span>
          <div><small>${check.message}</small></div>
        </li>
      `).join('')}
    </ul>
  </div>
</body>
</html>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(port, () => {
    console.log(`\nDashboard running at http://localhost:${port}`);
  });

  return server;
}
