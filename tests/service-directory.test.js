import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { serviceDirectory } from '../src/data/service-directory.js';
test('main service directory has three distinct overview anchors and no temporary interior self-link',()=>{
 assert.equal(serviceDirectory.length,3);
 assert.equal(new Set(serviceDirectory.map(s=>s.anchor)).size,3);
 assert.equal(serviceDirectory[0].website,null);
 for(const item of serviceDirectory){assert.ok(item.title[0]);assert.ok(item.summary[0]);if(item.website)assert.equal(new URL(item.website).protocol,'https:');}
});
test('built main website presents an overview while specialist links retain their destinations',()=>{
 const html=fs.readFileSync('dist/index.html','utf8');
 assert.equal((html.match(/class="service-card"/g)||[]).length,3);
 for(const item of serviceDirectory)assert.ok(html.includes(`id="${item.anchor}"`));
 assert.ok(html.includes('https://www.allexfurniturebd.com/shop/'));
 assert.ok(html.includes('https://www.adsteel.co/'));
 assert.ok(!html.includes('id="furniture-full-collection"'));
 assert.ok(!html.includes('WEBSITE PROJECT FEEDBACK'));
});
