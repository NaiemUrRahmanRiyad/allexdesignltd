import test from 'node:test';
import assert from 'node:assert/strict';
import { contactWhatsappMessage, isDialogBackdropClick } from '../shared/contact-ui.js';

test('WhatsApp draft follows reopened form values and preserves the requested product and language link', () => {
  const message = contactWhatsappMessage({ name:'Client', phone:'01712345678', email:'client@example.com', subject:'Furniture enquiry: Desk', message:'Oak finish', attachments:{size:12} }, { product:{id:'desk',name:'Desk'},pageUrl:'https://example.com/bn/?product=old&utm_source=example#contact' });
  assert.ok(message.includes('Phone: 01712345678'));
  assert.ok(message.includes('Email: client@example.com'));
  assert.ok(message.includes('https://example.com/bn/?product=desk#furniture'));
  assert.ok(!message.includes('product=old'));
  const reopened = contactWhatsappMessage({subject:'Consultation',budget:'Not decided'}, {consultation:true});
  assert.ok(reopened.includes('request a consultation'));
  assert.ok(reopened.includes('Subject: Consultation'));
  assert.ok(!reopened.includes('Desk'));
  const cleared = contactWhatsappMessage({name:'',subject:'',message:''});
  assert.ok(!cleared.includes('Client'));
  assert.ok(!cleared.includes('Oak finish'));
});

test('dialog whitespace stays open while actual backdrop clicks can dismiss it', () => {
  const dialog={getBoundingClientRect:()=>({left:100,right:500,top:100,bottom:600})};
  assert.equal(isDialogBackdropClick({target:dialog,clientX:110,clientY:110},dialog),false);
  assert.equal(isDialogBackdropClick({target:dialog,clientX:99,clientY:110},dialog),true);
  assert.equal(isDialogBackdropClick({target:dialog,clientX:120,clientY:601},dialog),true);
  assert.equal(isDialogBackdropClick({target:{},clientX:99,clientY:110},dialog),false);
});
