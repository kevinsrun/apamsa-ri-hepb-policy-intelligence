import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CDC = 'https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html';
/** Only independently sourced metrics enter active views. Original fixtures remain
 * versioned, not recertified by shape validation or regenerated timestamps. */
export async function runIngestionPipeline({ persist = true } = {}) {
  const path = resolve(ROOT, 'acceptance/raw/cdc2022-table-2.5.xlsx');
  const proof = JSON.parse(await readFile(resolve(ROOT, 'acceptance/raw/cdc2022-extraction.json'), 'utf8'));
  const bytes = await readFile(path);
  if (createHash('sha256').update(bytes).digest('hex') !== proof.sha256 || proof.sheet !== 'Tab2.5' || proof.state !== 'Rhode Island' || proof.cases !== 364 || proof.rate !== 33.3) throw new Error('CDC evidence mismatch; no fallback values permitted');
  const source = { url: CDC, publicationYear: 2024, datasetYear: 2022, table: '2.5', sheet: proof.sheet,
    cells: ['B42','C42','D42'], sha256: proof.sha256, retrievedAt: proof.retrievedAt,
    classification: 'VERIFIED', freshness: 'HISTORICAL_NOT_CURRENT' };
  const dataset = {
    metadata: { schemaVersion: 2, generated_at: new Date().toISOString(), state: 'Rhode Island',
      purpose: 'Research evidence review only; not clinical decision support or a current provider directory.',
      sourceStatus: 'HISTORICAL_NOT_CURRENT', sources: [source],
      warnings: ['2022 surveillance is historical, not current prevalence or incidence of newly acquired infection.',
        'CMS procedure counts are prototype fixtures, not observed CMS utilization; no clinical practice conclusions are supported.',
        'ACS demographics, demographic risk scores, lab market estimates and provider identities are quarantined pending authoritative extraction.',
        '138 cases, 98.4% perinatal screening, 78.3%, 68.4%, and prevalence 3,000–8,000+ are not verified.'],
    },
    statewide_summary: {
      chronic_hepb_newly_reported_cases_2022: proof.cases,
      chronic_hepb_newly_reported_rate_per_100k_2022: proof.rate,
      acute_hepb_reported_rate_per_100k_2022: null,
      total_population: null, adult_population: null, total_screening_services_recorded: null,
      active_participating_providers: 0,
      prevalence_distinction_note: 'Newly reported chronic cases are not total prevalent infections or new-infection incidence. Statewide prevalence not established here.',
      provenance: source,
    },
    providers: [], claims: [], county_metrics: [], specialty_metrics: [],
    quarantine: { providerRecords: 12, providerStatus: 'CONTRADICTED_OR_UNVERIFIED_IDENTITIES',
      demographicStatus: 'UNVERIFIED', claimsStatus: 'PROTOTYPE', modeledCountyStatus: 'ESTIMATED_UNVALIDATED',
      originalInputs: ['ri_county_demographics.json','ri_providers_nppes.json','cms_medicare_ri_hepb_services.json','ri_surveillance_hepb.json'],
      instructions: 'Inspect versioned raw inputs and SCIENTIFIC-PROVENANCE-AUDIT.md; not a referral, screening or resource-allocation dataset.' },
  };
  if (persist) {
    await mkdir(resolve(ROOT, 'data/processed'), { recursive: true });
    await writeFile(resolve(ROOT, 'data/processed/ri_hepb_analytical_dataset.json'), JSON.stringify(dataset, null, 2) + '\n');
  }
  return dataset;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) runIngestionPipeline().catch(e => { console.error(e.message); process.exitCode=1; });
