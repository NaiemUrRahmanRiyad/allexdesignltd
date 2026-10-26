import { memo, useState } from 'react';
import { useLanguage } from '../i18n/Language.jsx';
import { interiorProjects } from '../data/interior-projects.js';
import { serviceDirectory } from '../data/service-directory.js';
function InteriorProjects({onEnquire}) {
 const [expanded,setExpanded]=useState(false);
 const {language}=useLanguage();const n=language==='bn'?1:0;const service=serviceDirectory[0];
 return <section id="interior-projects" className="interior-projects section service-overview" aria-labelledby="interior-projects-title">
  <div className="interior-projects-heading" data-reveal><p className="eyebrow">{service.brand.toUpperCase()} / {service.title[n]}</p><h2 id="interior-projects-title">{'Spaces with'} <em>{'character.'}</em></h2><p>{service.summary[n]}</p></div>
  <div className="overview-ranges" aria-label={'Interior services'}>{service.ranges.map(range=><span key={range[0]}>{range[n]}</span>)}</div>
  <p className="overview-selection-label">{'Selected interior work'}</p>
  <div id="interior-project-collection" className="interior-project-list">{interiorProjects.map((project,index)=><article className="interior-project-card" hidden={!expanded&&index>=3} key={project.id} data-reveal data-reveal-repeat>
   <div className="interior-project-gallery">{project.images.slice(0,2).map(photo=><a key={photo.src} className="interior-project-image" href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`${project.company} — ${'View full image'}`}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/></a>)}</div>
   <div className="interior-project-copy"><div><h3>{project.company}</h3><p className="interior-project-scope">{project.scope}</p><p>{project.description}</p></div></div>
  </article>)}</div>
  {interiorProjects.length>3&&<div className="interior-project-actions"><button type="button" className="button" aria-expanded={expanded} aria-controls="interior-project-collection" onClick={()=>setExpanded(value=>!value)}>{expanded?('Show less'):('Show more')} <span aria-hidden="true">{expanded?'−':'+'}</span></button></div>}
  <div className="overview-next-step" data-reveal><p>{'Tell us about your space, requirements and style.'}</p><div className="overview-actions"><button type="button" className="button" onClick={()=>onEnquire('Interior design consultation')}>{'Discuss your interior'} <span aria-hidden="true">↗</span></button>{service.website?<a className="furniture-text-link" href={service.website} target="_blank" rel="noopener noreferrer">{'Visit interior website ↗'}</a>:<a className="furniture-text-link" href="#projects">{'Watch project films ↗'}</a>}</div></div>
 </section>;
}
export default memo(InteriorProjects);
