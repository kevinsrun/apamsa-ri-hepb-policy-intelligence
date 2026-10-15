import { describe, it } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { interpretTriplePanel, CDC_2023_RECOMMENDATIONS, HEPB_CODES } from '../clinical/guidelines.mjs';
import { runIngestionPipeline } from '../pipeline/ingest.mjs';
import { analyzeScreeningData } from '../analysis/analytics.mjs';

describe('Clinical Evidence & Guidelines Engine (All 8 Permutations)', () => {
  it('contains CDC 2023 universal adult screening recommendation', () => {
    const universal = CDC_2023_RECOMMENDATIONS.find(r => r.recommendationType === 'UNIVERSAL_ADULT');
    assert.ok(universal, 'Universal adult recommendation should exist');
    assert.strictEqual(universal.publicationYear, 2023);
    assert.deepStrictEqual(universal.recommendedTests, ['HBsAg', 'anti-HBs', 'total anti-HBc']);
  });

  it('1. correctly interprets susceptible individuals', () => {
    const res = interpretTriplePanel(false, false, false);
    assert.strictEqual(res.cdcCategory, 'SUSCEPTIBLE');
    assert.strictEqual(res.immunityType, 'NONE');
    assert.strictEqual(res.clinicalStatus, 'Susceptible (Non-Immune)');
    assert.match(res.actionRequired, /vaccine series/i);
  });

  it('2. correctly interprets vaccine-induced immunity', () => {
    const res = interpretTriplePanel(false, true, false);
    assert.strictEqual(res.cdcCategory, 'IMMUNE_VACCINE');
    assert.strictEqual(res.immunityType, 'VACCINE');
    assert.strictEqual(res.clinicalStatus, 'Vaccine-Induced Immunity');
  });

  it('3. correctly interprets resolved natural immunity and flags reactivation risk', () => {
    const res = interpretTriplePanel(false, true, true);
    assert.strictEqual(res.cdcCategory, 'IMMUNE_NATURAL');
    assert.strictEqual(res.immunityType, 'NATURAL');
    assert.strictEqual(res.reactivationRisk, 'MODERATE_UNDER_SEVERE_IMMUNOSUPPRESSION');
    assert.match(res.actionRequired, /cccDNA/i);
  });

  it('4. correctly interprets chronic hepatitis B infection', () => {
    const res = interpretTriplePanel(true, false, true);
    assert.strictEqual(res.cdcCategory, 'CHRONIC_INFECTION');
    assert.strictEqual(res.immunityType, 'CHRONIC_ACTIVE');
    assert.match(res.actionRequired, /specialist/i);
  });

  it('5. correctly interprets acute hepatitis B when IgM anti-HBc is positive', () => {
    const res = interpretTriplePanel(true, false, true, { igmAntiHBc: true });
    assert.strictEqual(res.cdcCategory, 'ACUTE_INFECTION');
    assert.strictEqual(res.clinicalStatus, 'Acute Hepatitis B Infection');
  });

  it('6. correctly interprets isolated anti-HBc with 4 differential possibilities', () => {
    const res = interpretTriplePanel(false, false, true);
    assert.strictEqual(res.cdcCategory, 'ISOLATED_CORE');
    assert.strictEqual(res.immunityType, 'ACUTE_OR_INDETERMINATE');
    assert.match(res.actionRequired, /waning/i);
    assert.match(res.actionRequired, /anamnestic/i);
  });

  it('7. correctly interprets early acute infection prior to core seroconversion', () => {
    const res = interpretTriplePanel(true, false, false);
    assert.strictEqual(res.cdcCategory, 'EARLY_ACUTE');
    assert.match(res.actionRequired, /repeat/i);
  });

  it('8. correctly interprets concurrent HBsAg and anti-HBs (escape mutant)', () => {
    const res = interpretTriplePanel(true, true, true);
    assert.strictEqual(res.cdcCategory, 'ESCAPE_MUTANT_OR_TRANSITIONAL');
    assert.strictEqual(res.immunityType, 'CHRONIC_ACTIVE');
    assert.match(res.actionRequired, /mutant/i);
  });

  it('9. correctly handles biologically atypical pattern', () => {
    const res = interpretTriplePanel(true, true, false);
    assert.strictEqual(res.cdcCategory, 'ATYPICAL');
    assert.match(res.actionRequired, /consult/i);
  });

  it('10. correctly maps all CPT and HCPCS codes', () => {
    assert.strictEqual(HEPB_CODES['87340'].panel_component, 'hbsag');
    assert.strictEqual(HEPB_CODES['86706'].panel_component, 'antihbs');
    assert.strictEqual(HEPB_CODES['86704'].panel_component, 'antihbc_total');
    assert.strictEqual(HEPB_CODES['G0499'].panel_component, 'medicare_screen');
  });
});

