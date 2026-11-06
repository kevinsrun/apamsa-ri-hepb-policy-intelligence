// Real Chromium acceptance against only this script's owned ephemeral server.
import {createRequire} from 'node:module';
import {mkdir,readFile,rename} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {startResearchServer} from './serve.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.APAMSA_PLAYWRIGHT_MODULE || '/Users/sadius/engineering-fleet-awareness/node_modules/playwright');
const {server,url}=await startResearchServer();
let browser,checks=0;const errors=[];
const ok=(condition,name)=>{assert.ok(condition,name);console.log(`Browser ${++checks}: ${name}`);};
try{
 await mkdir('acceptance/screenshots',{recursive:true});
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error' && !m.text().includes('503'))errors.push(m.text());});
 await page.goto(url);await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('HISTORICAL'));
 const data=await (await fetch(url+'/api/data')).json();
 ok((await page.locator('#overview-data').textContent()).includes(String(data.statewide_summary.chronic_hepb_newly_reported_cases_2022)),'actual API count reaches rendered overview');
 ok((await page.locator('#overview-data').textContent()).includes(String(data.statewide_summary.chronic_hepb_newly_reported_rate_per_100k_2022)),'actual API rate reaches rendered overview');
 const tabs=['overview','screening','geography','providers','evidence','export'];
 for(const id of tabs){await page.locator('#nav-btn-'+id).click();ok(await page.locator('#tab-'+id).isVisible() && await page.locator('section[role=tabpanel]:visible').count()===1,`navigate ${id}`);}
 await page.locator('#nav-btn-providers').click();await page.locator('#provider-search').fill('Chen');
 ok((await page.locator('#provider-results').textContent()).startsWith('0 verified'),'unverified provider cannot be searched as referral');
 ok(!(await page.locator('body').textContent()).includes('Dr. Sarah Chen'),'fake clinician absent from rendered application');
 await page.locator('#nav-btn-geography').click();ok((await page.locator('#tab-geography').textContent()).includes('quarantined'),'county rankings withheld outside evidence tab');
 await page.locator('#nav-btn-screening').click();
 const patterns=[['negative','negative','negative','SUSCEPTIBLE'],['negative','negative','positive','ISOLATED_CORE_NON_DEFINITIVE'],['negative','positive','negative','IMMUNE_VACCINE'],['negative','positive','positive','IMMUNE_NATURAL'],['positive','negative','negative','ISOLATED_HBSAG_NON_DEFINITIVE'],['positive','negative','positive','INFECTION_PHASE_UNDETERMINED'],['positive','positive','negative','ATYPICAL_NON_DEFINITIVE'],['positive','positive','positive','CONCURRENT_MARKERS_NON_DEFINITIVE']];
 for(const [a,b,c,expected]of patterns){await page.selectOption('#hbsag',a);await page.selectOption('#antihbs',b);await page.selectOption('#antihbc',c);ok(await page.locator('#serology-result').getAttribute('data-category')===expected,`rendered serology ${a}/${b}/${c} → ${expected}`);}
 await page.selectOption('#hbsag','positive');await page.selectOption('#antihbs','negative');await page.selectOption('#antihbc','positive');
 await page.selectOption('#igm','negative');ok(await page.locator('#serology-result').getAttribute('data-category')==='CHRONIC_PATTERN','negative IgM is typical pattern, not confirmed chronicity');
 await page.check('#prior-negative');ok(await page.locator('#serology-result').getAttribute('data-category')==='ACUTE_POSSIBLE','recent negative HBsAg is not proof of chronicity');
 await page.uncheck('#prior-negative');await page.selectOption('#igm','unknown');await page.fill('#alt','11');ok(await page.locator('#serology-result').getAttribute('data-category')==='INFECTION_PHASE_UNDETERMINED','ALT >10x is not chronicity clock');
 await page.check('#persistent');ok(await page.locator('#serology-result').getAttribute('data-category')==='CHRONIC_LONGITUDINAL','dated persistence supports chronicity');
 await page.check('#prior-negative');ok(await page.locator('#serology-result').getAttribute('data-category')==='DISCORDANT_HISTORY','contradictory longitudinal history rejected');
 await page.screenshot({path:'acceptance/screenshots/clinical-discordant-history.png',fullPage:true});
 await page.locator('#nav-btn-export').click();const wait=page.waitForEvent('download');await page.locator('#download').click();const download=await wait;
 await download.saveAs('acceptance/reviewed-export.json');const exportBytes=await readFile('acceptance/reviewed-export.json','utf8');const exported=JSON.parse(exportBytes);
 ok(exportBytes===JSON.stringify(data,null,2)+'\n','download bytes equal active reviewed JSON serialization');
 ok(JSON.stringify(exported)===JSON.stringify(data),'actual browser download matches API including warnings/provenance');
 ok(exported.providers.length===0 && exported.claims.length===0 && exported.metadata.sources[0].freshness==='HISTORICAL_NOT_CURRENT','download excludes quarantined identities and claims; labels historical age');
 // Real missing backend file, only in our isolated worktree. Restore even on failure.
 const path=new URL('../data/processed/ri_hepb_analytical_dataset.json',import.meta.url), backup=new URL('../data/processed/acceptance-owned-backup.json',import.meta.url);
 await rename(path,backup);
 try{
  ok((await fetch(url+'/api/data')).status===503,'real missing processed file returns 503');
  await page.locator('#reload').click();await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('UNAVAILABLE'));
  ok(await page.locator('#download').isDisabled(),'failure clears data and disables export');
  ok(await page.locator('#metric-count').textContent()==='—' && await page.locator('#metric-rate').textContent()==='—','failure clears both metric cards');
  ok((await page.locator('#overview-data').textContent()).includes('Unavailable'),'failure removes previously rendered measurements');
  await page.screenshot({path:'acceptance/screenshots/backend-unavailable.png',fullPage:true});
 }finally{await rename(backup,path);}
 await page.locator('#reload').click();await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('HISTORICAL'));
 ok(await page.locator('#download').isEnabled(),'recovery after real source restoration');
 // Controlled response validation regressions, not live scientific evidence.
 await page.route('**/api/data',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...data,metadata:{...data.metadata,sources:[]}})}));
 await page.locator('#reload').click();await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('UNAVAILABLE'));
 ok(await page.locator('#download').isDisabled(),'controlled missing source metadata fails closed');await page.unroute('**/api/data');
 await page.locator('#reload').click();await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('HISTORICAL'));
 await page.locator('#nav-btn-overview').click();await page.screenshot({path:'acceptance/screenshots/overview-historical-quarantine.png',fullPage:true});
 // Hold a controlled request to inspect loading after a prior success.
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route('**/api/data',async route=>{await gate;await route.continue();});
 await page.locator('#reload').click();await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('Loading'));
 ok(await page.locator('#download').isDisabled() && await page.locator('#metric-count').textContent()==='—' && await page.locator('#metric-rate').textContent()==='—','loading clears metrics and disables export');
 await page.screenshot({path:'acceptance/screenshots/loading.png',fullPage:true});release();
 await page.waitForFunction(()=>document.getElementById('data-status').textContent.includes('HISTORICAL'));await page.unroute('**/api/data');
 await page.locator('#nav-btn-overview').focus();await page.keyboard.press('End');
 ok(await page.locator('#nav-btn-export').evaluate(e=>e===document.activeElement) && await page.locator('#tab-export').isVisible(),'End selects and focuses last tab');
 await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
 ok(await page.locator('#nav-btn-screening').evaluate(e=>e===document.activeElement) && await page.locator('#tab-screening').isVisible(),'Home and arrow navigation move selection and focus');
 await page.keyboard.press('ArrowLeft');
 await page.locator('[data-open-tab="evidence"]').first().click();
 ok(await page.locator('#tab-evidence').isVisible(),'source navigation opens provenance');
 for(const viewport of [{width:1280,height:900},{width:375,height:812}]){
  await page.setViewportSize(viewport);
  for(const id of tabs){
   await page.locator('#nav-btn-'+id).click();
   ok(await page.locator('section[role=tabpanel]:visible').count()===1,`${viewport.width}px: exactly one panel on ${id}`);
   ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${viewport.width}px: no overflow on ${id}`);
   const clipped=await page.locator('.warning:visible, #data-status, section[role=tabpanel]:visible input, section[role=tabpanel]:visible select, section[role=tabpanel]:visible button').evaluateAll(nodes=>nodes.some(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth||e.scrollWidth>e.clientWidth+1;}));
   ok(!clipped,`${viewport.width}px: warnings and controls fit on ${id}`);
   for(const control of await page.locator('section[role=tabpanel]:visible input, section[role=tabpanel]:visible select, section[role=tabpanel]:visible button:not(:disabled)').all()){
    await control.focus();ok(await control.evaluate(e=>e===document.activeElement),'panel control accepts keyboard focus');
   }
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:`acceptance/screenshots/${viewport.width}-${id}.png`,fullPage:true});
   if(id==='overview')await page.screenshot({path:`acceptance/screenshots/${viewport.width}-viewport.png`});
  }
 }
 console.log({consoleErrors:errors});ok(errors.length===0,'no console or unhandled browser JavaScript errors');
 console.log(JSON.stringify({status:'passed',checks,browser:await browser.version(),url,errors,simulation:'controlled missing-source metadata and delayed loading request; missing-file 503 and recovery used real local backend'}));
}finally{await browser?.close();server.close();server.closeAllConnections();}
