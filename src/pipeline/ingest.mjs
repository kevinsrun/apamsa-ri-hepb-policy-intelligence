import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEPB_CODES, CLINICAL_RULES } from '../clinical/guidelines.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

export async function runIngestionPipeline() {
  const timestamp = new Date().toISOString();
  console.log(`[Pipeline] Starting Hepatitis B Data Ingestion & Transformation at ${timestamp}...`);

  // 1. Load Raw Datasets
  const rawDemographics = JSON.parse(await readFile(resolve(ROOT, 'data/raw/ri_county_demographics.json'), 'utf8'));
  const rawProviders = JSON.parse(await readFile(resolve(ROOT, 'data/raw/ri_providers_nppes.json'), 'utf8'));
  const rawClaims = JSON.parse(await readFile(resolve(ROOT, 'data/raw/cms_medicare_ri_hepb_services.json'), 'utf8'));
  const rawSurveillance = JSON.parse(await readFile(resolve(ROOT, 'data/raw/ri_surveillance_hepb.json'), 'utf8'));

  // 2. Schema Validation & Normalization
  const validProviders = rawProviders.map(p => {
    if (!p.npi || p.npi.length !== 10) {
      throw new Error(`Invalid NPI in provider record: ${JSON.stringify(p)}`);
    }
    return {
      npi: String(p.npi),
      name: p.name.trim(),
      specialty: p.specialty.trim(),
      taxonomy: p.taxonomy,
      practice_name: p.practice_name,
      address: p.address,
      city: p.city,
      state: p.state.toUpperCase(),
      zip: p.zip,
      county: p.county,
      fqhc_or_chc: Boolean(p.fqhc_or_chc),
      system_affiliation: p.system_affiliation,
      accepts_medicare: Boolean(p.accepts_medicare),
      accepts_medicaid: Boolean(p.accepts_medicaid)
    };
  });

  const providerMap = new Map(validProviders.map(p => [p.npi, p]));

  // Normalize Claims & Map to Providers and Counties
  const normalizedClaims = rawClaims.map((claim, idx) => {
    const codeMeta = HEPB_CODES[claim.hcpcs_code];
    if (!codeMeta) {
      console.warn(`[Pipeline Warning] Unknown HCPCS code ${claim.hcpcs_code} at index ${idx}`);
    }
    const provider = providerMap.get(String(claim.rndrng_npi));
    const county = provider ? provider.county : 'Unknown';

    return {
      id: `claim-${claim.year}-${claim.rndrng_npi}-${claim.hcpcs_code}`,
      npi: String(claim.rndrng_npi),
      provider_name: provider ? provider.name : `${claim.rndrng_prvdr_first_name} ${claim.rndrng_prvdr_last_org_name}`,
      specialty: provider ? provider.specialty : claim.rndrng_prvdr_type,
      county,
      zip: claim.rndrng_prvdr_zip5,
      hcpcs_code: claim.hcpcs_code,
      panel_component: codeMeta ? codeMeta.panel_component : 'other',
      code_name: codeMeta ? codeMeta.name : claim.hcpcs_description,
      year: Number(claim.year),
      services_count: Number(claim.line_srvc_cnt),
      beneficiaries_count: Number(claim.bene_unique_cnt),
      avg_submitted_charge: Number(claim.avg_submitted_chrg_amt),
      avg_medicare_allowed: Number(claim.avg_medicare_allowed_amt),
      avg_medicare_payment: Number(claim.avg_medicare_payment_amt),
      is_suppressed: Boolean(claim.suppression_flag)
    };
  });

  // 3. Aggregate by County
  const countyMetrics = rawDemographics.map(county => {
    const countyClaims = normalizedClaims.filter(c => c.county === county.county);
    
    // Sum services by code
    const hbsag_services = countyClaims.filter(c => c.hcpcs_code === '87340').reduce((acc, c) => acc + c.services_count, 0);
    const antihbs_services = countyClaims.filter(c => c.hcpcs_code === '86706').reduce((acc, c) => acc + c.services_count, 0);
    const total_antihbc_services = countyClaims.filter(c => c.hcpcs_code === '86704').reduce((acc, c) => acc + c.services_count, 0);
    const g0499_services = countyClaims.filter(c => c.hcpcs_code === 'G0499').reduce((acc, c) => acc + c.services_count, 0);

    const total_screening_services = hbsag_services + antihbs_services + total_antihbc_services + g0499_services;

    // Active screening providers in county
    const providersInCounty = validProviders.filter(p => p.county === county.county);
    const screeningProvidersInCounty = new Set(countyClaims.map(c => c.npi)).size;

    // Chronic surveillance cases from RIDOH
    const chronicSurv = rawSurveillance.chronic_hepatitis_b.county_distribution.find(d => d.county === county.county);
    const chronic_cases = chronicSurv ? chronicSurv.cases : 0;
    const chronic_rate_per_100k = chronicSurv ? chronicSurv.rate_per_100k : 0;

    return {
      fips: county.fips,
      county: county.county,
      total_population: county.total_population,
      adult_population: county.adult_population,
      foreign_born_population: county.foreign_born_population,
      foreign_born_pct: county.foreign_born_pct,
      asian_population: county.asian_population,
      asian_pct: county.asian_pct,
      uninsured_pct: county.uninsured_pct,
      poverty_rate_pct: county.poverty_rate_pct,
      total_providers: providersInCounty.length,
      active_screening_providers: screeningProvidersInCounty,
      services: {
        hbsag_87340: hbsag_services,
        antihbs_86706: antihbs_services,
        total_antihbc_86704: total_antihbc_services,
        g0499_medicare_screen: g0499_services,
        total_services: total_screening_services
      },
      // Rate per 100k adult population
      screening_rate_per_100k_adults: county.adult_population > 0 
        ? Number(((total_screening_services / county.adult_population) * 100000).toFixed(1))
        : 0,
      chronic_reported_cases: chronic_cases,
      chronic_reported_rate_per_100k: chronic_rate_per_100k
    };
  });

  // 4. Aggregate by Specialty
  const specialtyMap = new Map();
  for (const claim of normalizedClaims) {
    if (!specialtyMap.has(claim.specialty)) {
      specialtyMap.set(claim.specialty, {
        specialty: claim.specialty,
        providers_count: new Set(),
        hbsag_services: 0,
        antihbs_services: 0,
        total_antihbc_services: 0,
        g0499_services: 0,
        total_services: 0,
        total_beneficiaries: 0
      });
    }
    const spec = specialtyMap.get(claim.specialty);
    spec.providers_count.add(claim.npi);
    if (claim.hcpcs_code === '87340') spec.hbsag_services += claim.services_count;
    if (claim.hcpcs_code === '86706') spec.antihbs_services += claim.services_count;
    if (claim.hcpcs_code === '86704') spec.total_antihbc_services += claim.services_count;
    if (claim.hcpcs_code === 'G0499') spec.g0499_services += claim.services_count;
    spec.total_services += claim.services_count;
    spec.total_beneficiaries += claim.beneficiaries_count;
  }

  const specialtyMetrics = Array.from(specialtyMap.values()).map(s => ({
    specialty: s.specialty,
    unique_providers: s.providers_count.size,
    hbsag_services: s.hbsag_services,
    antihbs_services: s.antihbs_services,
    total_antihbc_services: s.total_antihbc_services,
    g0499_services: s.g0499_services,
    total_services: s.total_services,
    total_beneficiaries: s.total_beneficiaries,
    pct_of_total_services: Number(((s.total_services / (normalizedClaims.reduce((a, b) => a + b.services_count, 0) || 1)) * 100).toFixed(1))
  }));

  // 5. Synthesis Report & Caveats
  const totalStateServices = normalizedClaims.reduce((acc, c) => acc + c.services_count, 0);
  const totalStateAdultPop = rawDemographics.reduce((acc, d) => acc + d.adult_population, 0);

  const processedData = {
    metadata: {
      generated_at: timestamp,
      state: 'Rhode Island',
      target_population: 'Adults aged >= 18 under CDC 2023 Universal Screening Guidelines',
      data_sources: [
        { name: 'CDC MMWR 2023 Guidelines', url: 'https://www.cdc.gov/mmwr/volumes/72/rr/rr7201a1.htm' },
        { name: 'CMS Medicare Physician & Other Practitioners Part B Procedure Aggregate', coverage: 'Medicare FFS 2023' },
        { name: 'U.S. Census Bureau ACS 5-Year Estimates (2018-2022)', geography: 'Rhode Island Counties' },
        { name: 'Rhode Island Department of Health (RIDOH) Viral Hepatitis Surveillance', year: 2023 },
        { name: 'NPPES NPI Provider Registry', state: 'RI' }
      ],
      methodological_caveats: CLINICAL_RULES.caveats
    },
    statewide_summary: {
      total_population: rawDemographics.reduce((a, b) => a + b.total_population, 0),
      adult_population: totalStateAdultPop,
      total_screening_services_recorded: totalStateServices,
      active_participating_providers: validProviders.length,
      chronic_hepb_reported_cases: rawSurveillance.chronic_hepatitis_b.total_reported_cases,
      chronic_hepb_reported_rate_per_100k: rawSurveillance.chronic_hepatitis_b.rate_per_100k,
      perinatal_screening_rate_pct: rawSurveillance.perinatal_screening.maternal_hbsag_screening_rate_pct
    },
    county_metrics: countyMetrics,
    specialty_metrics: specialtyMetrics,
    providers: validProviders,
    claims: normalizedClaims,
    surveillance: rawSurveillance
  };

  // Write Processed Artifacts
  await mkdir(resolve(ROOT, 'data/processed'), { recursive: true });
  await writeFile(
    resolve(ROOT, 'data/processed/ri_hepb_analytical_dataset.json'),
    JSON.stringify(processedData, null, 2),
    'utf8'
  );

  console.log(`[Pipeline] Processed dataset successfully generated with ${normalizedClaims.length} claim lines across ${countyMetrics.length} counties.`);
  return processedData;
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runIngestionPipeline().catch(err => {
    console.error('[Pipeline Error]', err);
    process.exit(1);
  });
}
