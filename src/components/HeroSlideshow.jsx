import { memo } from 'react';
import { Localize } from '../i18n/Language.jsx';
import { useEffect, useState } from 'react';
import slideOne from '../../images/allex-home-slide-001.jpeg';
import slideTwo from '../../images/allex-home-slide-002.jpeg';
import { Typewriter, useReducedMotion } from './Effects.jsx';
import { content } from '../data/content.js';

const slides = [
  {
    src: slideOne,
    srcSet: `/media/hero-1-800.webp 800w, /media/hero-1-1200.webp 1200w, ${slideOne} 1600w`,
    alt: 'ALLEX Design banner: exceptional workspaces for greater business, featuring a bright contemporary office interior.',
  },
  {
    src: slideTwo,
    srcSet: `/media/hero-2-800.webp 800w, /media/hero-2-1200.webp 1200w, ${slideTwo} 1600w`,
    alt: 'ALLEX Design banner: exceptional workspaces for greater business, featuring a warm modern living room.',
  },
];

const slideInterval = 6000;
// Cover images may be wider than a portrait screen; reserve enough source pixels for their height.
const heroImageSizes = 'max(100vw, calc((100svh - 180px) * 1.778))';
const slideImageLoads = new Map();

function preloadSlide(slide, priority = 'high') {
  const { src } = slide;
  if (slideImageLoads.has(src)) return slideImageLoads.get(src);

  const image = new Image();
  image.fetchPriority = priority;
  const load = new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => {
      slideImageLoads.delete(src);
      reject(new Error(`Unable to load hero slide: ${src}`));
    };
  });
  slideImageLoads.set(src, load);
  image.sizes = heroImageSizes;
  image.srcset = slide.srcSet;
  image.src = src;
  return load;
}

function HeroSlideshow({ onBookConsultation }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const preload = () => {
      preloadSlide(slides[1], 'low')
        .then(() => setLoadedSlides(current => new Set(current).add(1)))
        .catch(error => console.error('Unable to preload the next hero slide.', error));
    };
    let idleId;
    const timer = window.setTimeout(() => {
      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(preload, { timeout: 2000 });
      } else {
        preload();
      }
    }, 1800);
    return () => {
      window.clearTimeout(timer);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, [reducedMotion]);

  function activateSlide(index) {
    if (loadedSlides.has(index)) {
      setActiveSlide(index);
      return;
    }
    preloadSlide(slides[index])
      .then(() => {
        setLoadedSlides(current => new Set(current).add(index));
        setActiveSlide(index);
      })
      .catch(error => console.error('Unable to load the selected hero slide.', error));
  }

  function togglePlayback() {
    setPaused(paused || focused ? false : true);
    setFocused(false);
  }

  useEffect(() => {
    if (paused || focused || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      const bounds = document.getElementById('home')?.getBoundingClientRect();
      if (document.visibilityState !== 'visible' || !bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      activateSlide((activeSlide + 1) % slides.length);
    }, slideInterval);
    return () => window.clearInterval(timer);
  }, [activeSlide, paused, focused, reducedMotion, loadedSlides]);

  return <Localize><div className="home-screen">
    <span className="home-rose-corners" aria-hidden="true" />
    <section
      id="home"
      className="hero hero-slideshow"
      aria-label="ALLEX Design featured interiors"
      aria-roledescription="carousel"
      onFocus={event => { if (event.target.matches(':focus-visible')) setFocused(true); }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <h1 className="sr-only">Exceptional workspaces for greater business</h1>
      <div className="hero-slides" aria-live={paused || focused || reducedMotion ? 'polite' : 'off'}>
        {slides.map((slide, index) => loadedSlides.has(index) && <img
          key={slide.src}
          className={`hero-slide${activeSlide === index ? ' is-active' : ''}`}
          src={slide.src}
          srcSet={slide.srcSet}
          sizes={heroImageSizes}
          width="1600"
          height="900"
          alt={slide.alt}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          loading="eager"
          decoding="async"
          aria-hidden={activeSlide !== index}
        />)}
      </div>
      <div className="hero-cta" aria-label="Explore ALLEX services">
        <a className="hero-cta-primary" href="#projects">View our projects <span aria-hidden="true">↗</span></a>
        <button className="hero-cta-secondary" type="button" onClick={onBookConsultation}>Book a consultation</button>
      </div>
      <div className="hero-slideshow-controls" aria-label="Choose featured image">
        {!reducedMotion && <button
          className="hero-autoplay-toggle"
          type="button"
          aria-label={paused || focused ? 'Play slideshow' : 'Pause slideshow'}
          aria-pressed={paused || focused}
          onClick={togglePlayback}
        ><span aria-hidden="true">{paused || focused ? '▶' : 'Ⅱ'}</span></button>}
        {slides.map((slide, index) => <button
          key={slide.src}
          className={`hero-slide-indicator${activeSlide === index ? ' is-active' : ''}`}
          type="button"
          aria-label={`Show slide ${index + 1}`}
          aria-pressed={activeSlide === index}
          onClick={() => activateSlide(index)}
        ><span /></button>)}
      </div>
    </section>
    <div className="hero-typewriter" aria-label="ALLEX services">
      <span className="hero-typewriter-label">FROM CONCEPT TO COMPLETION</span>
      <div><span className="hero-typewriter-intro">Spaces shaped around</span><Typewriter phrases={content.phrases} /></div>
    </div>
  </div></Localize>;
}


export default memo(HeroSlideshow);
