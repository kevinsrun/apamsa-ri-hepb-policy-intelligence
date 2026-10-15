#!/usr/bin/env python3
"""Offline extraction/reproduction from preserved inputs, not fresh-source certification.
Run with a Python environment containing openpyxl. No credentials/network required.
"""
import json,hashlib,pathlib,datetime
from openpyxl import load_workbook
R=pathlib.Path(__file__).resolve().parent.parent
read=lambda p:json.loads((R/p).read_text())
D=read('data/raw/ri_county_demographics.json');P=read('data/raw/ri_providers_nppes.json');C=read('data/raw/cms_medicare_ri_hepb_services.json')
def sha(p):return hashlib.sha256((R/p).read_bytes()).hexdigest()
rows=[]
def claim(name,claimed,result,grade,source=None,publication=None,year=None,table=None,field=None,unit=None,numerator=None,denominator=None,filters=None,formula=None,note=None):
 rows.append(dict(claim=name,claimed=claimed,reproduced=result,classification=grade,sourceUrl=source,publicationYear=publication,datasetYear=year,table=table,field=field,unit=unit,numerator=numerator,denominator=denominator,filters=filters,formula=formula,note=note))
for code,value in [('87340',767),('86704',607),('86706',593)]:
 v=sum(float(c['line_srvc_cnt']) for c in C if c['hcpcs_code']==code)
 claim('Medicare procedure '+code,value,int(v),'PROTOTYPE',table='local CMS-schema fixture, not original CMS download',field='line_srvc_cnt',unit='billed procedure services',numerator=int(v),denominator=None,filters=f'hcpcs_code == {code}; all fixture years/providers',formula='sum(line_srvc_cnt)',note='No original source URL/publication or authoritative extraction; cannot infer patient panels, noncompliance or screening prevalence.')
for name,v,note in [('foreign-born case share',78.3,'No RIDOH numerator, denominator, original table or measured extraction; previously admitted heuristic.'),('independent-lab billing share',68.4,'Heuristic market estimate without observed claims denominator.'),('chronic HBV cases',138,'Alleged 2023 RIDOH count; source/table absent; distinct year/definition not established.'),('perinatal screening percent',98.4,'No original cohort, screened pregnancies or eligible-pregnancy denominator.'),('statewide prevalent infections','3,000–8,000+','Unsupported estimate; not derivable from yearly chronic notifications.')]:
 claim(name,v,None,'UNVERIFIED',year=2023 if v==138 else None,note=note)
x=R/'acceptance/raw/cdc2022-table-2.5.xlsx';s=load_workbook(x,data_only=True)['Tab2.5'];n=int(str(s['C42'].value).strip());rate=float(str(s['D42'].value).strip());assert s['B42'].value=='Rhode Island'
cdc='https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html'
claim('newly reported chronic cases 2022',364,n,'VERIFIED',cdc,2024,2022,'Table 2.5 / Tab2.5 / B42 C42','Newly reported chronic HBV cases','cases',n,None,'Rhode Island row','int(strip(C42))','Notifications, not infections newly acquired during 2022 or total prevalent infections.')
claim('newly reported chronic rate',33.3,rate,'VERIFIED',cdc,2024,2022,'Table 2.5 / D42','Rate per 100,000 population','cases / 100,000',n,None,'Rhode Island row','float(strip(D42))','Exact population denominator is not in this table; rounded rate does not reconstruct exact denominator.')
claim('acute rate',0.10,None,'UNVERIFIED',note='Not verified by chronic Table 2.5; active value removed.')
state=sum(d['foreign_born_population'] for d in D);prov=next(d for d in D if d['county']=='Providence County')['foreign_born_population']
for name,v,r in [('Providence foreign-born',137408,prov),('state foreign-born',162114,state)]:
 claim(name,v,r,'CONTRADICTED',table='local demographics fixture; claimed ACS DP02 not authenticated',field='foreign_born_population',unit='persons',numerator=r,filters='Providence county' if 'Providence' in name else 'five RI counties',formula='selected county or sum(foreign_born_population)',note='Contradicted by local fixture only; authoritative ACS truth remains UNVERIFIED. Public Census API returned HTML Missing Key despite status 200; no private key sought.')
claim('Providence concentration',84.76,{'claimed_inputs_pct':137408/162114*100,'fixture_inputs_pct':prov/state*100},'DERIVED',table='unverified demographic inputs',unit='percent',numerator=prov,denominator=state,filters='five counties',formula='Providence foreign-born / statewide foreign-born * 100',note='Arithmetic only. Claimed rounded result is reproducible, but not source-verified.')
claim('five-county population total',1095605,sum(d['total_population'] for d in D),'DERIVED',table='local demographics; claimed ACS 2018–2022 DP05, not authenticated',field='total_population',unit='persons',numerator=sum(d['total_population'] for d in D),filters='five RI counties',formula='sum(total_population)',note='Fixture sum, not verified Census estimate.')
for county in ['Providence County','Washington County']:
 d=next(d for d in D if d['county']==county);v=round(.7*d['foreign_born_pct']+.3*d['asian_pct'],2)
 claim(county+' need score',None,v,'ESTIMATED',table='unvalidated local demographic proxy',field='foreign_born_pct, asian_pct',unit='arbitrary index',numerator=None,denominator=None,filters=county,formula='round(0.7 * foreign_born_pct + 0.3 * asian_pct, 2)',note='Arbitrary weights, unverified inputs; not a clinically validated need score or equitable screening prioritization.')
def valid(n):
 digits=list(map(int,'80840'+n));total=0
 for i,d in enumerate(reversed(digits)):
  if i%2:d*=2;d=d-9 if d>9 else d
  total+=d
 return len(n)==10 and total%10==0
for p in P:
 n=p['npi'];check=valid(n);result={'checksumValid':check,'claimedName':p['name'],'identityVerified':False}
 if check:
  raw=read('acceptance/raw/nppes-'+n+'.json');result['resultCount']=raw.get('result_count');result['actualNames']=[' '.join(filter(None,[r.get('basic',{}).get(k) for k in ['organization_name','first_name','last_name']])) for r in raw.get('results',[])]
 claim('provider NPI '+n,p['name'],result,'CONTRADICTED' if not check or result.get('resultCount') else 'UNVERIFIED','https://npiregistry.cms.hhs.gov/api/?number='+n+'&version=2.1' if check else None,table='NPPES Registry API v2.1' if check else 'NPI checksum with 80840 prefix',field='number/basic identity',unit='provider identity',filters='exact number, then name match; RI location needed for valid match',formula='Luhn(80840 + NPI) then authoritative identity comparison',note='Checksum alone never verifies identity. No-result is not proof of nonexistence. All claimed identities withheld.')
files=sorted([p for d in ['data/raw','acceptance/raw'] for p in (R/d).glob('*') if p.is_file()])
report={'schemaVersion':1,'scope':'independent forensic reproduction; null means unavailable, not zero','claims':rows,'inputs':[{'path':str(p.relative_to(R)),'sha256':sha(str(p.relative_to(R))),'bytes':p.stat().st_size}for p in files]}
(R/'acceptance/scientific-claims.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'claims':len(rows),'chronicCases':int(str(s['C42'].value).strip()),'rate':rate,'foreignBornFixtureSum':state,'ProvidenceFixture':prov,'providerValidChecksums':sum(valid(p['npi'])for p in P)}))
