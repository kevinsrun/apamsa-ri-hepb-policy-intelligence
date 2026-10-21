#!/usr/bin/env python3
"""Bounded public-source capture. No model, credential, or private patient data.
New captures never overwrite prior evidence. Failed/HTML API responses are evidence,
not numeric datasets. Selection/claim verification is a separate analysis step.
"""
import concurrent.futures,datetime,hashlib,json,pathlib,urllib.request,urllib.parse
ROOT=pathlib.Path(__file__).resolve().parent.parent
CMS='https://data.cms.gov/data-api/v1/dataset/0e9f2f2b-7bf9-451a-912c-e02e654dd725'
SOURCES=[
 ('cdc-chronic-2023','https://www.cdc.gov/hepatitis-surveillance-2023/hepatitis-b/table-2-5.html','surveillance'),
 ('cdc-chronic-2023-xlsx','https://www.cdc.gov/hepatitis-surveillance-2023/media/files/xlsx/table-2.5.xlsx','surveillance'),
 ('cdc-screening-2023','https://www.cdc.gov/mmwr/volumes/72/rr/rr7201a1.htm','screening'),
 ('cdc-vaccination','https://www.cdc.gov/hepatitis-b/hcp/vaccine-administration/index.html','vaccination'),
 ('ridoh-hepb','https://health.ri.gov/hepatitis-viral/hepatitis-b','program'),
 ('ridoh-report-2024','https://health.ri.gov/sites/g/files/xkgbur1006/files/2026-03/2024-hiv-surveillance-report.pdf','surveillance'),
 ('ridoh-report-2023','https://health.ri.gov/sites/g/files/xkgbur1006/files/2025-03/2023-hiv-surveillance-report.pdf','surveillance'),
 ('tattoo-active','https://rules.sos.ri.gov/Regulations/part/216-40-10-15','regulation'),
 ('tattoo-inactive-9705','https://rules.sos.ri.gov/Regulations/part/216-40-10-15?reg_id=9705','historical-regulation'),
 ('cms-dictionary',CMS+'/dictionary','utilization'),
 ('cms-methodology','https://data.cms.gov/resources/medicare-physician-other-practitioners-methodology','methodology'),
 ('medicare-screening','https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?ncdid=369','coverage'),
 ('medicare-hepb-vaccine','https://www.medicare.gov/coverage/hepatitis-b-shots','coverage'),
 ('ri-immunization','https://health.ri.gov/immunization','program'),
 ('ri-medicaid','https://eohhs.ri.gov/Consumer/ConsumerInformation/Healthcare/Medicaid.aspx','coverage'),
 ('ri-hbv-statute','https://webserver.rilegislature.gov/Statutes/TITLE23/23-28.36/23-28.36-1.htm','statute'),
 ('s0751-2025','https://webserver.rilegislature.gov/Billtext25/SenateText25/S0751.pdf','historical-bill'),
 ('h6472-2005','https://webserver.rilegislature.gov/BillText05/HouseText05/H6472.pdf','historical-resolution'),
 ('ridoh-contact','https://health.ri.gov/contact','stakeholder'),
 ('brown-apamsa','https://medical.brown.edu/student-life/student-organizations','stakeholder'),
 ('hepb-foundation','https://www.hepb.org/about-us/contact-us/','stakeholder'),
]
for code in ['87340','86704','86706']:
 SOURCES.append(('cms-ri-2023-'+code,CMS+'/data?'+urllib.parse.urlencode({'filter[Rndrng_Prvdr_State_Abrvtn]':'RI','filter[HCPCS_Cd]':code,'size':'5000','offset':'0'}),'utilization'))
for year in [2024]:
 for table,fields in [('dp02','NAME,DP02_0001E,DP02_0092E,DP02_0092PE,DP02_0092M,DP02_0092PM'),('dp05','NAME,DP05_0001E,DP05_0066E,DP05_0066PE,DP05_0066M')]:
  SOURCES.append((f'acs-{year}-{table}-county',f'https://api.census.gov/data/{year}/acs/acs5/profile?'+urllib.parse.urlencode({'get':fields,'for':'county:*','in':'state:44'}),'demography'))
def capture(item):
 ident,url,topic=item
 at=datetime.datetime.now(datetime.timezone.utc).isoformat()
 result={'id':ident,'url':url,'topic':topic,'retrievedAt':at,'method':'GET; unauthenticated public source; max 20 MiB; 40-second timeout','parsedAsDataset':False}
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'APAMSA-Policy-Research/1.0 (public-source verification)'})
  with urllib.request.urlopen(req,timeout=40) as r:
   data=r.read(20*1024*1024+1)
   if len(data)>20*1024*1024: raise ValueError('Source exceeds bounded capture size')
   result.update(httpStatus=r.status,finalUrl=r.url,contentType=r.headers.get('Content-Type'),sourceLastModified=r.headers.get('Last-Modified'))
  digest=hashlib.sha256(data).hexdigest(); rel='data/evidence/'+ident+'-'+digest[:16]+'.bin'; path=ROOT/rel
  if not path.exists():
   with path.open('xb') as f: f.write(data)
  elif path.read_bytes()!=data: raise ValueError('Evidence hash/path mismatch')
  result.update(path=rel,sha256=digest,bytes=len(data),retrieval='CAPTURED')
  try:
   j=json.loads(data)
   result['jsonShape']=type(j).__name__;result['rows']=len(j) if isinstance(j,list) else None
   result['parsedAsDataset']=isinstance(j,list) and bool(j)
  except (ValueError,UnicodeError): pass
 except Exception as e: result.update(retrieval='FAILED',error=str(e))
 return result
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(capture,SOURCES))
 stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'); p=ROOT/'data/evidence'/('retrievals-'+stamp+'.json')
 with p.open('x') as f: json.dump({'schemaVersion':1,'sources':results},f,indent=2);f.write('\n')
 print(json.dumps({'manifest':str(p.relative_to(ROOT)),'captured':sum(r['retrieval']=='CAPTURED' for r in results),'failed':sum(r['retrieval']=='FAILED' for r in results),'results':[{k:r.get(k) for k in ['id','httpStatus','bytes','rows','retrieval','error']} for r in results]},indent=2))
