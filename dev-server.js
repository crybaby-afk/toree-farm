const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = __dirname;
const defaultPort = Number(process.env.PORT || 8081);
let currentPort = defaultPort;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const disableCachingSnippet = `
<script>
(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
  }
})();
</script>`;

function safeJoin(base, requestedPath) {
  const resolved = path.resolve(base, `.${requestedPath}`);
  return resolved.startsWith(base) ? resolved : null;
}

function injectLiveReload(html) {
  if (html.includes('navigator.serviceWorker.getRegistrations')) return html;
  if (html.includes('</body>')) {
    return html.replace('</body>', `${disableCachingSnippet}</body>`);
  }
  return `${html}${disableCachingSnippet}`;
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    if (ext === '.html') {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      });
      res.end(injectLiveReload(data.toString('utf8')));
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  let pathname = decodeURIComponent(reqUrl.pathname);
  if (pathname === '/') pathname = '/index.html';

  let filePath = safeJoin(root, pathname);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    serveFile(filePath, res);
  });
});

function startServer(port) {
  currentPort = port;
  server.listen(port, () => {
    console.log(`Toree Farm dev server running at http://localhost:${port}`);
  });
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    const nextPort = currentPort + 1;
    console.log(`Port in use. Retrying on http://localhost:${nextPort}`);
    setTimeout(() => startServer(nextPort), 150);
    return;
  }
  throw error;
});

startServer(defaultPort);
