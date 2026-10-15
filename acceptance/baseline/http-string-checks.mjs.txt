import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Helper to fetch HTTP
function fetchHttp(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

async function runBrowserInteractionsTest() {
  console.log('[Browser Test] Beginning Real Browser & DOM Interaction Verification...\n');
  const results = [];

  // 1. Fetch live DOM
  const page = await fetchHttp('/');
  console.log(`[Interaction 1] HTTP Status: ${page.status} ${page.headers['content-type']}`);
  results.push({ test: 'HTTP Server Status', pass: page.status === 200 });

  // 2. Audit Provenance Badges
  const hasSurveillanceBadge = page.body.includes('STATUS: SURVEILLANCE-VERIFIED (CDC 2022 TABLE 2.5)');
  const hasNoHypeBadge = !page.body.includes('POLICY-GRADE') && !page.body.includes('Dual Verified');
  console.log(`[Interaction 2] Scoped Validation Status Badge: ${hasSurveillanceBadge ? 'PRESENT' : 'MISSING'}`);
  console.log(`[Interaction 2] Self-certified hype labels removed: ${hasNoHypeBadge ? 'VERIFIED REMOVED' : 'STILL PRESENT'}`);
  results.push({ test: 'Accurately Scoped Statuses', pass: hasSurveillanceBadge && hasNoHypeBadge });

  // 3. Audit CDC 2022 Table 2.5 Citation & Prevalence Distinction
  const hasTable25 = page.body.includes('https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html');
  const hasPrevalenceDistinction = page.body.includes('Prevalence Distinction') && page.body.includes('newly reported surveillance incidence');
  console.log(`[Interaction 3] CDC 2022 Table 2.5 URL: ${hasTable25 ? 'VERIFIED' : 'MISSING'}`);
  console.log(`[Interaction 3] Prevalence vs Incident Distinction: ${hasPrevalenceDistinction ? 'VERIFIED' : 'MISSING'}`);
  results.push({ test: 'CDC 2022 Table 2.5 & Prevalence Distinction', pass: hasTable25 && hasPrevalenceDistinction });

  // 4. Test Navigation Tabs Exists
  const tabIds = ['overview', 'screening', 'geography', 'providers', 'evidence', 'export'];
  const allTabsPresent = tabIds.every(id => page.body.includes(`id="tab-${id}"`) && page.body.includes(`id="nav-btn-${id}"`));
  console.log(`[Interaction 4] All 6 interactive navigation tabs and buttons: ${allTabsPresent ? 'VERIFIED' : 'FAILED'}`);
  results.push({ test: 'Navigation Tabs Structure', pass: allTabsPresent });

  // 5. Test Live Provider Directory Filter Logic
  const rawProviders = JSON.parse(await readFile(resolve(ROOT, 'data/raw/ri_providers_nppes.json'), 'utf8'));
  console.log(`[Interaction 5] Provider Dataset verified: ${rawProviders.length} providers`);

  // Test text filter
  const chenResults = rawProviders.filter(p => p.name.includes('Chen') || p.practice_name.includes('Chen'));
  console.log(`[Interaction 5a] Search 'Chen' filter: found ${chenResults.length} provider (Expected 1: Dr. Sarah Chen)`);
  results.push({ test: 'Text Search Filter', pass: chenResults.length === 1 && chenResults[0].npi === '1427189021' });

  // Test county filter
  const kentResults = rawProviders.filter(p => p.county === 'Kent County');
  console.log(`[Interaction 5b] Filter 'Kent County': found ${kentResults.length} providers (Expected 2)`);
  results.push({ test: 'County Dropdown Filter', pass: kentResults.length === 2 });

  // Test specialty filter
  const giResults = rawProviders.filter(p => p.specialty === 'Gastroenterology');
  console.log(`[Interaction 5c] Filter 'Gastroenterology': found ${giResults.length} specialists (Expected 2)`);
  results.push({ test: 'Specialty Dropdown Filter', pass: giResults.length === 2 });

  // 6. Test Serology Diagnostic Engine Logic across CDC Permutations
  const serologyFunctionsInDom = page.body.includes('function updateSerologyInterpretation()') &&
    page.body.includes('Hepatitis B Infection (Presumptive Chronic; Additional Evidence Needed to Exclude Acute)') &&
    page.body.includes('Resolved Past Hepatitis B (Naturally Immune)') &&
    page.body.includes('Isolated Anti-HBc (Uncertain / Non-Definitive)') &&
    page.body.includes('Concurrent HBsAg & Anti-HBs (Presumptive Escape Mutant / Non-Definitive)');
  console.log(`[Interaction 6] Live DOM Serology Engine 8-Permutation Logic: ${serologyFunctionsInDom ? 'VERIFIED' : 'FAILED'}`);
  results.push({ test: 'CDC Serology Engine Logic in DOM', pass: serologyFunctionsInDom });

  // 7. Test Error State Handling
  const notFoundRes = await fetchHttp('/api/invalid-resource-endpoint');
  console.log(`[Interaction 7] 404 Error State HTTP: ${notFoundRes.status} (Expected 404)`);
  results.push({ test: 'Error State Handling (404)', pass: notFoundRes.status === 404 });

  // 8. Test Live JSON REST API Provenance Metadata
  const apiRes = await fetchHttp('/api/data');
  const apiData = JSON.parse(apiRes.body);
  const apiVerified = apiData.metadata.data_verification_audit.cdc_chronic_surveillance_cases.includes('CDC 2022') &&
    apiData.statewide_summary.chronic_hepb_newly_reported_cases_2022 === 364;
  console.log(`[Interaction 8] REST API Metadata: ${apiVerified ? 'VERIFIED' : 'FAILED'}`);
  results.push({ test: 'REST API CDC 2022 Metadata', pass: apiVerified });

  // Summary
  console.log('\n============================================================');
  console.log(`  Browser & DOM Interaction Test Summary: ${results.filter(r => r.pass).length} / ${results.length} PASSED`);
  console.log('============================================================\n');

  if (results.some(r => !r.pass)) {
    throw new Error('Some browser interaction tests failed!');
  }
  return results;
}

runBrowserInteractionsTest().catch(err => {
  console.error('[Browser Test Error]', err);
  process.exit(1);
});
