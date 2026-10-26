export function contactOrigins(env={}) {
  const origins=(env.ALLOWED_ORIGINS||'').split(',').map(value=>value.trim()).filter(Boolean);
  // Netlify supplies these read-only server values. Never trust a request Host header.
  if(env.SITE_ID&&env.URL){
    try{const url=new URL(env.URL);if(url.protocol==='https:'&&!url.username&&!url.password&&url.pathname==='/'&&!url.search&&!url.hash)origins.push(url.origin);}catch{}
  }
  return [...new Set(origins)];
}
