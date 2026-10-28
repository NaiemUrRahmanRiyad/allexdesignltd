import imageMetadata from './data/image-metadata.json';
import { Localize, useLanguage } from './i18n/Language.jsx';
import { useCallback, useEffect, useState } from 'react';
import logo from '../images/Company_Logo.png';
import constructionImage from '../images/03.jpg';
import projects from './data/projects.json';
import { content } from './data/content.js';
import { serviceDirectory } from './data/service-directory.js';
import { Counter, PageControls, useScrollReveal } from './components/Effects.jsx';
import HeroSlideshow from './components/HeroSlideshow.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import Contact from './sections/Contact.jsx';
import Furniture from './sections/Furniture.jsx';
import InteriorProjects from './sections/InteriorProjects.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import AdSteel from './sections/AdSteel.jsx';
import Clients from './sections/Clients.jsx';
import ServicesDropdown from './components/ServicesDropdown.jsx';
import FaqChatbot from './components/FaqChatbot.jsx';
import { useMobileViewport } from './components/useMobileViewport.js';
const serviceImageKeys=['/images/03.jpg','/services/custom-furniture-workshop.webp','/services/construction-framework.webp','/services/steel-warehouse-interior.webp'];
export default function App() {
  const { language } = useLanguage(); const n=language==='bn'?1:0;
  const [menu, setMenu] = useState(false); const [activeNav, setActiveNav] = useState('home'); const [contactRequest, setContactRequest] = useState({ id: 0, subject: '' });
  const openContactForm = useCallback((subject = '', product = null) => setContactRequest(request => ({ id: request.id + 1, subject, product })), []);
  const bookConsultation = useCallback(() => openContactForm('Consultation'), [openContactForm]);
  useEffect(() => {
    if (!menu) return;
    const closeOutside = event => { if (!event.target.closest('header')) setMenu(false); };
    const closeEscape = event => { if (event.key === 'Escape') { setMenu(false); document.querySelector('.menu-toggle')?.focus(); } };
    const media = window.matchMedia('(min-width: 1101px)'); const closeDesktop = () => { if (media.matches) setMenu(false); };
    document.addEventListener('pointerdown', closeOutside); document.addEventListener('keydown', closeEscape); media.addEventListener('change', closeDesktop);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape); media.removeEventListener('change', closeDesktop); };
  }, [menu]);
  useScrollReveal();
  useMobileViewport();
  const validProjects = projects.filter(p => p && typeof p.id === 'string');
  useEffect(() => {
    const sections = ['home', 'about', 'services', 'furniture', 'interior-projects', 'adsteel', 'projects']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio);
      if (visibleSections[0]) setActiveNav(visibleSections[0].target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <Localize>
    <PageControls />
    <div className="ambient-light" aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <header>
      <a href="#home" className="brand" aria-label="ALLEX Design and Development Ltd. — home"><img src={logo} alt="ALLEX" width="65" height="62" /><span className="brand-name">DESIGN &amp;<br />DEVELOPMENT LTD.</span></a>
      <div className="header-tools"><ThemeToggle /><button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="navigation">{menu ? 'Close' : 'Menu'}</button></div>
      <nav id="navigation" className={menu ? 'open' : ''}>{[['home', 'Home'], ['about', 'About Us'], ['services', 'Services'], ['projects', 'Projects']].map(([id, label]) => id === 'services' ? <ServicesDropdown key={id} active={['services','furniture','adsteel','interior-design','interior-projects'].includes(activeNav)} onNavigate={target=>{setActiveNav(target);setMenu(false);}} /> : <a key={id} href={`#${id}`} aria-current={activeNav === id ? 'location' : undefined} onClick={() => { setActiveNav(id); setMenu(false); }}>{label}</a>)}<button className="contact-nav-trigger" onClick={() => { setMenu(false); openContactForm(); }}>Let’s talk <span aria-hidden="true">↗</span></button></nav>
    </header>
    <main id="main">
      <HeroSlideshow onBookConsultation={bookConsultation} />
      <section id="about" className="about section" aria-labelledby="about-title">
        <div className="about-overview-card">
          <span className="botanical-corner-detail" aria-hidden="true" />
        <div className="about-section-heading" data-reveal><h2 id="about-title">ABOUT ALLEX DESIGN</h2><p>Design · Furniture · Execution</p></div>
        <div className="about-intro" data-reveal>
          <div className="about-intro-copy">
            <h2>Designing better spaces.<br /><em>Building better experiences.</em></h2>
            <p className="about-copy">{content.about}</p>
            <p className="about-copy">We start with how you want to use the space. Then we work through the layout, materials and furniture so the result looks good and feels comfortable to use.</p>
            <p className="about-copy">ALLEX Furniture handles custom furniture, while AD Steel & Construction works on steel structures and construction. You can discuss these services with us alongside your interior requirements.</p>
          </div>
          <div className="about-kicker">
            <div className="about-linked-expertise" aria-label="Explore our connected expertise">
              <p className="about-linked-label">CONNECTED EXPERTISE</p>
              <a href="#interior-projects"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 26V7h22v19H5Zm0-11h12V7m0 8v11m0-5h10" /></svg><div><strong>Interior design</strong><span>Spaces planned around you.</span></div><span className="about-linked-arrow" aria-hidden="true">↗</span></a>
              <a href="#furniture"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 18V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10M5 14v10h22V14M5 18h22M8 24v4m16-4v4" /></svg><div><strong>Custom furniture</strong><span>Made for your space.</span></div><span className="about-linked-arrow" aria-hidden="true">↗</span></a>
              <a href="#adsteel"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27V12l11-7 11 7v15M5 12h22M10 12v15m12-15v15M5 27h22M10 12l12 15m0-15L10 27" /></svg><div><strong>Steel & construction</strong><span>Built through AD Steel.</span></div><span className="about-linked-arrow" aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <div className="about-story" data-reveal>
          <div className="about-approach">
            <p className="eyebrow">OUR APPROACH</p>
            <h3>From the first conversation to the final installation.</h3>
            <p>{content.howWeWork}</p>
          </div>
          <div className="about-experience">
            {content.statistics.map((stat, i) => <Counter key={i} {...stat} />)}
          </div>
        </div>
        <div className="about-highlights" data-reveal>
          <div className="about-highlights-heading">
            <p className="eyebrow">WHAT SETS US APART</p>
            <p>Design, furniture production and support from a team that understands your project.</p>
          </div>
          <div className="studio-purpose">
            {content.companyHighlights.map((highlight, i) => <article key={highlight.title} data-reveal style={{ '--reveal-delay': `${i * 90}ms` }}><h3>{highlight.title}</h3><p>{highlight.description}</p></article>)}
          </div>
        </div>        </div>
      </section>
      <section id="services" className="services section">
        <div className="section-heading service-intro" data-reveal>
          <div><p className="eyebrow">OUR SERVICES</p><h2>From first idea<br />to <em>finished space.</em></h2></div>
          <p>{'Explore our interior, furniture and construction services below. For the full furniture collection or more steel project details, visit the relevant company website.'}</p>
        </div>
        <div className="service-grid service-directory-grid">
          {serviceDirectory.map((entry, i) => <article className="service-card" id={i === 0 ? 'interior-design' : undefined} key={entry.id} data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
            <div className="service-card-image">
              <img src={[constructionImage, '/services/custom-furniture-workshop.webp', '/services/construction-framework.webp', '/services/steel-warehouse-interior.webp'][entry.sourceIndex]} srcSet={i === 0 ? `/media/service-interior-480.webp 480w, /media/service-interior-960.webp 960w, ${constructionImage} 1600w` : undefined} sizes={i === 0 ? '(max-width:560px) 90vw, (max-width:1100px) 42vw, 20vw' : undefined} alt={content.services[entry.sourceIndex].imageAlt} loading="lazy" decoding="async" width={imageMetadata[serviceImageKeys[entry.sourceIndex]].width} height={imageMetadata[serviceImageKeys[entry.sourceIndex]].height} />
              <span className="service-card-eyebrow">{entry.brand}</span>
            </div>
            <div className="service-card-copy">
              <h3>{entry.title[n]}</h3>
              <p>{entry.summary[n]}</p>
              <div className="service-card-actions"><a className="button service-card-link" href={'#'+entry.anchor}>{'View overview'} <span aria-hidden="true">↓</span></a>{entry.website?<a className="furniture-text-link" href={entry.website} target="_blank" rel="noopener noreferrer">{'Visit specialist website ↗'}</a>:<button className="service-card-link" onClick={()=>openContactForm('Interior design consultation')}>{'Discuss your project'} <span aria-hidden="true">↗</span></button>}</div>
            </div>
          </article>)}
        </div>
        <div className="project-process" data-reveal>
          <div className="project-process-heading">
            <p className="eyebrow">HOW WE WORK</p>
            <h3>From first conversation<br />to <em>finished space.</em></h3>
          </div>
          <ol className="project-process-steps" data-reveal data-reveal-repeat>
            {content.projectProcess.map((step, i) => <li key={step.title} style={{ '--reveal-delay': `${i * 180}ms` }}>
              <span className="project-process-number">{String(i + 1).padStart(2, '0')}</span>
              <div><h4>{step.title}</h4><p>{step.description}</p></div>
            </li>)}
          </ol>
        </div>
      </section>
      <InteriorProjects onEnquire={openContactForm} />
      <Furniture onEnquire={openContactForm} />
      <AdSteel onEnquire={openContactForm} />
      <section id="projects" className="projects section">
        <div className="section-heading project-intro" data-reveal>
          <div><p className="eyebrow">PROJECT FILMS</p><h2>Spaces in <em>motion.</em></h2></div>
          <p>Watch our project videos to see the spaces and the work in more detail.</p>
        </div>
        <div className="project-grid">{validProjects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}</div>
      </section>
      <Clients />
      <FaqChatbot onConsultation={bookConsultation} />
      <Contact openRequest={contactRequest.id} initialSubject={contactRequest.subject} initialProduct={contactRequest.product} onOpenForm={openContactForm} />
    </main>
    <footer className="site-footer" data-reveal data-reveal-repeat><div className="footer-brand"><a href="#home" className="footer-logo" aria-label="ALLEX home"><img src={logo} alt="ALLEX Design and Development Ltd." width="60" height="56" /></a><div><p>{content.name}</p><span>Design · Furniture · Execution</span></div></div><small className="footer-copyright">© 2026 All rights reserved.</small></footer>
  </Localize>;
}




