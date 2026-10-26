import { Readable } from 'node:stream';
import { loadEnv } from 'vite';
import contact from '../netlify/functions/contact.js';

// Development-only adapter: reuse the real streamed function without sending secrets to React.
export function localContact() {
  return {
    name:'allex-local-contact',
    configureServer(server) {
      const env=loadEnv(server.config.mode,server.config.envDir,'');
      for(const key of ['GMAIL_USER','GMAIL_APP_PASSWORD','CONTACT_TO_EMAIL','ALLOWED_ORIGINS']) {
        if(env[key])process.env[key]=env[key];
      }
      server.middlewares.use(async(req,res,next)=>{
        if(req.url?.split('?')[0]!=='/.netlify/functions/contact')return next();
        const remote=req.socket.remoteAddress;
        if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote)) {
          res.writeHead(403,{'Content-Type':'application/json'});
          return res.end(JSON.stringify({message:'Local contact testing is available on this computer only.'}));
        }
        try {
          const headers=new Headers();
          for(const [key,value]of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(', '):value);
          const init={method:req.method,headers};
          if(!['GET','HEAD'].includes(req.method)){init.body=Readable.toWeb(req);init.duplex='half';}
          const result=await contact(new Request(`http://localhost${req.url}`,init));
          res.writeHead(result.status,Object.fromEntries(result.headers));
          res.end(Buffer.from(await result.arrayBuffer()));
        }catch{
          res.writeHead(500,{'Content-Type':'application/json','Cache-Control':'no-store'});
          res.end(JSON.stringify({message:'Contact service unavailable. Please try again later.'}));
        }
      });
    },
  };
}
