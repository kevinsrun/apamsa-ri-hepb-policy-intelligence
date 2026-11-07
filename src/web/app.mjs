import { interpretTriplePanel } from '../clinical/guidelines.mjs';
const el=id=>document.getElementById(id);
let dataset=null;
const tabs=['overview','screening','geography','providers','evidence','export'];
function selectTab(id,{focus=false}={}){
  for(const other of tabs){
    const active=other===id,button=el('nav-btn-'+other);
    el('tab-'+other).hidden=!active;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
  }
  if(focus)el('nav-btn-'+id).focus();
}
for(const [index,id] of tabs.entries()){
  const button=el('nav-btn-'+id);
  button.addEventListener('click',()=>selectTab(id));
  button.addEventListener('keydown',event=>{
    let next;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=tabs.length-1;
    if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;
    if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+tabs.length-1)%tabs.length;
    if(next!==undefined){event.preventDefault();selectTab(tabs[next],{focus:true});}
  });
}
for(const link of document.querySelectorAll('[data-open-tab]'))link.addEventListener('click',event=>{
  event.preventDefault();selectTab(link.dataset.openTab,{focus:true});
});
function renderProviders(){
  const query=el('provider-search').value.trim().toLowerCase();
  const matches=(dataset?.providers??[]).filter(p=>p.name.toLowerCase().includes(query));
  el('provider-results').textContent=matches.length?matches.map(p=>p.name).join('\n'):'0 verified providers. Claimed identities are not searchable referrals.';
}
function invalidate(message){
  dataset=null;el('metric-count').textContent='—';el('metric-rate').textContent='—';el('download').disabled=true;el('data-status').textContent=message;
  el('overview-data').textContent='Unavailable; prior data cleared.';el('provenance').textContent='';el('geography-data').textContent='';renderProviders();
}
export async function loadEvidence(){
  invalidate('Loading evidence…');
  try{
    const response=await fetch('/api/data',{cache:'no-store',signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw Error('Evidence service unavailable');
    const data=await response.json();
    if(data.metadata?.schemaVersion!==2 || !Array.isArray(data.metadata?.sources) || !data.metadata.sources.length ||
       !data.metadata.sources.every(s=>s.classification==='VERIFIED' && /^[a-f0-9]{64}$/.test(s.sha256) && Number.isFinite(Date.parse(s.retrievedAt))) ||
       !Array.isArray(data.providers) || data.providers.length || data.claims?.length!==0 || data.county_metrics?.length!==0 ||
       !Array.isArray(data.metadata.warnings) || !data.quarantine ||
       !Number.isFinite(data.statewide_summary?.chronic_hepb_newly_reported_cases_2022) ||
       !Number.isFinite(data.statewide_summary?.chronic_hepb_newly_reported_rate_per_100k_2022))throw Error('Unsupported evidence schema');
    dataset=data;
    el('metric-count').textContent=String(data.statewide_summary.chronic_hepb_newly_reported_cases_2022);
    el('metric-rate').textContent=String(data.statewide_summary.chronic_hepb_newly_reported_rate_per_100k_2022);
    el('data-status').textContent='HISTORICAL — NOT CURRENT. Only CDC 2022 statewide count/rate verified; other datasets quarantined.';
    el('overview-data').textContent=`${data.statewide_summary.chronic_hepb_newly_reported_cases_2022} newly reported chronic cases; ${data.statewide_summary.chronic_hepb_newly_reported_rate_per_100k_2022} per 100,000 (2022). VERIFIED: CDC Table 2.5 only.`;
    el('provenance').textContent=JSON.stringify({sources:data.metadata.sources,warnings:data.metadata.warnings,quarantine:data.quarantine},null,2);
    el('geography-data').textContent=`${data.county_metrics.length} verified county measurements available.`;
    renderProviders();el('download').disabled=false;
  }catch{invalidate('UNAVAILABLE — failed or missing evidence. No cached scientific claims. Retry with Reload evidence.');}
}
function updateSerology(){
  const options={};if(el('igm').value!=='unknown')options.igmAntiHBc=el('igm').value==='positive';
  for(const [id,key] of [['prior-negative','priorHbsAgNegativeWithin6Mo'],['persistent','hbsAgPersistentAtLeast6Months'],['dna','hbvDnaDetected']])if(el(id).checked)options[key]=true;
  if(el('alt').value!=='')options.altMultipleUln=Number(el('alt').value);
  try{
    const r=interpretTriplePanel(el('hbsag').value==='positive',el('antihbs').value==='positive',el('antihbc').value==='positive',options);
    el('serology-result').dataset.category=r.cdcCategory;
    el('serology-result').textContent=[r.clinicalStatus,r.actionRequired,r.clinicalUse].join('\n');
  }catch{el('serology-result').dataset.category='INVALID_INPUT';el('serology-result').textContent='Invalid input; no interpretation. Confirm explicit laboratory results.';}
}
el('serology').addEventListener('change',updateSerology);el('serology').addEventListener('input',updateSerology);
el('serology').addEventListener('submit',e=>e.preventDefault());el('provider-search').addEventListener('input',renderProviders);
el('reload').addEventListener('click',loadEvidence);
el('download').addEventListener('click',()=>{
  if(!dataset)return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(dataset,null,2)+'\n'],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='ri-hepb-reviewed-historical.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
updateSerology();await loadEvidence();
