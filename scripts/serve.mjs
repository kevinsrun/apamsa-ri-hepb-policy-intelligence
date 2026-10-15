import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`[HTTP] ${req.method} ${url.pathname}`);

  try {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const content = await readFile(resolve(ROOT, 'src/web/index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
      return;
    }

    if (url.pathname === '/api/data') {
      const content = await readFile(resolve(ROOT, 'data/processed/ri_hepb_analytical_dataset.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(content);
      return;
    }

    // Static file fallback
    const filePath = resolve(ROOT, `.${url.pathname}`);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`Not found: ${url.pathname}`);
  }
});

server.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`  APAMSA Rhode Island Hepatitis B Platform Server Running!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Data API: http://localhost:${PORT}/api/data`);
  console.log(`================================================================\n`);
});
