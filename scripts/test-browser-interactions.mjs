// Ten HTTP/API checks. These are deliberately NOT called browser acceptance.
import assert from 'node:assert/strict';
const base=process.env.APAMSA_TEST_BASE_URL;if(!base)throw Error('Use npm test: owned ephemeral loopback server required');
let count=0;
for(const [path,status] of [['/',200],['/api/data',200],['/.git/config',404],['/data/raw/ri_providers_nppes.json',404],['/package.json',404],['/../package.json',404],['/missing',404]]){
 const r=await fetch(base+path);assert.equal(r.status,status,path);console.log(`HTTP check ${++count}: ${path} ${status}`);
}
const post=await fetch(base+'/api/data',{method:'POST'});assert.equal(post.status,405);count++;
const head=await fetch(base+'/api/data',{method:'HEAD'});assert.equal(await head.text(),'');count++;
const response=await fetch(base+'/api/data'),data=await response.json();assert.equal(data.metadata.schemaVersion,2);assert.deepEqual(data.providers,[]);assert.equal(response.headers.get('cache-control'),'no-store');count++;
console.log(`HTTP/API assertions: ${count}/10; no browser interactions claimed.`);
