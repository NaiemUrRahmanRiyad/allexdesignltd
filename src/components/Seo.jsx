import { useEffect } from 'react';
import { useLanguage } from '../i18n/Language.jsx';
import { pageUrl, seoCopy, siteOrigin } from '../../shared/seo.js';
export default function Seo() {
  const { language } = useLanguage();
  useEffect(() => {
    const copy = seoCopy[language]; const origin = siteOrigin(import.meta.env.VITE_SITE_URL || 'https://www.allexdesign.com');
    document.title = copy.title;
    for (const [selector, value] of Object.entries({ 'meta[name="description"]': copy.description, 'meta[property="og:title"]': copy.title, 'meta[property="og:description"]': copy.description, 'meta[property="og:url"]': pageUrl(origin, language), 'meta[property="og:locale"]': copy.locale, 'meta[property="og:image:alt"]': copy.imageAlt, 'meta[name="twitter:title"]': copy.title, 'meta[name="twitter:description"]': copy.description, 'meta[name="twitter:image:alt"]': copy.imageAlt })) document.querySelector(selector)?.setAttribute('content', value);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl(origin, language));
  }, [language]);
  return null;
}
