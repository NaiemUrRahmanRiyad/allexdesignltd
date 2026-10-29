import { useEffect } from 'react';
import { mobileViewportState } from '../../shared/mobile-viewport.js';

export function useMobileViewport() {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    let frame, focusTimer, baselineHeight = window.innerHeight, previous = '', previousActive;
    function update() {
      frame = undefined;
      const active = document.activeElement;
      const editable = !!active?.matches('input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]),textarea,[contenteditable="true"]');
      if (!editable) baselineHeight = window.innerHeight;
      const state = mobileViewportState({ width:window.innerWidth, height:viewport?.height ?? window.innerHeight, offsetTop:viewport?.offsetTop ?? 0, layoutHeight:window.innerHeight, baselineHeight, editable });
      const key = `${state.mobile}:${state.height}:${state.top}:${state.keyboard}`;
      const changed = previous !== key;
      if (changed) {
        previous = key;
        root.classList.toggle('mobile-keyboard-open', state.keyboard);
        if (state.mobile) {
          root.style.setProperty('--mobile-viewport-height', `${state.height}px`);
          root.style.setProperty('--mobile-viewport-top', `${state.top}px`);
        } else {
          root.style.removeProperty('--mobile-viewport-height');
          root.style.removeProperty('--mobile-viewport-top');
        }
      }
      const focusChanged = previousActive !== active;
      previousActive = active;
      if (!changed && !focusChanged) return;
      clearTimeout(focusTimer);
      if (state.keyboard && active?.closest('dialog[open]')) {
        focusTimer = setTimeout(() => {
          if (document.activeElement === active) active.scrollIntoView({ block:'nearest', inline:'nearest', behavior:'instant' });
        }, 120);
      }
    }
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    update();
    viewport?.addEventListener('resize', schedule, { passive:true });
    viewport?.addEventListener('scroll', schedule, { passive:true });
    window.addEventListener('resize', schedule, { passive:true });
    document.addEventListener('focusin', schedule);
    document.addEventListener('focusout', schedule);
    return () => {
      cancelAnimationFrame(frame); clearTimeout(focusTimer);
      viewport?.removeEventListener('resize', schedule); viewport?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('focusin', schedule); document.removeEventListener('focusout', schedule);
      root.classList.remove('mobile-keyboard-open');
      root.style.removeProperty('--mobile-viewport-height'); root.style.removeProperty('--mobile-viewport-top');
    };
  }, []);
}
