import imageMetadata from '../data/image-metadata.json';
import { memo, useEffect, useRef, useState } from 'react';
import { isDialogBackdropClick } from '../../shared/contact-ui.js';
import { Localize, useLanguage } from '../i18n/Language.jsx';
import { steelProjects } from '../data/steel-projects.js';
import { serviceDirectory } from '../data/service-directory.js';
function AdSteel({onEnquire}) {
 const [photo,setPhoto]=useState(null);
 const photoDialog=useRef();
 useEffect(()=>{if(photo&&!photoDialog.current.open)photoDialog.current.showModal();},[photo]);
 const {language}=useLanguage();const n=language==='bn'?1:0;const service=serviceDirectory[2];
 return <Localize><section id="adsteel" className="adsteel-detail section service-overview" aria-labelledby="adsteel-title">
  <div className="adsteel-intro" data-reveal><div><p className="eyebrow">AD STEEL & CONSTRUCTION</p><h2 id="adsteel-title">A stronger framework.<br/><em>More possibilities.</em></h2></div><div><a href={service.website} target="_blank" rel="noopener noreferrer"><img className="adsteel-logo" src="/adsteel/logo.png" alt="AD Steel & Construction Company" loading="lazy" width={imageMetadata['/adsteel/logo.png'].width} height={imageMetadata['/adsteel/logo.png'].height}/></a><p>{service.summary[n]}</p></div></div>
  <div className="overview-ranges" aria-label={'Steel and construction services'}>{service.ranges.map(range=><span key={range[0]}>{range[n]}</span>)}</div>
  <div className="adsteel-project-heading" data-reveal><div><p className="eyebrow">{'SELECTED PROJECTS'}</p><h3>{'Built for industry and infrastructure.'}</h3></div></div>
  <div className="adsteel-example-grid">{steelProjects.map(item=><article className="adsteel-example-card" key={item.id} data-reveal data-reveal-repeat>
   <div className="steel-portfolio-photos">{item.images.slice(0,2).map((src,index)=><button key={src} type="button" className="adsteel-example-photo product-open steel-photo-open" aria-label={`View ${item.title} — photo ${index+1}`} aria-haspopup="dialog" onClick={()=>setPhoto({src,title:item.title,type:item.type,index,count:Math.min(item.images.length,2)})}><img src={src} alt={`${item.title} — ${index+1}`} width={imageMetadata[src].width} height={imageMetadata[src].height} loading="lazy" decoding="async"/></button>)}</div>
   <div className="adsteel-example-copy"><p className="eyebrow">{item.type}</p><h4>{item.title}</h4><p>{item.description}</p></div>
  </article>)}</div>
  <div className="overview-next-step" data-reveal><p>{'Visit the AD Steel website for more projects and construction service details.'}</p><div className="overview-actions"><a className="button" href={service.website} target="_blank" rel="noopener noreferrer">{'Visit AD Steel website'} <span aria-hidden="true">↗</span></a><button className="button" type="button" onClick={()=>onEnquire('AD Steel construction consultation')}>{'Discuss a construction project'} <span aria-hidden="true">↗</span></button></div></div>
  <dialog ref={photoDialog} className="product-dialog steel-image-dialog" aria-labelledby="steel-image-title" onClose={()=>setPhoto(null)} onClick={event=>{if(isDialogBackdropClick(event,photoDialog.current))photoDialog.current.close();}}>
   <button type="button" className="dialog-close" aria-label="Close project image" onClick={()=>photoDialog.current.close()}>×</button>
   {photo&&<><div className="steel-image-caption"><p className="eyebrow">{photo.type}</p><h2 id="steel-image-title">{photo.title}</h2><p>Photo {photo.index+1} of {photo.count}</p></div><img className="steel-image-large" src={photo.src} alt={`${photo.title} — photo ${photo.index+1}`} width={imageMetadata[photo.src].width} height={imageMetadata[photo.src].height} decoding="async"/></>}
  </dialog>
 </section></Localize>;
}
export default memo(AdSteel);
