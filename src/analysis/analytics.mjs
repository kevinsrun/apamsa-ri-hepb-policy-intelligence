import { readFile } from 'node:fs/promises';
/** Active analytics never resurrect quarantined fixtures as clinical measurements. */
export function analyzeScreeningData(dataset) {
  if (dataset.metadata?.schemaVersion !== 2) throw new Error('Unreviewed dataset schema; regenerate with evidence gate');
  return { statewide_summary: dataset.statewide_summary, countyDisparities: [], specialtyBreakdown: [],
    panelDiscordance: null,
    measurementLimitations: { coverage_gap: 'No representative CMS extraction is available.',
      billing_channel_fragmentation: 'Ordering clinician and billing laboratory differ; no percentage established.',
      clinicalInference: 'Aggregate procedure volumes cannot identify patient-level completed panels or provider noncompliance.' },
    quarantine: dataset.quarantine };
}
export async function loadAndAnalyze() {
  return analyzeScreeningData(JSON.parse(await readFile(new URL('../../data/processed/ri_hepb_analytical_dataset.json',import.meta.url),'utf8')));
}
