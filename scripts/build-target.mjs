import { spawnSync } from 'node:child_process';
import { productionOrigin, siteOrigin } from '../shared/seo.js';

const target=process.argv[2];
if(!['netlify','official'].includes(target))throw new Error('Choose netlify or official.');
const option=process.argv.slice(3).find(value=>value.startsWith('--url='));
const env={...process.env,ALLEX_DEPLOYMENT:target};
if(target==='official')env.VITE_SITE_URL=siteOrigin(option?.slice(6)||productionOrigin);
else if(option)env.NETLIFY_SITE_URL=siteOrigin(option.slice(6));
const result=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{stdio:'inherit',env});
if(result.status!==0)process.exit(result.status||1);
const server=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build','--ssr','src/entry-server.jsx','--outDir','.ssr'],{stdio:'inherit',env});
if(server.status!==0)process.exit(server.status||1);
const pages=spawnSync(process.execPath,['scripts/generate-pages.mjs'],{stdio:'inherit',env});
process.exit(pages.status||0);
