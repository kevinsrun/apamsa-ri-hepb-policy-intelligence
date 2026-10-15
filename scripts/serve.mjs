import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const routes = new Map([
  ['/', ['src/web/index.html','text/html; charset=utf-8']],
  ['/index.html', ['src/web/index.html','text/html; charset=utf-8']],
  ['/src/web/app.mjs', ['src/web/app.mjs','text/javascript; charset=utf-8']],
  ['/api/data', ['data/processed/ri_hepb_analytical_dataset.json','application/json; charset=utf-8']],
  ['/src/clinical/guidelines.mjs', ['src/clinical/guidelines.mjs','text/javascript; charset=utf-8']],
]);
// Explicit public files only. No arbitrary repository/.git/raw-file fallback.
export async function startResearchServer({port=0}={}) {
  if (!Number.isSafeInteger(port) || port<0 || port>65535) throw new Error('Invalid local port');
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    try {
      const path=new URL(req.url,'http://127.0.0.1').pathname;
      const route=routes.get(path);if(!route){res.writeHead(404);res.end('Not found');return;}
      const body=await readFile(resolve(ROOT,route[0]));
      res.writeHead(200,{'Content-Type':route[1]});res.end(req.method==='HEAD'?undefined:body);
    }catch{res.writeHead(503,{'Content-Type':'application/json'});res.end('{"error":"Data unavailable; do not use cached scientific claims"}');}
  });
  await new Promise((done,fail)=>{server.once('error',fail);server.listen(port,'127.0.0.1',()=>{server.off('error',fail);done();});});
  const url=`http://127.0.0.1:${server.address().port}`;
  return {server,url};
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const {server,url}=await startResearchServer({port:Number(process.env.PORT??3000)});
  console.log(JSON.stringify({url,scope:'local research prototype, not clinical decision support'}));
  const stop=()=>{server.close();server.closeAllConnections();};process.once('SIGTERM',stop);process.once('SIGINT',stop);
}
