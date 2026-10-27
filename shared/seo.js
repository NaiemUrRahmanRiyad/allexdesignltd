export const productionOrigin = 'https://www.allexdesign.com';
export const seoCopy = {
  en: { title: 'Interior Design, Furniture & Steel Construction Dhaka | ALLEX', description: 'ALLEX Design in Banani, Dhaka: home and office interior design, custom furniture and AD Steel construction. View completed projects and request a consultation.', imageAlt: 'ALLEX Design — exceptional workspaces and interior design', locale: 'en_US' },
};
export function siteOrigin(value = productionOrigin) {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('VITE_SITE_URL must be a plain HTTP(S) site origin.');
  return parsed.origin;
}
export function pageUrl(origin, language) { return `${siteOrigin(origin)}/`; }
