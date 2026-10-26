import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Only import the three mail values; never pass a password in command arguments/output.
if(!fs.existsSync('.env'))throw new Error('Configure your private .env mail settings first.');
process.loadEnvFile('.env');
const keys=['GMAIL_USER','GMAIL_APP_PASSWORD','CONTACT_TO_EMAIL'];
for(const key of keys)if(!process.env[key]||/[\r\n]/.test(process.env[key]))throw new Error('Missing or invalid private mail settings.');
fs.mkdirSync('.netlify',{recursive:true});
const file=path.resolve('.netlify/allex-mail.env');
if(!file.startsWith(path.resolve('.netlify')+path.sep))throw new Error('Invalid temporary settings path.');
try{
 fs.writeFileSync(file,keys.map(key=>`${key}=${process.env[key]}`).join('\n')+'\n',{mode:0o600});
 const command='npm exec --yes --cache .tmp-netlify-cli --package=netlify-cli@27.14.2 -- netlify env:import .netlify/allex-mail.env';
 const result=process.platform==='win32'
   ? spawnSync(process.env.ComSpec||'cmd.exe',['/d','/s','/c',command],{encoding:'utf8',stdio:'pipe'})
   : spawnSync('npm',['exec','--yes','--cache','.tmp-netlify-cli','--package=netlify-cli@27.14.2','--','netlify','env:import','.netlify/allex-mail.env'],{encoding:'utf8',stdio:'pipe'});
 if(result.status!==0)throw new Error('Mail settings import failed. Confirm Netlify login, linked site and permissions; no values were printed.');
 console.log('Private mail settings imported to the linked Netlify site. Values withheld.');
}finally{if(fs.existsSync(file))fs.unlinkSync(file);}
