export const productionOrigin = 'https://www.allexdesign.com';
export const seoCopy = {
  en: { title: 'ALLEX Design | Interior, Furniture & Development in Dhaka', description: 'Explore ALLEX Design’s interior design, custom furniture, construction and steel-structure services in Dhaka. View projects and discuss your space with our team.', imageAlt: 'ALLEX Design — exceptional workspaces and interior design', locale: 'en_US' },
};
export function siteOrigin(value = productionOrigin) {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('VITE_SITE_URL must be a plain HTTP(S) site origin.');
  return parsed.origin;
}
export function pageUrl(origin, language) { return `${siteOrigin(origin)}/`; }
