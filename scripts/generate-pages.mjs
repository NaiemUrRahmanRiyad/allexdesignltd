import fs from 'node:fs/promises';
import { render } from '../.ssr/entry-server.js';
import { seoCopy, pageUrl } from '../shared/seo.js';
import { netlifyRedirects, apacheRedirects } from '../shared/legacy-redirects.js';
import { notFoundHtml } from '../shared/not-found.js';
import { deploymentSettings } from '../shared/deployment.js';
const {origin,indexable}=deploymentSettings(process.env);
const template = await fs.readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for (const language of ['en']) {
  const copy = seoCopy[language];
  const tags = `<title>${escape(copy.title)}</title>
<meta name="description" content="${escape(copy.description)}">
<meta name="robots" content="${indexable?'index,follow,max-image-preview:large':'noindex,follow'}">
<link rel="canonical" href="${pageUrl(origin,language)}">
<link rel="alternate" hreflang="en" href="${origin}/">
<link rel="alternate" hreflang="x-default" href="${origin}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ALLEX Design and Development Ltd.">
<meta property="og:title" content="${escape(copy.title)}">
<meta property="og:description" content="${escape(copy.description)}">
<meta property="og:url" content="${pageUrl(origin,language)}">
<meta property="og:locale" content="${copy.locale}">
<meta property="og:image" content="${origin}/social-preview.jpeg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${escape(copy.imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(copy.title)}">
<meta name="twitter:description" content="${escape(copy.description)}">
<meta name="twitter:image" content="${origin}/social-preview.jpeg">
<meta name="twitter:image:alt" content="${escape(copy.imageAlt)}">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'ALLEX Design and Development Ltd.',url:origin,logo:`${origin}/brand-logo.png`,image:`${origin}/social-preview.jpeg`,telephone:'+8801762689690',email:'info@allexdesign.com',address:{'@type':'PostalAddress',streetAddress:'NI Tower (Level 7), Plot 01, Road 10, Block E, Banani',addressLocality:'Dhaka',postalCode:'1213',addressCountry:'BD'},sameAs:['https://www.facebook.com/TheAllexDesign','https://www.youtube.com/@theallexdesign','https://www.instagram.com/allexgroup/']}).replaceAll('<','\\u003c')}</script>`;
  const html = template.replace(/lang="en"/, `lang="${language}"`).replace(/<!--SEO_START-->[\s\S]*?<!--SEO_END-->/,tags).replace('<div id="root"></div>',`<div id="root">${render(language)}</div>`);
  const target = 'dist'; await fs.mkdir(target,{recursive:true}); await fs.writeFile(`${target}/index.html`,html);
}
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile('dist/404.html',notFoundHtml('en'));
await fs.writeFile('dist/_redirects',netlifyRedirects());
await fs.writeFile('dist/.htaccess',apacheRedirects());
if(!indexable)await fs.writeFile('dist/_headers','/*\n  X-Robots-Tag: noindex, follow\n');
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`);
console.log('Rendered English-only pages, social metadata, robots and sitemap.');
