import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method not allowed');
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');
    const target = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    const inside = relative(root, target);
    if (inside === '..' || inside.startsWith(`..${sep}`) || inside.startsWith(sep)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400);
    res.end('Unable to serve this file');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? 'Port 8080 is in use. Stop the other local server, then try npm start again.' : error.message);
  process.exitCode = 1;
});
server.listen(8080, '127.0.0.1', () => console.log('Smart Escape is running at http://localhost:8080. Press Ctrl+C to stop.'));
