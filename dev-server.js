const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = __dirname;
const port = Number(process.env.PORT || 8081);

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

const clients = new Set();
let reloadTimer = null;

const liveReloadSnippet = `
<script>
(() => {
  const protocol = location.protocol === 'https:' ? 'https' : 'http';
  const source = new EventSource(protocol + '://' + location.host + '/__livereload');
  source.addEventListener('reload', () => window.location.reload());
  source.onerror = () => {
    source.close();
    setTimeout(() => window.location.reload(), 1500);
  };
})();
</script>`;

function sendReload() {
  for (const client of clients) {
    client.write('event: reload\\n');
    client.write('data: now\\n\\n');
  }
}

function scheduleReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(sendReload, 120);
}

function safeJoin(base, requestedPath) {
  const resolved = path.resolve(base, `.${requestedPath}`);
  return resolved.startsWith(base) ? resolved : null;
}

function injectLiveReload(html) {
  if (html.includes('/__livereload')) return html;
  if (html.includes('</body>')) {
    return html.replace('</body>', `${liveReloadSnippet}</body>`);
  }
  return `${html}${liveReloadSnippet}`;
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

  if (reqUrl.pathname === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    });
    res.write('\\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

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

fs.watch(root, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  if (filename.includes('.git')) return;
  scheduleReload();
});

server.listen(port, () => {
  console.log(`Toree Farm dev server running at http://localhost:${port}`);
});
