import fs from 'node:fs/promises';
import path from 'node:path';

// Explicit allowlist: no .env, node_modules, account state, PDFs or QA screenshots.
const root=process.cwd();
const version=Date.now().toString();
const output=path.join(root,'deployment',`release-${version}`);
const source=path.join(output,'netlify-source');
await fs.mkdir(source,{recursive:true});
for(const name of ['src','shared','netlify','scripts','public','images','tests'])await fs.cp(path.join(root,name),path.join(source,name),{recursive:true});
for(const name of ['package.json','package-lock.json','vite.config.js','netlify.toml','index.html','.env.example','.gitignore','README.md','NETLIFY-DEPLOYMENT.md','SAME-DOMAIN-REPLACEMENT.md','NETLIFY-DEPLOY.ps1'])await fs.copyFile(path.join(root,name),path.join(source,name));
const notices='This folder contains the sanitized source for a Netlify cloud/CLI build. No passwords are included. Use npm ci, then Netlify deploy with its build command. Configure Gmail secrets in Netlify environment settings, never in this folder. See NETLIFY-DEPLOYMENT.md in the original project.\n';
await fs.writeFile(path.join(source,'UPLOAD-README.txt'),notices);
// Guard against accidental future additions to the allowlist.
async function inspect(directory){for(const item of await fs.readdir(directory,{withFileTypes:true})){const file=path.join(directory,item.name);if(item.isDirectory())await inspect(file);else if(item.name.startsWith('.env')&&item.name!=='.env.example')throw new Error('Secret env file found; release blocked.');}}
await inspect(source);
await fs.writeFile(path.join(root,'deployment','latest-release.json'),JSON.stringify({source,output},null,2));
console.log(JSON.stringify({source,output}));
