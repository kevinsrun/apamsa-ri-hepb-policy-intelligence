const accepted=new Set(['VERIFIED','VERIFIED WITH QUALIFICATIONS']);
const clean=value=>String(value).replace(/[\r\n]+/g,' ').replace(/[\[\]<>\\]/g,'');
export function buildBrief(claims,ids){
 if(!Array.isArray(claims)||!Array.isArray(ids)||ids.length===0||new Set(ids).size!==ids.length)throw Error('Select unique verified claim IDs');
 const index=new Map();for(const c of claims){if(index.has(c.id))throw Error('Duplicate claim identity');index.set(c.id,c);}
 const selected=ids.map(id=>{const c=index.get(id);if(!c||!accepted.has(c.status)||c.eligibleForBrief!==true||c.value==null||!c.sourceUrl||!c.evidenceTimestamp||!c.transformationCode||!c.population||!Array.isArray(c.limitations)||!c.limitations.length)throw Error('Claim lacks verified, qualified evidence');
  const u=new URL(c.sourceUrl);if(u.protocol!=='https:'||u.username||u.password||/[\s()]/.test(c.sourceUrl))throw Error('Invalid primary source URL');
  if(typeof c.value!=='number'||!Number.isFinite(c.value))throw Error('Nonfinite quantitative claim');
  return c;});
 const lines=['# Rhode Island hepatitis B — internal evidence draft','','Draft for research review. Not approved for outreach, clinical use or publication.',''];
 for(const c of selected){lines.push(`- ${clean(c.claim)}: **${c.value} ${clean(c.unit??'')}** (${clean(c.status)}; data year ${clean(c.datasetYear??'unknown')}). [Primary source](${c.sourceUrl})`);lines.push(`  Population: ${clean(c.population)}. Numerator: ${c.numerator??'unknown'}; denominator: ${c.denominator??'unknown — not inferred'}.`);for(const l of c.limitations)lines.push(`  Limitation: ${clean(l)}`);lines.push(`  Reproduction: ${clean(c.transformationCode)}; evidence observed ${clean(c.evidenceTimestamp)}.`);}
 lines.push('','Unsupported disputed values, modeled county need scores and alleged provider identities are excluded. Coverage policies do not prove observed access.');return lines.join('\n');
}
