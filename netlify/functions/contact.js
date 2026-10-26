import nodemailer from 'nodemailer';
import { contactOrigins } from '../../shared/contact-origins.js';
import { MAX_FILES, MAX_FILE_BYTES, MAX_REQUEST_BYTES, fileSelectionError } from '../../shared/attachments.js';
export function validateAttachments(items = []) {
  if (!Array.isArray(items) || items.length > MAX_FILES) throw new Error('Attach up to 3 files.');
  const attachments = items.map(item => {
    if (!item || typeof item.name !== 'string' || item.name.length > 180 || /[\x00-\x1f\x7f]/.test(item.name) || typeof item.type !== 'string' || typeof item.data !== 'string' || item.data.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(item.data)) throw new Error('Invalid attachment.');
    const content = Buffer.from(item.data, 'base64');
    const error = fileSelectionError([{ name: item.name, type: item.type, size: content.length }]);
    if (error) throw new Error(error);
    const signatureValid = item.type === 'application/pdf' ? /^%PDF-1\.[0-9]|^%PDF-2\.[0-9]/.test(content.subarray(0, 8).toString('ascii')) : item.type === 'image/png' ? content.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : item.type === 'image/jpeg' ? content[0] === 255 && content[1] === 216 && content[2] === 255 : content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP';
    if (!signatureValid) throw new Error('Attachment content does not match its file type.');
    const filename = item.name.split(/[\\/]/).pop().replace(/[^\p{L}\p{N}._() -]/gu, '_').replace(/^\.+/, '') || 'attachment';
    return { filename, content, contentType: item.type, contentDisposition: 'attachment' };
  });
  const error = fileSelectionError(attachments.map(item => ({ name: item.filename, type: item.contentType, size: item.content.length })));
  if (error) throw new Error(error);
  return attachments;
}
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const reply = (statusCode, message) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ message }) });
export function validateInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const result = {};
  for (const [field, max] of Object.entries({ name: 100, email: 254, phone: 40, subject: 150, message: 5000, website: 200 })) {
    const value = input[field] ?? ''; if (typeof value !== 'string' || value.length > max) return null;
    result[field] = value.trim().replace(/\r\n/g, '\n');
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(result[field])) return null;
    if (field !== 'message' && /[\r\n]/.test(result[field])) return null;
  }
  if (!result.name || !result.subject || !result.message || !emailPattern.test(result.email)) return null;
  return result;
}
export const config = { path: '/.netlify/functions/contact', rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
export default async function contact(request) {
  const size = Number(request.headers.get('content-length'));
  if (size > MAX_REQUEST_BYTES) return new Response(JSON.stringify({ message: 'Your message is too large.' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
  let body = '';
  if (request.method === 'POST' && request.body) {
    const reader = request.body.getReader(); const chunks = []; let bytes = 0;
    while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > MAX_REQUEST_BYTES) { await reader.cancel(); return new Response(JSON.stringify({ message: 'Your message is too large.' }), { status: 413, headers: { 'Content-Type': 'application/json' } }); } chunks.push(value); }
    body = Buffer.concat(chunks).toString('utf8');
  }
  const result = await handler({ httpMethod: request.method, headers: Object.fromEntries(request.headers), body });
  return new Response(result.body, { status: result.statusCode, headers: result.headers });
}
export async function handler(event) {
  if (event.httpMethod !== 'POST') return { ...reply(405, 'Method not allowed.'), headers: { ...reply(405, '').headers, Allow: 'POST' } };
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
  const allowed = contactOrigins(process.env);
  if (!allowed.length) return reply(503, 'Contact service is not configured yet. Please try again later.');
  if (!headers.origin || !allowed.includes(headers.origin)) return reply(403, 'Request origin is not allowed.');
  if (!/^application\/json(?:\s*;|$)/i.test(headers['content-type'] || '')) return reply(415, 'Send a JSON request.');
  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  if (Buffer.byteLength(raw, 'utf8') > MAX_REQUEST_BYTES) return reply(413, 'Your message is too large.');
  let input; try { input = JSON.parse(raw); } catch { return reply(400, 'Invalid request.'); }
  const data = validateInput(input); if (!data) return reply(400, 'Please check your contact details and message.');
  if (data.website) return reply(400, 'Unable to process this request.');
  let attachments; try { attachments = validateAttachments(input.attachments); } catch (error) { return reply(400, error.message); }
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO_EMAIL } = process.env;
  if (!emailPattern.test(GMAIL_USER || '') || !GMAIL_APP_PASSWORD || !emailPattern.test(CONTACT_TO_EMAIL || '')) return reply(503, 'Contact service is not configured yet. Please try again later.');
  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }, disableFileAccess: true, disableUrlAccess: true, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000 });
  try {
    const result = await transport.sendMail({ from: GMAIL_USER, to: CONTACT_TO_EMAIL, replyTo: data.email, subject: `Website enquiry: ${data.subject}`, text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not supplied'}\n\n${data.message}`, attachments });
    if (!result.accepted?.length || result.rejected?.length) return reply(502, 'Unable to send your enquiry. Please try again later.');
    return reply(200, 'Your enquiry was sent successfully.');
  } catch { return reply(502, 'Unable to send your enquiry. Please try again later.'); }
  finally { transport.close(); }
}
