import { memo } from 'react';
import { Localize } from '../i18n/Language.jsx';
import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content.js';
import { fileSelectionError } from '../../shared/attachments.js';
import { contactWhatsappMessage, isDialogBackdropClick } from '../../shared/contact-ui.js';
function encodeFile(file) {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result.split(',')[1] }); reader.onerror = () => reject(new Error('Unable to read the attachment. Please select it again.')); reader.onabort = () => reject(new Error('Attachment reading was interrupted.')); reader.readAsDataURL(file); });
}

function SocialIcon({ name }) {
  if (name === 'Facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" fill="currentColor" /></svg>;
  if (name === 'YouTube') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" fill="currentColor" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.7" cy="6.5" r="1.15" fill="currentColor" /></svg>;
}

function ContactIcon({ name }) {
  if (name === 'Phone') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M9.5 6.5h5M10.5 17.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
  if (name === 'Email') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 8.5c.3-.5.6-.5.9-.5l.6 1.6-.7.9c.6 1.2 1.5 2 2.7 2.6l.8-.8 1.7.7c.1.4 0 .8-.4 1.1-.6.5-1.4.7-2.2.4-2.1-.7-4.3-2.8-5-4.8-.3-.7.2-1.4.6-1.9Z" fill="currentColor" /></svg>;
}

function Contact({ openRequest, initialSubject, initialProduct, onOpenForm }) {
  const consultation = initialSubject === 'Consultation';
  const [whatsappDraft, setWhatsappDraft] = useState('');
  function updateWhatsapp(form) {
    const fields = Object.fromEntries(new FormData(form));
    setWhatsappDraft(contactWhatsappMessage(fields, { consultation, product: initialProduct, pageUrl: window.location.href }));
  }
  const dialog = useRef(null);
  const [files, setFiles] = useState([]);
  function selectFiles(event) {
    const selected = [...files, ...Array.from(event.target.files)];
    const error = fileSelectionError(selected);
    setErrors(current => ({ ...current, attachments: error }));
    if (!error) setFiles(selected);
    event.target.value = '';
  }
  const [errors, setErrors] = useState({}); const [status, setStatus] = useState(''); const [statusType, setStatusType] = useState(''); const [busy, setBusy] = useState(false); const locked = useRef(false);
  useEffect(() => {
    const contactDialog = dialog.current;
    if (openRequest > 0 && !contactDialog.open) {
      contactDialog.querySelector('[name="subject"]').value = initialSubject;
      setErrors({});
      setStatus('');
      setStatusType('');
      updateWhatsapp(contactDialog.querySelector('form'));
      contactDialog.showModal();
    }
  }, [openRequest, initialSubject, initialProduct]);
  async function submit(event) {
    event.preventDefault(); if (locked.current) return; const form = event.currentTarget; const formData = new FormData(form); formData.delete('attachments'); const values = Object.fromEntries(formData); const next = {};
    for (const field of ['name', 'email', 'subject', 'message']) if (!values[field]?.trim()) next[field] = 'This field is required.';
    if (consultation) {
      for (const field of ['workType','projectLocation','budget','preferredTime']) if (!values[field]?.trim()) next[field] = 'This field is required.';
      if (values.preferredTime && !Number.isFinite(Date.parse(`${values.preferredTime}+06:00`))) next.preferredTime = 'Choose a valid date and time.';
      else if (values.preferredTime && Date.parse(`${values.preferredTime}+06:00`) <= Date.now()) next.preferredTime = 'Choose a future date and time.';
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    const attachmentError = fileSelectionError(files); if (attachmentError) next.attachments = attachmentError;
    setErrors(next); if (Object.keys(next).length) { form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    if (consultation) {
      values.message = `CONSULTATION REQUEST\nWork type: ${values.workType}\nLocation: ${values.projectLocation}\nApproximate budget (BDT): ${values.budget}\nPreferred time (Bangladesh, UTC+06:00): ${values.preferredTime.replace('T',' ')}\nRequested time is subject to team confirmation.\n\n${values.message}`;
      if(values.message.length > 5000) { setErrors({message:'Please shorten your project description.'}); form.querySelector('[name="message"]').focus(); return; }
    }
    locked.current = true; setBusy(true); setStatusType('pending'); setStatus('Sending your enquiry…');
    try { values.attachments = await Promise.all(files.map(encodeFile)); const response = await fetch('/.netlify/functions/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: AbortSignal.timeout(30000) }); const result = await response.json().catch(() => ({ message: response.status === 429 ? 'Too many enquiries. Please wait a minute before trying again.' : 'Contact service unavailable. Please try again later.' })); if (!response.ok) throw new Error(result.message || 'Unable to send your enquiry. Please try again later.'); setStatusType('success'); setStatus('Thank you — your enquiry and any attachments have been sent. Our team will review them and get in touch with you.'); form.reset(); setFiles([]); updateWhatsapp(form); }
    catch (error) { setStatusType('error'); setStatus(error.name === 'TimeoutError' ? 'The request timed out. Delivery is unconfirmed; please wait before trying again.' : error.message === 'Failed to fetch' ? 'Unable to connect. Please try again later.' : error.message.startsWith('Unexpected') ? 'Contact service unavailable. Please try again after the site is configured.' : error.message); }
    finally { locked.current = false; setBusy(false); }
  }
  return <Localize>
    <section id="contact" className="contact section">
      <div data-reveal>
        <p className="eyebrow">GET IN TOUCH</p>
        <h2>Every great space<br />starts with a<br /><em>conversation.</em></h2>
        <div className="contact-details">
          <a className="contact-detail" href={content.contact.mapUrl} target="_blank" rel="noopener noreferrer">
            <span className="contact-detail-label">VISIT OUR OFFICE</span><span>{content.contact.address}</span>
          </a>
          <a className="contact-detail" href={content.contact.phoneUrl}>
            <span className="contact-detail-label">CALL US</span><span>{content.contact.phone}</span>
          </a>
          <a className="contact-detail" href={content.contact.emailUrl}>
            <span className="contact-detail-label">EMAIL US</span><span>{content.contact.email}</span>
          </a>
        </div>
        <div className="social-links" aria-label="Follow ALLEX">
          <span className="social-links-label">FOLLOW ALLEX</span>
          {content.socialLinks.map(social => <a className="social-link" href={social.url} key={social.name} target="_blank" rel="noopener noreferrer" aria-label={`Follow ALLEX on ${social.name}`} title={social.name}>
            <SocialIcon name={social.name} /><span className="social-link-name">{social.name}</span>
          </a>)}
        </div>
      </div>
      <div className="contact-invitation" data-reveal>
        <span className="botanical-corner-detail" aria-hidden="true" />
        <p>Tell us what you need, where the project is and any budget you have in mind. We can discuss the next steps together.</p>
        <button type="button" className="button contact-cta" onClick={() => onOpenForm()}>Start a conversation<span aria-hidden="true">↗</span></button>
      </div>
    </section>
    <div className="quick-contact-dock" role="group" aria-label="Quick contact">
      <a href={content.contact.phoneUrl} aria-label={`Call ${content.contact.phone}`}><ContactIcon name="Phone" /><span>Call</span></a>
      <a href={content.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact ALLEX on WhatsApp"><ContactIcon name="WhatsApp" /><span>WhatsApp</span></a>
      <a href={content.contact.emailUrl} aria-label={`Email ${content.contact.email}`}><ContactIcon name="Email" /><span>Email</span></a>
    </div>
    <dialog className="contact-dialog" ref={dialog} aria-labelledby="contact-dialog-title" onCancel={event => { event.preventDefault(); dialog.current.close(); }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); dialog.current.close(); } }} onClick={event => { if (isDialogBackdropClick(event, dialog.current)) dialog.current.close(); }}>
      <button className="dialog-close" type="button" aria-label="Close contact form" onClick={() => dialog.current.close()}>×</button>
      <p className="eyebrow">GET IN TOUCH</p>
      <h2 id="contact-dialog-title">{consultation ? 'Book a consultation' : <>Let’s talk about<br /><em>your project.</em></>}</h2>
      <form onSubmit={submit} onChange={event=>updateWhatsapp(event.currentTarget)} noValidate>
        {consultation && <fieldset className="consultation-fields wide"><legend>Consultation details</legend>
          {[
            ['workType','Type of work'],['projectLocation','Project location'],['budget','Approximate budget (BDT)'],['preferredTime','Preferred date & time'],
          ].map(([name,label])=><div className="field" key={name}><label htmlFor={`consultation-${name}`}>{label}</label>
            {name === 'workType' ? <select id={`consultation-${name}`} name={name} required defaultValue="" aria-invalid={!!errors[name]} aria-describedby={errors[name]?`${name}-error`:undefined}><option value="" disabled>Select work type</option>{['Residential interior','Office interior','Commercial interior','Custom furniture','Construction & development','Steel structure','Other'].map(type=><option key={type} value={type}>{type}</option>)}</select> : <input id={`consultation-${name}`} name={name} required type={name==='preferredTime'?'datetime-local':'text'} maxLength={name==='projectLocation'?200:100} placeholder={name==='budget'?'Amount or range, or Not decided':undefined} aria-invalid={!!errors[name]} aria-describedby={`${name==='preferredTime'?'consultation-time-note ':''}${errors[name]?`${name}-error`:''}`.trim()||undefined} />}
            {errors[name]&&<span className="error" id={`${name}-error`}>{errors[name]}</span>}
          </div>)}
          <p id="consultation-time-note">Times are in Bangladesh time (UTC+06:00). Your preferred time is a request; our team will confirm availability.</p>
        </fieldset>}
        {[['name', 'Full name', 100], ['email', 'Email address', 254], ['phone', 'Phone number (optional)', 40], ['subject', 'Subject', 150], ['message', 'Tell us about your project', 5000]].map(([name, label, max]) => <div className={`field ${name === 'message' ? 'wide' : ''}`} key={name}>
          <label htmlFor={`contact-${name}`}>{label}</label>
          {name === 'message' ? <textarea id={`contact-${name}`} name={name} rows="4" required maxLength={max} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `contact-${name}-error` : undefined} /> : <input id={`contact-${name}`} name={name} type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'} required={name !== 'phone'} maxLength={max} autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'off'} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `contact-${name}-error` : undefined} />}
          {errors[name] && <span className="error" id={`contact-${name}-error`}>{errors[name]}</span>}
        </div>)}
        <div className="field wide attachment-field"><label htmlFor="contact-attachments">Images or PDF (optional)</label><input id="contact-attachments" name="attachments" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" multiple disabled={busy} onChange={selectFiles} aria-invalid={!!errors.attachments} aria-describedby={`attachment-help${errors.attachments ? ' attachment-error' : ''}`} /><p id="attachment-help">Up to 3 files · JPG, PNG, WebP or PDF · 2 MB per file, 3 MB total. Files are sent with your enquiry by email.</p>{errors.attachments && <span className="error" id="attachment-error" role="alert">{errors.attachments}</span>}{files.length > 0 && <ul className="attachment-list">{files.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name} <small>({(file.size / 1024).toFixed(0)} KB)</small></span><button type="button" disabled={busy} aria-label={`Remove ${file.name}`} onClick={() => { setFiles(current => current.filter((_, i) => i !== index)); setErrors(current => ({ ...current, attachments: '' })); }}>Remove</button></li>)}</ul>}</div>
        <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this empty</label><input id="contact-website" name="website" tabIndex="-1" autoComplete="off" /></div>
        <button className="button wide contact-submit" disabled={busy}><span>{busy ? 'Sending…' : 'Send enquiry'}</span><span aria-hidden="true">↗</span></button>
        <p className={`form-status wide${statusType ? ` is-${statusType}` : ''}`} role="status" aria-live="polite">{status}</p>
        <div className="form-whatsapp wide"><p>Prefer WhatsApp? Continue with our team directly.</p><a className="button" href={`${content.contact.whatsappUrl}?text=${encodeURIComponent(whatsappDraft || (consultation ? 'Hello ALLEX, I would like to request a consultation.' : 'Hello ALLEX, I would like to discuss a project.'))}`} target="_blank" rel="noopener noreferrer">Continue on WhatsApp <span aria-hidden="true">↗</span></a><small>Your entered details will be included. Attach images or PDFs in WhatsApp separately.</small></div>
      </form>
    </dialog>
  </Localize>;
}


export default memo(Contact);
