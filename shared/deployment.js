import { productionOrigin, siteOrigin } from './seo.js';

// The temporary Netlify site must not compete with the existing official site in search.
export function deploymentSettings(env = {}) {
  const target=env.ALLEX_DEPLOYMENT || (env.NETLIFY==='true'?'netlify':'official');
  if(!['netlify','official'].includes(target))throw new Error('Choose netlify or official deployment.');
  const origin=siteOrigin(target==='netlify'
    ? env.URL || env.NETLIFY_SITE_URL || env.VITE_SITE_URL || productionOrigin
    : env.VITE_SITE_URL || productionOrigin);
  return {target,origin,indexable:target==='official'};
}
