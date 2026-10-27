import { memo } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/Language.jsx';
import { faqs, matchFaq, faqLocale } from '../data/faq.js';
import { content } from '../data/content.js';
function FaqChatbot({onConsultation}){
  const {language}=useLanguage(); const bn=language==='bn';
  const dialog=useRef(),log=useRef(),launcher=useRef();
  const [welcome,setWelcome]=useState(false);
  useEffect(()=>{
    try{if(sessionStorage.getItem('allex-welcome-seen'))return;}catch{}
    const timer=setTimeout(()=>{
      try{sessionStorage.setItem('allex-welcome-seen','1');}catch{}
      if(!dialog.current?.open)setWelcome(true);
    },2200);
    return ()=>clearTimeout(timer);
  },[]);
  useEffect(()=>{
    if(!welcome)return;
    const timer=setTimeout(()=>setWelcome(false),6000);
    return ()=>clearTimeout(timer);
  },[welcome]);
  const [query,setQuery]=useState(''),[messages,setMessages]=useState([]);
  useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight;},[messages]);
  function ask(text,known){if(!text.trim())return;setMessages(old=>[...old.slice(-19),{text:text.trim(),faq:known||matchFaq(text),locale:faqLocale(text,language)}]);setQuery('');}
  function book(){dialog.current.close();onConsultation();}
  function close(){dialog.current.close();launcher.current?.focus();}
  return <>{welcome&&<aside className="allex-welcome" aria-label="Welcome from ALLEX"><button type="button" className="allex-welcome-close" aria-label="Dismiss welcome message" onClick={()=>setWelcome(false)}>×</button><a href={content.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={()=>setWelcome(false)}><strong>Assalamu Alaikum, Sir/Ma’am!</strong><span>How can we help you today?</span><span className="allex-welcome-action">Contact us on WhatsApp ↗</span></a></aside>}<button ref={launcher} type="button" className="faq-launcher" aria-haspopup="dialog" onClick={()=>{setWelcome(false);dialog.current.showModal();}}>{'✦ Ask ALLEX'}</button>
    <dialog ref={dialog} className="faq-dialog" aria-labelledby="faq-title">
      <div className="faq-header"><div><h2 id="faq-title">ALLEX FAQ</h2><p>{'Company information & useful links'}</p></div><button type="button" aria-label={'Close FAQ'} onClick={close}>×</button></div>
      <div className="faq-log" role="log" aria-live="polite" ref={log}><p className="faq-answer">{'Welcome! Choose a topic or ask about our services. Answers come from the company information provided here.'}</p>{messages.map((m,i)=><div key={i}><p className="faq-question">{m.text}</p><div className="faq-answer"><p>{m.faq?m.faq.answer[m.locale]:'I do not have a confirmed answer. Please contact our team on WhatsApp.'}</p>{m.faq?.action==='consultation'&&<button type="button" className="faq-book" onClick={book}>{'Book a consultation ↗'}</button>}{m.faq?.link&&<a href={m.faq.link} onClick={close}>{'View related section ↗'}</a>}</div></div>)}</div>
      <div className="faq-shortcuts"><button type="button" onClick={book}>{'Book a consultation ↗'}</button><button type="button" onClick={()=>setMessages([])}>{'Clear chat'}</button></div><div className="faq-topics">{faqs.map(f=><button type="button" key={f.id} onClick={()=>ask(f.label[bn?1:0],f)}>{f.label[bn?1:0]}</button>)}</div>
      <form className="faq-form" onSubmit={e=>{e.preventDefault();ask(query);}}><label className="sr-only" htmlFor="faq-query">{'Your question'}</label><input id="faq-query" value={query} onChange={e=>setQuery(e.target.value)} maxLength={400} placeholder={'Type a question…'} autoComplete="off"/><button disabled={!query.trim()}>{'Send'}</button></form>
      <a className="faq-human" href={content.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">{'Chat with our team on WhatsApp ↗'}</a>
    </dialog></>;
}

export default memo(FaqChatbot);
