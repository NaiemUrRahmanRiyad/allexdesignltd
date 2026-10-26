import { useEffect, useRef } from 'react';
import { isDialogBackdropClick } from '../../shared/contact-ui.js';

export default function ProjectImageDialog({photo,onClose,titleId}) {
 const dialog=useRef();
 useEffect(()=>{
  if(photo&&!dialog.current.open)dialog.current.showModal();
  else if(!photo&&dialog.current.open)dialog.current.close();
 },[photo]);
 return <dialog ref={dialog} className="product-dialog project-image-dialog" aria-labelledby={titleId} onClose={onClose} onClick={event=>{if(isDialogBackdropClick(event,dialog.current))dialog.current.close();}}>
  <button type="button" className="dialog-close" aria-label="Close project image" onClick={()=>dialog.current.close()}>×</button>
  {photo&&<><div className="project-image-caption"><p className="eyebrow">{photo.type}</p><h2 id={titleId}>{photo.title}</h2><p>Photo {photo.index+1} of {photo.count}</p></div><img className="project-image-large" src={photo.src} alt={`${photo.title} — photo ${photo.index+1}`} width={photo.width} height={photo.height} decoding="async"/></>}
 </dialog>;
}
