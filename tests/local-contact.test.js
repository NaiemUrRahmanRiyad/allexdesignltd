import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { localContact } from '../scripts/local-contact.mjs';

test('local mail adapter passes unrelated paths and retains remote, origin and validation guards',async()=>{
 let middleware;
 localContact().configureServer({config:{mode:'test',envDir:process.cwd()},middlewares:{use(fn){middleware=fn;}}});
 const previous=process.env.ALLOWED_ORIGINS;
 process.env.ALLOWED_ORIGINS='http://localhost:5174';
 async function request({url='/.netlify/functions/contact',method='POST',remote='127.0.0.1',origin='http://localhost:5174',body='{}'}={}){
  const req=Readable.from([Buffer.from(body)]);
  Object.assign(req,{url,method,headers:{origin,'content-type':'application/json'},socket:{remoteAddress:remote}});
  let status,headers,payload,passed=false;
  await middleware(req,{writeHead(code,values){status=code;headers=values;},end(value){payload=String(value);}},()=>{passed=true;});
  return {status,headers,payload,passed};
 }
 try{
  assert.equal((await request({url:'/assets/example.js'})).passed,true);
  assert.equal((await request({remote:'192.168.1.10'})).status,403);
  assert.equal((await request({method:'GET'})).status,405);
  assert.equal((await request({origin:'https://untrusted.example'})).status,403);
  assert.equal((await request({body:'not-json'})).status,400);
  assert.equal((await request()).status,400);
 }finally{if(previous===undefined)delete process.env.ALLOWED_ORIGINS;else process.env.ALLOWED_ORIGINS=previous;}
});
