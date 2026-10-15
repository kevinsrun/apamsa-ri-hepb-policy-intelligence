import {test} from 'node:test';
import assert from 'node:assert/strict';
import {interpretTriplePanel,CDC_2023_RECOMMENDATIONS} from '../clinical/guidelines.mjs';
import {runIngestionPipeline} from '../pipeline/ingest.mjs';
import {analyzeScreeningData} from '../analysis/analytics.mjs';
const patterns=[
 [false,false,false,'SUSCEPTIBLE'],[false,false,true,'ISOLATED_CORE_NON_DEFINITIVE'],
 [false,true,false,'IMMUNE_VACCINE'],[false,true,true,'IMMUNE_NATURAL'],
 [true,false,false,'ISOLATED_HBSAG_NON_DEFINITIVE'],[true,false,true,'INFECTION_PHASE_UNDETERMINED'],
 [true,true,false,'ATYPICAL_NON_DEFINITIVE'],[true,true,true,'CONCURRENT_MARKERS_NON_DEFINITIVE'],
];
for(const [a,b,c,category] of patterns)test(`CDC typical pattern ${+a}${+b}${+c}`,()=>{
 const r=interpretTriplePanel(a,b,c);assert.equal(r.cdcCategory,category);
 assert.match(r.clinicalUse,/not an autonomous diagnosis/i);assert.equal(r.sourceUrls.length,2);assert.notEqual(r.diagnosticCertainty,'DEFINITIVE');
});
test('2023 adult triple-panel recommendation',()=>assert.deepEqual(CDC_2023_RECOMMENDATIONS[0].recommendedTests,['HBsAg','anti-HBs','total anti-HBc']));
for(const [name,options,expected] of [
 ['negative IgM is pattern not longitudinal proof',{igmAntiHBc:false},'CHRONIC_PATTERN'],
 ['recent negative HBsAg supports recent seroconversion',{priorHbsAgNegativeWithin6Mo:true},'ACUTE_POSSIBLE'],
 ['ALT >10x does not establish chronicity',{altMultipleUln:11},'INFECTION_PHASE_UNDETERMINED'],
 ['IgM positive can be acute or flare',{igmAntiHBc:true},'ACUTE_POSSIBLE'],
 ['persistence at least 6 months supports chronicity',{hbsAgPersistentAtLeast6Months:true},'CHRONIC_LONGITUDINAL'],
 ['persistent HBsAg with IgM can be chronic flare',{hbsAgPersistentAtLeast6Months:true,igmAntiHBc:true},'CHRONIC_LONGITUDINAL'],
 ['contradictory dated history is not resolved by guessing',{hbsAgPersistentAtLeast6Months:true,priorHbsAgNegativeWithin6Mo:true},'DISCORDANT_HISTORY'],
])test(name,()=>assert.equal(interpretTriplePanel(true,false,true,options).cdcCategory,expected));
test('isolated core avoids blanket challenge vaccine',()=>assert.doesNotMatch(interpretTriplePanel(false,false,true).actionRequired,/one dose|1 dose|4.?8 weeks/i));
test('coincident Ag/Ab not mutation diagnosis',()=>assert.match(interpretTriplePanel(true,true,true).actionRequired,/not a mutation diagnosis/));
test('window period IgM pattern',()=>assert.equal(interpretTriplePanel(false,false,true,{igmAntiHBc:true}).cdcCategory,'RESOLVING_ACUTE_POSSIBLE'));
test('HBsAg negative DNA positive needs phase review',()=>assert.equal(interpretTriplePanel(false,false,true,{hbvDnaDetected:true}).cdcCategory,'DNA_POSITIVE_HBSAG_NEGATIVE'));
test('HBIG passive antibody caveat',()=>assert.match(interpretTriplePanel(false,true,false,{recentHbig:true}).clinicalStatus,/passive/));
test('negative antibodies not automatic revaccination of prior vaccinees',()=>assert.match(interpretTriplePanel(false,false,false).actionRequired,/not automatic revaccination/));
test('IgM cannot be silently accepted with negative total core',()=>assert.equal(interpretTriplePanel(true,false,false,{igmAntiHBc:true}).cdcCategory,'DISCORDANT_HISTORY'));
for(const input of [null,0,'false',undefined,[],{}])test(`reject nonboolean marker ${JSON.stringify(input)}`,()=>assert.throws(()=>interpretTriplePanel(input,false,false),TypeError));
for(const options of [{igmAntiHBc:'false'},{altMultipleUln:-1},{altMultipleUln:Infinity},{unknown:true},null,[]])test(`reject malformed optional input ${JSON.stringify(options)}`,()=>assert.throws(()=>interpretTriplePanel(true,false,true,options),TypeError));
test('pipeline only releases source-backed historical count/rate',async()=>{
 const d=await runIngestionPipeline({persist:false});assert.equal(d.metadata.schemaVersion,2);assert.equal(d.statewide_summary.chronic_hepb_newly_reported_cases_2022,364);assert.equal(d.statewide_summary.chronic_hepb_newly_reported_rate_per_100k_2022,33.3);
 assert.equal(d.metadata.sourceStatus,'HISTORICAL_NOT_CURRENT');assert.equal(d.metadata.sources[0].datasetYear,2022);assert.equal(d.statewide_summary.acute_hepb_reported_rate_per_100k_2022,null);
});
test('providers, claims, population, county allocation withheld from active dataset',async()=>{
 const d=await runIngestionPipeline({persist:false});for(const key of ['providers','claims','county_metrics','specialty_metrics'])assert.deepEqual(d[key],[]);
 assert.equal(d.statewide_summary.total_population,null);assert.equal(d.quarantine.providerRecords,12);
 assert.doesNotMatch(JSON.stringify(d),/VERIFIED_NPPES|DEMOGRAPHIC-VERIFIED|Dr\. Sarah Chen/);
});
test('analytics cannot infer clinical noncompliance from fixtures',async()=>{
 const a=analyzeScreeningData(await runIngestionPipeline({persist:false}));assert.equal(a.panelDiscordance,null);assert.deepEqual(a.countyDisparities,[]);assert.throws(()=>analyzeScreeningData({}),/Unreviewed/);
});
