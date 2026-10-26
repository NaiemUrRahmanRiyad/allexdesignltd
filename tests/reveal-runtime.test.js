import test from 'node:test';
import assert from 'node:assert/strict';
import { startRevealRuntime } from '../src/components/reveal-runtime.js';

test('reveal runtime ignores text changes, registers expanded cards and cleans up observers', t => {
  const saved = Object.fromEntries(['window','document','MutationObserver','IntersectionObserver','ResizeObserver'].map(key=>[key,globalThis[key]]));
  t.after(()=>{for(const [key,value] of Object.entries(saved)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}});
  const classes=()=>{const values=new Set();return {add:(...names)=>names.forEach(n=>values.add(n)),remove:(...names)=>names.forEach(n=>values.delete(n)),contains:n=>values.has(n),toggle:(n,on)=>on?values.add(n):values.delete(n)};};
  const element=(card=false)=>({nodeType:1,isConnected:true,children:[],classList:classes(),style:{values:new Map(),setProperty(name,value){this.values.set(name,value);},removeProperty(name){this.values.delete(name);}},matches:()=>card,querySelectorAll:()=>[],hasAttribute:()=>false,setAttribute(){},append(child){this.children.push(child);},remove(){this.removed=true;}});
  const card=element(true),root=element();let fullScans=0,mutation,observers=[];
  globalThis.document={hidden:false,documentElement:element(),body:root,getElementById:()=>root,querySelectorAll:()=>{fullScans++;return [card];},createElement:()=>element(),addEventListener(){},removeEventListener(){}};
  globalThis.MutationObserver=class{constructor(callback){mutation=callback;}observe(){}disconnect(){}};
  globalThis.IntersectionObserver=class{constructor(callback){this.callback=callback;this.targets=new Set();observers.push(this);}observe(node){this.targets.add(node);}unobserve(node){this.targets.delete(node);}disconnect(){this.targets.clear();}};
  globalThis.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
  globalThis.window={IntersectionObserver:globalThis.IntersectionObserver,ResizeObserver:globalThis.ResizeObserver};
  const stop=startRevealRuntime(false);
  assert.equal(fullScans,1);

  mutation([{addedNodes:[{nodeType:3}],removedNodes:[{nodeType:3}]}]);
  assert.equal(fullScans,1,'typing and counters must never trigger a document-wide rescan');
  const expanded=element(true);
  mutation([{addedNodes:[expanded],removedNodes:[]}]);
  assert.ok(expanded.classList.contains('card-reveal'));

  assert.equal(fullScans,1);
  observers[1].callback([{target:card,isIntersecting:true}]);
  assert.ok(card.classList.contains('glow-ready'));
  card.getAnimations=()=>[{animationName:'card-border-orbit',currentTime:1200,effect:{getTiming:()=>({delay:-3000})}}];
  observers[1].callback([{target:card,isIntersecting:false}]);
  assert.equal(card.style.values.get('--glow-delay'),'-4200ms','offscreen glow must resume the same 7-second orbit phase');
  assert.ok(!card.classList.contains('glow-ready'));
  expanded.isConnected=false;
  mutation([{addedNodes:[],removedNodes:[expanded]}]);
  assert.ok(!observers[0].targets.has(expanded));
  stop();
  assert.equal(observers[0].targets.size,0);
  assert.ok(!card.classList.contains('card-reveal'));
});

