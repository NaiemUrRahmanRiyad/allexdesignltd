import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pageUrl, siteOrigin, productionOrigin } from '../shared/seo.js';
test('canonical origin validation and language URLs', () => {
  assert.equal(productionOrigin,'https://www.allexdesign.com');
  assert.equal(siteOrigin(),productionOrigin);
  assert.equal(pageUrl('https://example.com','bn'),'https://example.com/');
  for (const value of ['javascript:alert(1)','https://example.com/path','https://user:secret@example.com','https://example.com/?x=1']) assert.throws(()=>siteOrigin(value));
});
test('site is English only with no language switch or Bengali content',()=>{
 const html=fs.readFileSync('dist/index.html','utf8');
 assert.ok(!/[\u0980-\u09ff]/.test(html));
 assert.ok(!html.includes('class="language-switch"'));
 assert.ok(!fs.existsSync('dist/bn'));
 assert.ok(!fs.existsSync('dist/fonts/noto-sans-bengali.woff2'));
});

test('built pages contain rendered language content and crawler-readable social metadata', {skip:!fs.existsSync('dist/index.html')}, () => {
  for (const [language,path] of [['en','dist/index.html']]) {
    const html = fs.readFileSync(path,'utf8'); assert.ok(html.includes(`lang="${language}"`));
    for (const marker of ['property="og:title"','property="og:image"','name="twitter:card"','rel="canonical"','hreflang="en"','application/ld+json']) assert.ok(html.includes(marker),marker);
    assert.ok(!html.includes('<div id="root"></div>'));
    assert.ok(html.includes('Interior design'));
    for(const src of [...html.matchAll(/(?:src|href)="(\/assets\/[^" ]+)"/g)].map(match=>match[1])) assert.ok(fs.existsSync('dist'+src),src);
  }
  assert.ok(fs.existsSync('dist/social-preview.jpeg')); assert.ok(!fs.readFileSync('dist/sitemap.xml','utf8').includes('/bn/')); assert.ok(fs.readFileSync('dist/robots.txt','utf8').includes('Sitemap:'));
});
