import { useEffect, useRef, useState } from 'react';
import originals from '../data/project-image-originals.json';
const originalImages = new Map(originals.map(image => [image.thumbnail, image]));
import { isDialogBackdropClick } from '../../shared/contact-ui.js';

export default function ProjectImageDialog({photo,onClose,titleId}) {
 const dialog=useRef();
 const viewport=useRef();
 const [index,setIndex]=useState(0),[zoomed,setZoomed]=useState(false);
 const images=photo?.images||[photo];
 const active=images[index]||photo;
 useEffect(()=>{setIndex(photo?.index||0);setZoomed(false);},[photo]);
 function navigate(next){if(next<0||next>=images.length)return;setIndex(next);setZoomed(false);viewport.current?.scrollTo(0,0);}
 useEffect(()=>{
  if(photo&&!dialog.current.open)dialog.current.showModal();
  else if(!photo&&dialog.current.open)dialog.current.close();
 },[photo]);
 return <dialog ref={dialog} className="product-dialog project-image-dialog" aria-labelledby={titleId} onClose={onClose} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();navigate(index-1);}if(event.key==='ArrowRight'){event.preventDefault();navigate(index+1);}}} onClick={event=>{if(isDialogBackdropClick(event,dialog.current))dialog.current.close();}}>
  <button type="button" className="dialog-close" aria-label="Close project image" onClick={()=>dialog.current.close()}>×</button>
  {photo&&<><div className="project-image-caption"><p className="eyebrow">{photo.type}</p><h2 id={titleId}>{photo.title}</h2><p aria-live="polite">Photo {index+1} of {images.length}</p></div>
   <div className="project-image-tools" role="group" aria-label="Project photo controls"><button type="button" disabled={index===0} onClick={()=>navigate(index-1)}>← Previous</button><button type="button" aria-pressed={zoomed} onClick={()=>{setZoomed(value=>!value);viewport.current?.scrollTo(0,0);}}>{zoomed?'Fit image':'Zoom 2×'}</button><button type="button" disabled={index===images.length-1} onClick={()=>navigate(index+1)}>Next →</button></div>
   <div ref={viewport} className={`project-image-viewport${zoomed?' is-zoomed':''}`} tabIndex={0} role="region" aria-label="Project image. When zoomed, scroll to inspect details."><img className="project-image-large" src={originalImages.get(active.src)?.fullSrc || active.src} alt={`${photo.title} — photo ${index+1}`} width={active.width} height={active.height} decoding="async"/></div>
   {zoomed&&<p className="project-zoom-hint">Scroll or swipe across the image to inspect details.</p>}
  </>}
 </dialog>;
}