describe('Data Ingestion & Integrity Audits', () => {
  it('11. ingests Rhode Island datasets and validates county FIPS', async () => {
    const dataset = await runIngestionPipeline();
    const validFips = new Set(['44001', '44003', '44005', '44007', '44009']);
    for (const c of dataset.county_metrics) {
      assert.ok(validFips.has(c.fips), `FIPS ${c.fips} should be valid RI FIPS`);
    }
  });

  it('12. validates Census ACS population sum equals state total', async () => {
    const dataset = await runIngestionPipeline();
    const sumCountyPop = dataset.county_metrics.reduce((a, b) => a + b.total_population, 0);
    assert.strictEqual(sumCountyPop, dataset.statewide_summary.total_population);
    assert.strictEqual(sumCountyPop, 1095605);
  });

  it('13. validates verified CDC chronic surveillance benchmarks', async () => {
    const dataset = await runIngestionPipeline();
    assert.strictEqual(dataset.statewide_summary.chronic_hepb_reported_cases, 364);
    assert.strictEqual(dataset.statewide_summary.chronic_hepb_reported_rate_per_100k, 33.3);
  });

  it('14. verifies all claims are explicitly tagged with data_grade UNVERIFIED_PROTOTYPE_FIXTURE', async () => {
    const dataset = await runIngestionPipeline();
    for (const claim of dataset.claims) {
      assert.strictEqual(claim.data_grade, 'UNVERIFIED_PROTOTYPE_FIXTURE');
    }
  });

  it('15. verifies all 12 providers have valid 10-digit NPIs', async () => {
    const dataset = await runIngestionPipeline();
    assert.strictEqual(dataset.providers.length, 12);
    for (const p of dataset.providers) {
      assert.strictEqual(p.npi.length, 10);
      assert.ok(/^\d{10}$/.test(p.npi));
    }
  });
});

describe('Quantitative Analytics & Discordance Engine', () => {
  it('16. correctly computes panel discordance ratios', async () => {
    const dataset = await runIngestionPipeline();
    const analytics = analyzeScreeningData(dataset);

    assert.ok(analytics.panelDiscordance);
    assert.ok(analytics.panelDiscordance.hbsag_volume > 0);
    assert.ok(analytics.panelDiscordance.antihbs_to_hbsag_ratio < 1.0);
    assert.ok(analytics.panelDiscordance.antihbc_to_hbsag_ratio < 1.0);
  });

  it('17. verifies Providence County has highest demographic need score', async () => {
    const dataset = await runIngestionPipeline();
    const analytics = analyzeScreeningData(dataset);
    assert.strictEqual(analytics.countyDisparities[0].county, 'Providence County');
  });

  it('18. verifies measurement limitations are documented', async () => {
    const dataset = await runIngestionPipeline();
    const analytics = analyzeScreeningData(dataset);
    assert.ok(analytics.measurementLimitations.coverage_gap);
    assert.ok(analytics.measurementLimitations.billing_channel_fragmentation);
  });
});

describe('Live Web Server & REST API Verification', () => {
  function fetchHttp(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:3000${path}`, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject);
    });
  }

  it('19. serves web application HTML with 200 OK and utf-8 charset', async () => {
    const res = await fetchHttp('/');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.body, /Rhode Island Hepatitis B Evidence & Screening Platform/);
  });

  it('20. serves /api/data with valid JSON and verified metadata', async () => {
    const res = await fetchHttp('/api/data');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    const parsed = JSON.parse(res.body);
    assert.strictEqual(parsed.metadata.state, 'Rhode Island');
    assert.strictEqual(parsed.statewide_summary.chronic_hepb_reported_cases, 364);
  });

  it('21. returns 404 for nonexistent routes', async () => {
    const res = await fetchHttp('/api/nonexistent-endpoint-123');
    assert.strictEqual(res.status, 404);
  });
});
