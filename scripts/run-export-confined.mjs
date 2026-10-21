// Trusted test launcher; the model may edit only src/policy/export.mjs.
// All imported candidate code and descendants inherit deny-default, read-only
// filesystem access and no network/signal/Mach permissions. No credentials.
import{spawnSync}from'node:child_process';import{realpathSync}from'node:fs';import{dirname,resolve}from'node:path';
if(process.platform!=='darwin')throw Error('Export acceptance needs the commissioned macOS profile; no silent unconfined fallback');
const root=realpathSync(process.cwd()),runtime=dirname(realpathSync(process.execPath));
const paths=['/System','/usr/lib','/usr/share','/opt/homebrew/Cellar',root,runtime].map(p=>`(subpath ${JSON.stringify(p)})`).join(' ');
const literal=['/','/dev/null','/dev/urandom','/dev/random','/private/etc/localtime'].map(p=>`(literal ${JSON.stringify(p)})`).join(' ');
const profile=`(version 1)(deny default)(allow process-exec)(allow process-fork)(allow sysctl-read)(allow file-read-metadata)(allow file-map-executable ${paths})(allow file-read-data ${paths} ${literal})`;
const r=spawnSync('/usr/bin/sandbox-exec',['-p',profile,process.execPath,'contracts/export-contract.mjs'],{cwd:root,env:{HOME:root,TMPDIR:root,PATH:runtime+':/usr/bin:/bin',OPENSSL_CONF:'/dev/null'},encoding:'utf8',timeout:10000,maxBuffer:65536});
process.stdout.write(r.stdout??'');process.stderr.write(r.stderr??'');if(r.error)process.stderr.write(r.error.message+'\n');process.exitCode=r.status===0?0:1;
