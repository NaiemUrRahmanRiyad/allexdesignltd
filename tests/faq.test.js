import test from 'node:test';
import assert from 'node:assert/strict';
import { matchFaq, faqLocale } from '../src/data/faq.js';
test('FAQ recognizes English topics without inventing unknown answers',()=>{
  assert.equal(matchFaq('show projects')?.id,'projects');
  assert.equal(matchFaq('show furniture')?.id,'furniture');
  assert.equal(matchFaq('ALLEX chair price')?.id,'price');
  assert.equal(matchFaq('office address')?.id,'contact');
  assert.equal(matchFaq('what is the weather today?'),null);
  assert.equal(matchFaq(''),null);
});
test('Banglish questions and booking intent route to the right topic',()=>{
  for(const [question,id] of [['apnader thikana kothay','contact'],['sofa er dam koto','price'],['ager kajer chobi dekhao','projects'],['ami basha sajate chai','interior'],['ki ki kaj koren','services'],['budget niye consultation book korte chai','consultation'],['farniture dekhao','furniture']]) assert.equal(matchFaq(question)?.id,id,question);
  assert.equal(faqLocale('sofa er dam koto','en'),0);
  assert.equal(faqLocale('show projects','en'),0);
  assert.equal(matchFaq('tell me a joke'),null);
});
