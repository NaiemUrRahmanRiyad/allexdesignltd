import { Localize, useLanguage, translate } from '../i18n/Language.jsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { startRevealRuntime } from './reveal-runtime.js';
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  return reduced;
}
export function useScrollReveal() {
  const reduced = useReducedMotion();
  useEffect(() => startRevealRuntime(reduced), [reduced]);
}
export function Typewriter({ phrases: originalPhrases }) {
  const { language } = useLanguage(); const phrases = useMemo(() => originalPhrases.map(text => translate(text, language)), [originalPhrases, language]);
  const reduced = useReducedMotion(); const [text, setText] = useState(phrases[0]);
  const element = useRef();
  useEffect(() => {
    setText(phrases[0]);
    if (reduced) return;
    let timer, due = 0, remaining = 2600, index = 0, count = phrases[0].length, deleting = true, nearby = false;
    const active = () => nearby && !document.hidden;
    const schedule = () => { if (active() && timer === undefined) { due = performance.now() + remaining; timer = setTimeout(tick, remaining); } };
    const tick = () => {
      timer = undefined;
      count += deleting ? -1 : 1;
      setText(phrases[index].slice(0, count));
      remaining = deleting ? 45 : 80;
      if (count === 0) { deleting = false; index = (index + 1) % phrases.length; remaining = 350; }
      else if (count === phrases[index].length) { deleting = true; remaining = 2600; }
      schedule();
    };
    const update = () => {
      element.current.classList.toggle('effect-paused', !active());
      if (active()) schedule();
      else if (timer !== undefined) { remaining = Math.max(0, due - performance.now()); clearTimeout(timer); timer = undefined; }
    };
    const observer = new IntersectionObserver(entries => { nearby = entries[0].isIntersecting; update(); }, { rootMargin:'100px' });
    observer.observe(element.current);
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(timer); observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [phrases, reduced]);
  return <Localize><div ref={element} className="typewriter"><span className="sr-only">{phrases.join('. ')}</span><span aria-hidden="true">{reduced ? phrases[0] : text}</span></div></Localize>;
}
export function PageControls({ threshold = 500 }) {
  const progress = useRef(); const [visible, setVisible] = useState(false); const reduced = useReducedMotion();
  useEffect(() => {
    let frame;
    let maxScroll = 0;
    let isVisible = false;
    const update = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const scrollY = window.scrollY;
        progress.current.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0})`;
        const nextVisible = scrollY > threshold;
        if (nextVisible !== isVisible) {
          isVisible = nextVisible;
          setVisible(nextVisible);
        }
      });
    };
    const measure = () => {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      update();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
    };
  }, [threshold]);
  return <Localize><div className="scroll-progress" ref={progress} aria-hidden="true" />{visible && <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })}>↑</button>}</Localize>;
}
export function Particles() {
  const reduced = useReducedMotion();
  return <div className={`particles ${reduced ? 'still' : ''}`} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${(i * 29) % 100}%`, top: `${(i * 17) % 100}%`, animationDelay: `${-i}s` }} />)}</div>;
}
export function CursorAccent({ areaRef }) {
  const dot = useRef(); const reduced = useReducedMotion();
  useEffect(() => { const media = window.matchMedia('(hover: hover) and (pointer: fine)'); if (reduced) return; const area = areaRef.current; const move = event => { if (!media.matches) return; dot.current.style.display = 'block'; dot.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`; }; const leave = () => { dot.current.style.display = 'none'; }; area.addEventListener('pointermove', move); area.addEventListener('pointerleave', leave); media.addEventListener('change', leave); return () => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave); media.removeEventListener('change', leave); }; }, [areaRef, reduced]);
  return <span className="cursor-accent" aria-hidden="true" ref={dot} />;
}
export function Counter({ value, start = 0, duration = 1600, suffix = '', label }) {
  const element = useRef();
  const reduced = useReducedMotion();
  const [number, setNumber] = useState(start);
  useEffect(() => {
    if (!Number.isFinite(value)) return undefined;
    if (reduced || !('IntersectionObserver' in window)) {
      setNumber(value);
      return undefined;
    }

    setNumber(start);
    let frame;
    const observer = new IntersectionObserver(entries => {
      cancelAnimationFrame(frame);
      if (!entries.some(entry => entry.isIntersecting)) {
        setNumber(start);
        return;
      }
      setNumber(start);
      const began = performance.now();
      const tick = now => {
        const fraction = Math.min(1, (now - began) / Math.max(1, duration));
        setNumber(Math.round(start + (value - start) * (1 - (1 - fraction) ** 3)));
        if (fraction < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.25 });
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, start, duration, reduced]);
  return <Localize><div ref={element} className="stat"><strong>{Number.isFinite(value) ? `${reduced ? value : number}${suffix}` : '[ADD VERIFIED COMPANY STATISTIC HERE]'}</strong><span>{label}</span></div></Localize>;
}
