// Reviewed publication helper; no network or provider calls.
import{readFile,writeFile,mkdir}from'node:fs/promises';
import{claimsToTsv}from'../src/policy/export.mjs';import{buildBrief}from'../src/policy/brief.mjs';
const d=JSON.parse(await readFile(new URL('../data/processed/policy-intelligence.json',import.meta.url),'utf8')),out=new URL('../docs/dual-mandate/',import.meta.url);await mkdir(out,{recursive:true});
await writeFile(new URL('claim-verification-matrix.tsv',out),claimsToTsv(d.claims,{includeHistory:true}));
await writeFile(new URL('qualified-findings.tsv',out),claimsToTsv(d.claims));
await writeFile(new URL('evidence-brief.md',out),buildBrief(d.claims,d.claims.filter(c=>c.eligibleForBrief).map(c=>c.id)));
const csv=x=>'"'+String(x??'').replaceAll('"','""')+'"',fields=['organization','role','contact','sourceUrl','evidenceTimestamp','outreachStatus'];
await writeFile(new URL('stakeholder-directory.csv',out),[fields,...d.stakeholders.map(s=>fields.map(f=>s[f]))].map(r=>r.map(csv).join(',')).join('\n')+'\n');
await writeFile(new URL('unresolved-evidence-gaps.md',out),'# Unresolved evidence gaps\n\n'+d.gaps.map(g=>'## '+g.title+'\n\n'+g.detail+'\n').join('\n')+'\nSource failures remain recorded. No outreach has occurred.\n');
console.log(JSON.stringify({auditRows:d.claims.length,qualifiedRows:d.claims.filter(c=>c.eligibleForBrief).length,contacts:d.stakeholders.length,gaps:d.gaps.length}));
