// Only owns its ephemeral loopback listener and its test children.
import {spawn} from 'node:child_process';
import {startResearchServer} from './serve.mjs';
const {server,url}=await startResearchServer();
const env={PATH:process.env.PATH,HOME:process.env.HOME,APAMSA_TEST_BASE_URL:url};
try {
 for(const args of [['--test','src/tests/hepb.test.mjs'],['scripts/test-browser-interactions.mjs']]){
  console.log(JSON.stringify({command:[process.execPath,...args],url}));
  const code=await new Promise((done,fail)=>{
   const c=spawn(process.execPath,args,{stdio:'inherit',env,shell:false});
   const t=setTimeout(()=>c.kill('SIGTERM'),30000),hard=setTimeout(()=>c.kill('SIGKILL'),32000);
   c.once('error',fail);c.once('close',code=>{clearTimeout(t);clearTimeout(hard);done(code);});
  });
  if(code!==0)process.exitCode=1;
 }
} finally{server.close();server.closeAllConnections();}
