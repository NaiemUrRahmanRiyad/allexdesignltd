import test from 'node:test';
import assert from 'node:assert/strict';
import { deploymentSettings } from '../shared/deployment.js';
import { contactOrigins } from '../shared/contact-origins.js';

test('temporary Netlify deployment uses its own URL and remains noindex; official hosting restores indexing',()=>{
 assert.deepEqual(deploymentSettings({NETLIFY:'true',URL:'https://allex-preview.netlify.app',VITE_SITE_URL:'https://www.allexdesign.com'}),{target:'netlify',origin:'https://allex-preview.netlify.app',indexable:false});
 assert.equal(deploymentSettings({ALLEX_DEPLOYMENT:'official',URL:'https://allex-preview.netlify.app'}).origin,'https://www.allexdesign.com');
 assert.equal(deploymentSettings({ALLEX_DEPLOYMENT:'official'}).indexable,true);
 assert.throws(()=>deploymentSettings({ALLEX_DEPLOYMENT:'unknown'}));
 assert.throws(()=>deploymentSettings({ALLEX_DEPLOYMENT:'netlify',URL:'https://evil.example/path'}));
});

test('contact accepts only configured origins plus its exact managed Netlify URL',()=>{
 assert.deepEqual(contactOrigins({ALLOWED_ORIGINS:'https://www.allexdesign.com',SITE_ID:'example',URL:'https://allex-preview.netlify.app'}),['https://www.allexdesign.com','https://allex-preview.netlify.app']);
 assert.deepEqual(contactOrigins({URL:'https://unverified.netlify.app'}),[]);
 for(const value of ['http://untrusted.example','https://user:password@untrusted.example','https://untrusted.example/path','invalid'])assert.deepEqual(contactOrigins({SITE_ID:'example',URL:value}),[]);
});
