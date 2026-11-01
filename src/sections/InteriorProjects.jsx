import { memo, useState } from 'react';
import { useLanguage } from '../i18n/Language.jsx';
import { interiorProjects } from '../data/interior-projects.js';
import { serviceDirectory } from '../data/service-directory.js';
import ProjectImageDialog from '../components/ProjectImageDialog.jsx';
function InteriorProjects({onEnquire}) {
 const [selectedPhoto,setSelectedPhoto]=useState(null);
 const {language}=useLanguage();const n=language==='bn'?1:0;const service=serviceDirectory[0];
 return <section id="interior-projects" className="interior-projects section service-overview" aria-labelledby="interior-projects-title">
  <div className="interior-projects-heading" data-reveal><p className="eyebrow">{service.brand.toUpperCase()} / {service.title[n]}</p><h2 id="interior-projects-title">{'Spaces with'} <em>{'character.'}</em></h2><p>{service.summary[n]}</p></div>
  <div className="overview-ranges" aria-label={'Interior services'}>{service.ranges.map(range=><span key={range[0]}>{range[n]}</span>)}</div>
  <p className="overview-selection-label">{'Commercial & residential interior work'}</p>
  <div id="interior-project-collection" className="interior-project-list">{interiorProjects.map(project=><article className="interior-project-card" key={project.id} data-reveal data-reveal-repeat>
   <div className="interior-project-gallery">{project.images.slice(0,2).map((photo,index)=><button key={photo.src} type="button" className="interior-project-image product-open project-photo-open interior-photo-open" aria-label={`View ${project.company} — photo ${index+1}`} aria-haspopup="dialog" onClick={()=>setSelectedPhoto({...photo,images:project.images,title:project.company,type:project.scope,index,count:project.images.length})}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/></button>)}</div>
   <div className="interior-project-copy"><div><h3>{project.company}</h3><p className="interior-project-scope">{project.scope}</p><p>{project.description}</p><button type="button" className="furniture-text-link interior-gallery-link" aria-haspopup="dialog" onClick={()=>setSelectedPhoto({...project.images[0],images:project.images,title:project.company,type:project.scope,index:0,count:project.images.length})}>View all {project.images.length} photos <span aria-hidden="true">↗</span></button></div></div>
  </article>)}</div>
  <div className="overview-next-step" data-reveal><p>{'Tell us about your space, requirements and style.'}</p><div className="overview-actions"><button type="button" className="button" onClick={()=>onEnquire('Interior design consultation')}>{'Discuss your interior'} <span aria-hidden="true">↗</span></button>{service.website?<a className="furniture-text-link" href={service.website} target="_blank" rel="noopener noreferrer">{'Visit interior website ↗'}</a>:<a className="furniture-text-link" href="#projects">{'Watch project films ↗'}</a>}</div></div>
  <ProjectImageDialog photo={selectedPhoto} onClose={()=>setSelectedPhoto(null)} titleId="interior-image-title" />
 </section>;
}
export default memo(InteriorProjects);
