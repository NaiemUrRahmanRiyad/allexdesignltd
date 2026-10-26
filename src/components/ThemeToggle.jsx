import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/Language.jsx';
import { resolveTheme } from '../../shared/theme.js';
const KEY = 'allex-theme';
function storedTheme() { try { return localStorage.getItem(KEY); } catch { return null; } }
export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const preference = useRef(null);
  const { language } = useLanguage();
  function apply(next) { document.documentElement.dataset.theme = next; document.documentElement.style.colorScheme = next; setTheme(next); }
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    preference.current = storedTheme();
    apply(resolveTheme(preference.current, media.matches));
    const update = () => apply(resolveTheme(preference.current, media.matches));
    const sync = event => { if (event.key === KEY || event.key === null) { preference.current = storedTheme(); update(); } };
    media.addEventListener('change', update); window.addEventListener('storage', sync);
    return () => { media.removeEventListener('change', update); window.removeEventListener('storage', sync); };
  }, []);
  function toggle() { const next = theme === 'dark' ? 'light' : 'dark'; preference.current = next; try { localStorage.setItem(KEY, next); } catch {} apply(next); }
  const label = theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode';
  return <button type="button" className="theme-toggle" aria-label={label} title={label} aria-pressed={theme === 'dark'} onClick={toggle}><svg viewBox="0 0 24 24" aria-hidden="true">{theme === 'dark' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.5 14a8.8 8.8 0 0 1-10.5-10.5A8.8 8.8 0 1 0 20.5 14Z" />}</svg></button>;
}
