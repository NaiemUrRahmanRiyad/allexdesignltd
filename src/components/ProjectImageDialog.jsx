import { useEffect, useRef, useState } from 'react';
import originals from '../data/project-image-originals.json';
const originalImages = new Map(originals.map(image => [image.thumbnail, image]));
import { isDialogBackdropClick } from '../../shared/contact-ui.js';

export default function ProjectImageDialog({photo,onClose,titleId}) {
 const dialog=useRef();
 const [index,setIndex]=useState(0);
 const images=photo?.images||[photo];
 const active=images[index]||photo;
 useEffect(()=>{setIndex(photo?.index||0);},[photo]);
 function navigate(next){if(next<0||next>=images.length)return;setIndex(next);dialog.current?.querySelector('.project-image-tools')?.focus({preventScroll:true});}
 useEffect(()=>{
  if(photo&&!dialog.current.open)dialog.current.showModal();
  else if(!photo&&dialog.current.open)dialog.current.close();
 },[photo]);
 return <dialog ref={dialog} className="product-dialog project-image-dialog" aria-labelledby={titleId} onClose={onClose} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();navigate(index-1);}if(event.key==='ArrowRight'){event.preventDefault();navigate(index+1);}}} onClick={event=>{if(isDialogBackdropClick(event,dialog.current))dialog.current.close();}}>
  <button type="button" className="dialog-close" aria-label="Close project image" onClick={()=>dialog.current.close()}>×</button>
  {photo&&<><div className="project-image-caption"><p className="eyebrow">{photo.type}</p><h2 id={titleId}>{photo.title}</h2><p aria-live="polite">Photo {index+1} of {images.length}</p></div>
   <div className="project-image-tools" tabIndex={-1} role="group" aria-label="Project photo controls"><button type="button" disabled={index===0} onClick={()=>navigate(index-1)}>← Previous</button><button type="button" disabled={index===images.length-1} onClick={()=>navigate(index+1)}>Next →</button></div>
   <div className="project-image-viewport"><img className="project-image-large" src={originalImages.get(active.src)?.fullSrc || active.src} alt={`${photo.title} — photo ${index+1}`} width={active.width} height={active.height} decoding="async"/></div>
  </>}
 </dialog>;
}


