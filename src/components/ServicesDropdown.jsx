import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/Language.jsx';
export default function ServicesDropdown({ active, onNavigate }) {
  const ref = useRef(); const {t}=useLanguage();
  useEffect(()=>{
    const outside=e=>{if(!ref.current.contains(e.target))ref.current.open=false;};
    const escape=e=>{if(e.key==='Escape'&&ref.current.open){e.preventDefault();e.stopPropagation();ref.current.open=false;ref.current.querySelector('summary').focus();}};
    document.addEventListener('pointerdown',outside);ref.current.addEventListener('keydown',escape);
    const element=ref.current;
    return()=>{document.removeEventListener('pointerdown',outside);element.removeEventListener('keydown',escape);};
  },[]);
  return <details ref={ref} className={`nav-services${active?' is-current':''}`} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))e.currentTarget.open=false;}}>
    <summary>{t('Services')} <svg className="nav-services-chevron" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false"><path d="m5 7.5 5 5 5-5" /></svg></summary>
    <div className="nav-services-options">{[['interior-projects','Interior design'],['furniture','Furniture'],['adsteel','Steel structure']].map(([id,label])=><a href={`#${id}`} key={id} onClick={()=>{ref.current.open=false;onNavigate(id);}}>{t(label)}<span aria-hidden="true">↗</span></a>)}</div>
  </details>;
}

