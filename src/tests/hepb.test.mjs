import { describe, it } from 'node:test';
import assert from 'node:assert';
import { interpretTriplePanel, CDC_2023_RECOMMENDATIONS, HEPB_CODES } from '../clinical/guidelines.mjs';
import { runIngestionPipeline } from '../pipeline/ingest.mjs';
import { analyzeScreeningData } from '../analysis/analytics.mjs';

describe('Clinical Evidence & Guidelines Engine', () => {
  it('contains CDC 2023 universal adult screening recommendation', () => {
    const universal = CDC_2023_RECOMMENDATIONS.find(r => r.recommendationType === 'UNIVERSAL_ADULT');
    assert.ok(universal, 'Universal adult recommendation should exist');
    assert.strictEqual(universal.publicationYear, 2023);
    assert.deepStrictEqual(universal.recommendedTests, ['HBsAg', 'anti-HBs', 'total anti-HBc']);
  });

  it('correctly interprets chronic hepatitis B infection', () => {
    // HBsAg positive, anti-HBs negative, total anti-HBc positive
    const res = interpretTriplePanel(true, false, true);
    assert.strictEqual(res.immunityType, 'CHRONIC_ACTIVE');
    assert.strictEqual(res.clinicalStatus, 'Chronic Hepatitis B Infection');
    assert.match(res.actionRequired, /specialist/i);
  });

  it('correctly interprets resolved natural immunity', () => {
    // HBsAg negative, anti-HBs positive, total anti-HBc positive
    const res = interpretTriplePanel(false, true, true);
    assert.strictEqual(res.immunityType, 'NATURAL');
    assert.strictEqual(res.clinicalStatus, 'Resolved Past Hepatitis B Infection (Immune)');
  });

  it('correctly interprets vaccine-induced immunity', () => {
    // HBsAg negative, anti-HBs positive, total anti-HBc negative
    const res = interpretTriplePanel(false, true, false);
    assert.strictEqual(res.immunityType, 'VACCINE');
    assert.strictEqual(res.clinicalStatus, 'Vaccine-Induced Immunity');
  });

  it('correctly interprets susceptible individuals', () => {
    // HBsAg negative, anti-HBs negative, total anti-HBc negative
    const res = interpretTriplePanel(false, false, false);
    assert.strictEqual(res.immunityType, 'NONE');
    assert.strictEqual(res.clinicalStatus, 'Susceptible (Non-Immune)');
    assert.match(res.actionRequired, /vaccine series/i);
  });

  it('correctly interprets isolated anti-HBc', () => {
    // HBsAg negative, anti-HBs negative, total anti-HBc positive
    const res = interpretTriplePanel(false, false, true);
    assert.strictEqual(res.immunityType, 'ACUTE_OR_INDETERMINATE');
    assert.strictEqual(res.clinicalStatus, 'Isolated Anti-HBc (Uncertain / Distant Exposure)');
  });

  it('correctly maps CPT and HCPCS codes', () => {
    assert.strictEqual(HEPB_CODES['87340'].panel_component, 'hbsag');
    assert.strictEqual(HEPB_CODES['86706'].panel_component, 'antihbs');
    assert.strictEqual(HEPB_CODES['86704'].panel_component, 'antihbc_total');
    assert.strictEqual(HEPB_CODES['G0499'].panel_component, 'medicare_screen');
  });
});

describe('Data Ingestion & Transformation Pipeline', () => {
  it('successfully ingests and transforms Rhode Island datasets', async () => {
    const dataset = await runIngestionPipeline();
    assert.ok(dataset.metadata);
    assert.strictEqual(dataset.metadata.state, 'Rhode Island');
    assert.strictEqual(dataset.county_metrics.length, 5);
    
    // Verify Providence County is the top volume county
    const providence = dataset.county_metrics.find(c => c.county === 'Providence County');
    assert.ok(providence);
    assert.strictEqual(providence.fips, '44007');
    assert.ok(providence.services.total_services > 1000);
    assert.ok(providence.foreign_born_pct > 20.0);
  });
});

describe('Quantitative Analytics & Discordance Engine', () => {
  it('correctly computes panel discordance ratios and demographic index', async () => {
    const dataset = await runIngestionPipeline();
    const analytics = analyzeScreeningData(dataset);

    assert.ok(analytics.panelDiscordance);
    assert.ok(analytics.panelDiscordance.hbsag_volume > 0);
    assert.ok(analytics.panelDiscordance.antihbs_to_hbsag_ratio < 1.0);
    assert.ok(analytics.panelDiscordance.antihbc_to_hbsag_ratio < 1.0);

    // Verify Providence County has highest need score
    assert.strictEqual(analytics.countyDisparities[0].county, 'Providence County');

    // Verify measurement limitations documented
    assert.ok(analytics.measurementLimitations.coverage_gap);
    assert.ok(analytics.measurementLimitations.billing_channel_fragmentation);
  });
});
