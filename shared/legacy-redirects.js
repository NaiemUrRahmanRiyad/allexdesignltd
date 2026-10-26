// Exact legacy page paths identified in the old ALLEX site's public navigation.
// No catch-all homepage redirects: unrelated or removed content must return 404.
export const legacyRedirects = [
  ['/bn/', '/'],
  ['/about-us/', '/#about'],
  ['/contact-us/', '/#contact'],
  ['/interiors/', '/#interior-projects'],
  ['/furnitures/', '/#furniture'],
  ['/allex-furniture/', '/#furniture'],
  ['/projects/', '/#projects'],
  ['/portfolio/', '/#projects'],
  ['/our-services/', '/#services'],
  ['/allex-design-interior-solution/', '/#interior-projects'],
  ['/interior-and-furniture-projects/', '/#interior-projects'],
  ['/constructions-project/', '/#adsteel'],
];
export function legacyDestination(pathname) {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return legacyRedirects.find(([from]) => from === normalized)?.[1] || null;
}
export function netlifyRedirects() {
  return '# Generated from shared/legacy-redirects.js\n' + legacyRedirects.flatMap(([from,to]) => [
    `${from} ${to} 301`, `${from.slice(0,-1)} ${to} 301`,
  ]).join('\n') + '\n/bn/index.html / 301\n';
}
// Root deployment on Apache 2.4 with mod_rewrite and FileInfo overrides enabled.
// The existing WordPress front-controller rules must not accompany this file.
export function apacheRedirects() {
  const rules=legacyRedirects.map(([from,to])=>{
    const pattern=from.slice(1,-1).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return `RewriteRule ^${pattern}/?$ ${to} [R=301,L,NE]`;
  });
  return '# Generated ALLEX replacement website routing (Apache)\nDirectoryIndex index.html\nErrorDocument 404 /404.html\nRewriteEngine On\nRewriteRule ^bn/index\\.html$ / [R=301,L,NE]\n'+rules.join('\n')+'\n# No WordPress or SPA catch-all: missing paths return HTTP 404.\n';
}
