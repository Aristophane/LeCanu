import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!path.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
    const content = await readFile(path);
    res.writeHead(200, {'Content-Type': types[extname(path)] || 'application/octet-stream'});
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4187, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4187'));
