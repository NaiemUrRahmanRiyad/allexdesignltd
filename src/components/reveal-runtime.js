const cardSelector = '.service-card, .furniture-card, .project-card, .interior-project-card, .client-logo-card, .furniture-feedback-card, .studio-purpose article, .furniture-purpose article, .adsteel-photo-card, .adsteel-capabilities article, .adsteel-example-card';
const revealSelector = `[data-reveal], ${cardSelector}`;
export function startRevealRuntime(reduced) {
  const elements = new Set();
  const canObserve = 'IntersectionObserver' in window;
  const observer = canObserve && !reduced ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target;
      if (entry.isIntersecting) {
        element.classList.add('is-visible');
        if (!element.hasAttribute('data-reveal-repeat') && !element.matches(cardSelector)) observer.unobserve(element);
      } else if (element.hasAttribute('data-reveal-repeat') || element.matches(cardSelector)) element.classList.remove('is-visible');
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
  // Allocate the original glow only near the screen, preserving its paused phase.
  const nearby = canObserve ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target;
      if (entry.isIntersecting) element.classList.add('glow-ready');
      else {
        const orbit = element.getAnimations?.().find(animation => animation.animationName === 'card-border-orbit');
        if (typeof orbit?.currentTime === 'number') {
          const delay = Number(orbit.effect?.getTiming().delay) || 0;
          element.style.setProperty('--glow-delay', `${-((orbit.currentTime - delay) % 7000)}ms`);
        }
        element.classList.remove('glow-ready');
      }
    }
  }, { rootMargin:'400px', threshold:0 }) : null;
  function register(element) {
    if (elements.has(element)) return;
    elements.add(element);
    if (element.matches(cardSelector)) {
      element.classList.add('card-reveal');
      if (nearby) nearby.observe(element); else element.classList.add('glow-ready');
    }
    if (observer) observer.observe(element);
    else element.classList.add('is-visible');
  }
  document.querySelectorAll(revealSelector).forEach(register);
  if (observer) document.documentElement.classList.add('motion-ready');
  const syncVisibility = () => document.documentElement.classList.toggle('card-glow-paused', document.hidden);
  syncVisibility();document.addEventListener('visibilitychange', syncVisibility);
  // Counter/typewriter text updates cannot add cards: inspect new element subtrees only.
  const additions = new MutationObserver(records => {
    let removedElements = false;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches(revealSelector)) register(node);
        node.querySelectorAll(revealSelector).forEach(register);
      }
      if ([...record.removedNodes].some(node => node.nodeType === 1)) removedElements = true;
    }
    if (removedElements) for (const element of elements) if (!element.isConnected) {
      observer?.unobserve(element); nearby?.unobserve(element); elements.delete(element);
    }
  });
  additions.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  return () => {
    additions.disconnect(); observer?.disconnect(); nearby?.disconnect();
    document.removeEventListener('visibilitychange', syncVisibility);
    document.documentElement.classList.remove('card-glow-paused', 'motion-ready');
    elements.forEach(element => { element.classList.remove('is-visible', 'card-reveal', 'glow-ready'); element.style.removeProperty('--glow-delay'); });
  };
}
