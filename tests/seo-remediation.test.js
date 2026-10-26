import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { interiorProjects } from '../src/data/interior-projects.js';
import { clients } from '../src/data/clients.js';
import { legacyRedirects, netlifyRedirects, apacheRedirects } from '../shared/legacy-redirects.js';
import { navigationRouting } from '../scripts/local-seo-routing.mjs';

test('collapsed project and client information is present in initial English HTML',()=>{
 for(const language of ['en']){
  const html=fs.readFileSync('dist/index.html','utf8');
  for(const project of interiorProjects){
   assert.ok(html.includes(project.company),project.company);
   assert.ok(html.includes(project.description),project.id);
   for(const image of project.images)assert.ok(html.includes(image.src));
  }
  for(const client of clients)assert.ok(html.includes(client.image),client.id);
  assert.equal((html.match(/class="interior-project-card" hidden=""/g)||[]).length,3);
  assert.ok(html.includes('id="additional-client-logos" hidden=""'));
  for(const image of html.matchAll(/<img\b[^>]*>/g)){
   assert.match(image[0],/\bwidth="[1-9]\d*"/);
   assert.match(image[0],/\bheight="[1-9]\d*"/);
  }
 }
});

test('production has no homepage catch-all and ships an English noindex 404 page',()=>{
 const config=fs.readFileSync('netlify.toml','utf8');
 assert.ok(!config.includes('status = 200'));
 assert.equal(fs.readFileSync('dist/_redirects','utf8'),netlifyRedirects());
 for(const file of ['dist/404.html']){
  const html=fs.readFileSync(file,'utf8');
  assert.ok(html.includes('name="robots" content="noindex,follow"'));
  assert.ok(!html.includes('rel="canonical"'));
 }
 const html=fs.readFileSync('dist/index.html','utf8');
 for(const [,to]of legacyRedirects)if(to.includes('#'))assert.ok(html.includes(`id="${to.split('#')[1]}"`),to);
 assert.ok(!fs.readFileSync('dist/sitemap.xml','utf8').includes('404'));
});

test('same-domain replacement generates matching Apache redirects and 404 handling',()=>{
 const config=fs.readFileSync('dist/.htaccess','utf8');
 assert.equal(config,apacheRedirects());
 assert.ok(config.includes('DirectoryIndex index.html'));
 assert.ok(config.includes('ErrorDocument 404 /404.html'));
 assert.ok(!config.includes('index.php'));
 assert.ok(!fs.existsSync('dist/bn'));
 for(const [from,to]of legacyRedirects){
  assert.ok(config.includes(`RewriteRule ^${from.slice(1,-1)}/?$ ${to} [R=301,L,NE]`));
 }
});

test('navigation returns 404 and exact legacy 301 responses without swallowing pages, queries or functions',()=>{
  const request=url=>{
   const result={status:200,headers:{},body:''};
   navigationRouting({url,method:'GET',headers:{accept:'text/html'}},{writeHead(status,headers){result.status=status;result.headers=headers;},end(body=''){result.body=body;}},()=>{result.passed=true;});
   return result;
  };
  for(const path of ['/missing-page/','/bn/missing-page/']){
   const res=request(path);assert.equal(res.status,404);assert.equal(res.headers['X-Robots-Tag'],'noindex');
   assert.ok(res.body.includes('Page not found'));
  }
  for(const [from,to]of legacyRedirects)for(const path of [from,from.slice(0,-1)]){
   const res=request(path+'?utm_source=old');assert.equal(res.status,301);
   assert.equal(res.headers.Location,to==='/'?'/?utm_source=old':to.replace('/#','/?utm_source=old#'));
  }
  for(const path of ['/','/.netlify/functions/contact','/brand-logo.png','/robots.txt'])assert.ok(request(path).passed,path);
  assert.equal(request('/assets/missing-example.png').status,404);
});
