import { legacyDestination } from '../shared/legacy-redirects.js';
import { notFoundHtml } from '../shared/not-found.js';
import fs from 'node:fs';
import path from 'node:path';

// Match production navigation behavior in Vite dev and preview as well.
export function navigationRouting(req,res,next) {
  if (!['GET','HEAD'].includes(req.method) || !req.headers.accept?.includes('text/html')) return next();
  const url = new URL(req.url,'http://localhost');
  const destination = url.pathname==='/bn/index.html' ? '/' : legacyDestination(url.pathname);
  if (destination) {
    const [path,hash] = destination.split('#');
    res.writeHead(301,{Location:`${path}${url.search}${hash?`#${hash}`:''}`});
    return res.end();
  }
  if (['/','/index.html'].includes(url.pathname)) return next();
  // Vite module and development infrastructure are handled by Vite itself.
  if (/^\/(?:@|src\/|node_modules\/|\.netlify\/functions\/)/.test(url.pathname)) return next();
  // Existing static files remain Vite's responsibility; nonexistent assets are 404s.
  for (const directory of ['public','dist']) {
    const root = path.resolve(directory);
    let file;
    try { file=path.resolve(root,'.'+decodeURIComponent(url.pathname)); } catch { continue; }
    if (file.startsWith(root+path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) return next();
  }
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex'});
  res.end(req.method==='HEAD'?'':notFoundHtml(url.pathname.startsWith('/bn/')?'bn':'en'));
}
export function localSeoRouting() {
  return {name:'allex-seo-navigation',configureServer(server){server.middlewares.use(navigationRouting);},configurePreviewServer(server){server.middlewares.use(navigationRouting);}};
}
