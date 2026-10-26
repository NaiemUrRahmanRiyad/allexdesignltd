import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import contact, { handler, validateInput, validateAttachments } from '../netlify/functions/contact.js';
import { MAX_REQUEST_BYTES, fileSelectionError } from '../shared/attachments.js';
const pdf = { name: 'plan.pdf', type: 'application/pdf', data: Buffer.from('%PDF-1.7\nTest fixture\n%%EOF').toString('base64') };
const good = { name: 'Visitor', email: 'visitor@example.com', subject: 'Enquiry', message: 'Please contact me.' };
test('validates required fields, limits, email and header injection', () => {
  assert.equal(validateInput(good).name, 'Visitor');
  for (const bad of [null, [], { ...good, email: 'wrong' }, { ...good, subject: 'hello\r\nBcc: victim@example.com' }, { ...good, message: 'x'.repeat(5001) }, { ...good, name: '' }, { ...good, phone: {} }]) assert.equal(validateInput(bad), null);
});
test('SMTP acceptance succeeds; rejection or errors never return success', async () => {
  const keys = ['ALLOWED_ORIGINS', 'GMAIL_USER', 'GMAIL_APP_PASSWORD', 'CONTACT_TO_EMAIL'];
  const old = Object.fromEntries(keys.map(key => [key, process.env[key]])); const original = nodemailer.createTransport;
  Object.assign(process.env, { ALLOWED_ORIGINS: 'https://approved.example', GMAIL_USER: 'sender@example.com', GMAIL_APP_PASSWORD: 'test-only', CONTACT_TO_EMAIL: 'company@example.com' });
  const event = { httpMethod: 'POST', headers: { origin: 'https://approved.example', 'content-type': 'application/json' }, body: JSON.stringify({ ...good, attachments: [pdf] }) };
  try {
    let sent;
    nodemailer.createTransport = () => ({ sendMail: async mail => { sent = mail; return { accepted: ['company@example.com'], rejected: [] }; }, close() {} });
    assert.equal((await handler(event)).statusCode, 200); assert.equal(sent.replyTo, good.email); assert.equal(sent.from, 'sender@example.com');
    assert.equal(sent.attachments[0].filename, 'plan.pdf'); assert.equal(sent.attachments[0].contentType, 'application/pdf'); assert.deepEqual(sent.attachments[0].content, Buffer.from(pdf.data, 'base64'));
    const badUpload = await handler({ ...event, body: JSON.stringify({ ...good, attachments: [{ ...pdf, data: Buffer.from('not a PDF').toString('base64') }] }) }); assert.equal(badUpload.statusCode, 400);
    nodemailer.createTransport = () => ({ sendMail: async () => ({ accepted: [], rejected: ['company@example.com'] }), close() {} });
    assert.equal((await handler(event)).statusCode, 502);
    nodemailer.createTransport = () => ({ sendMail: async () => { throw new Error('private SMTP details'); }, close() {} });
    const failure = await handler(event); assert.equal(failure.statusCode, 502); assert.ok(!failure.body.includes('private SMTP'));
  } finally { nodemailer.createTransport = original; for (const key of keys) { if (old[key] === undefined) delete process.env[key]; else process.env[key] = old[key]; } }
});
test('rejects methods, untrusted origins, malformed and oversized input; does not claim unconfigured delivery', async () => {
  const prior = process.env.ALLOWED_ORIGINS; const priorPassword = process.env.GMAIL_APP_PASSWORD;
  process.env.ALLOWED_ORIGINS = 'https://approved.example'; delete process.env.GMAIL_APP_PASSWORD;
  const event = { httpMethod: 'POST', headers: { origin: 'https://approved.example', 'content-type': 'application/json' }, body: JSON.stringify(good) };
  try {
    assert.equal((await handler({ ...event, httpMethod: 'GET' })).statusCode, 405);
    assert.equal((await handler({ ...event, headers: { ...event.headers, origin: 'https://other.example' } })).statusCode, 403);
    assert.equal((await handler({ ...event, body: '{' })).statusCode, 400);
    assert.equal((await handler({ ...event, body: 'x'.repeat(MAX_REQUEST_BYTES + 1) })).statusCode, 413);
    assert.equal((await handler({ ...event, body: JSON.stringify({ ...good, website: 'spam' }) })).statusCode, 400);
    assert.equal((await handler(event)).statusCode, 503);
  } finally { if (prior === undefined) delete process.env.ALLOWED_ORIGINS; else process.env.ALLOWED_ORIGINS = prior; if (priorPassword === undefined) delete process.env.GMAIL_APP_PASSWORD; else process.env.GMAIL_APP_PASSWORD = priorPassword; }
});
test('attachments enforce type signatures, limits and safe file names', () => {
  assert.deepEqual(validateAttachments(), []);
  const jpg = { name: 'room.jpg', type: 'image/jpeg', data: Buffer.from([255,216,255,224,0,16]).toString('base64') };
  const png = { name: 'room.png', type: 'image/png', data: Buffer.from([137,80,78,71,13,10,26,10,0]).toString('base64') };
  const webp = { name: 'room.webp', type: 'image/webp', data: Buffer.from('RIFF1234WEBP').toString('base64') };
  for (const item of [pdf, jpg, png, webp]) assert.equal(validateAttachments([item])[0].contentType, item.type);
  assert.equal(validateAttachments([{ ...pdf, name: '../../plan.pdf' }])[0].filename, 'plan.pdf');
  for (const invalid of [null, {}, [pdf,pdf,pdf,pdf], [{...pdf, data:'not-base64!'}], [{...pdf,data:''}], [{...pdf,type:'image/png'}], [{...pdf,name:'plan.exe'}], [{...pdf,name:'plan\r\n.pdf'}], [{...pdf,data:Buffer.alloc(2*1024*1024+1).toString('base64')}]]) assert.throws(() => validateAttachments(invalid));
  assert.ok(fileSelectionError([{name:'plan.pdf',type:'application/pdf',size:2*1024*1024},{name:'room.png',type:'image/png',size:2*1024*1024}]).includes('3 MB'));
  const bigPdf = {...pdf,data:Buffer.concat([Buffer.from('%PDF-1.7'),Buffer.alloc(2*1024*1024-8)]).toString('base64')}; assert.throws(() => validateAttachments([bigPdf,bigPdf]), /3 MB/);
});
test('request wrapper limits the streamed upload before JSON parsing', async () => {
  const result = await contact(new Request('https://approved.example/.netlify/functions/contact', {method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(MAX_REQUEST_BYTES+1)})); assert.equal(result.status,413);
});
