# Rhode Island Hepatitis B Policy Evidence Prototype

A research prototype for reviewing Rhode Island hepatitis B screening and
advocacy evidence. It includes a provenance-aware data pipeline, a local web
interface, reviewed JSON export, and an educational serology interpreter.

## Status: remediation required

**Not accepted for policy or clinical use. Original acceptance claims were
withdrawn after an evidence audit.** This is not clinical decision support,
a current provider directory, a prevalence model, or a resource-allocation tool.
A passing software test does not establish scientific or clinical validity.

The existing audit reports independent verification of only two historical
CDC 2022 Rhode Island surveillance values: 364 newly reported chronic cases and
33.3 per 100,000. These are reported notifications, not total prevalent
infections or incidence of newly acquired infection. This README does not add a
new source verification or refresh those values.

Unsupported demographic estimates, county allocations, provider identities,
Medicare utilization fixtures, perinatal percentages and prevalence estimates
remain quarantined. Active outputs must not promote them into observed findings.
The educational interpreter requires qualified clinical review and dated records;
it must not be used to diagnose or direct care.

Read [the scientific provenance audit](SCIENTIFIC-PROVENANCE-AUDIT.md),
[research protocol](docs/RESEARCH-PROTOCOL.md) and
[limitations](docs/LIMITATIONS-AND-BIAS.md) before using any output.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/pipeline/ingest.mjs` | Build the restricted reviewed dataset from retained evidence |
| `src/analysis/analytics.mjs` | Restricted analysis of the reviewed dataset |
| `src/clinical/guidelines.mjs` | Educational interpretation with explicit uncertainty |
| `src/web/` | Local web interface |
| `src/tests/hepb.test.mjs` | Node regression tests |
| `data/processed/ri_hepb_analytical_dataset.json` | Generated reviewed dataset |
| `acceptance/raw/` | Retained source evidence and retrieval metadata |
| `acceptance/scientific-claims.json` | Claim-by-claim provenance and classification |
| `acceptance/logs/` | Historical test and reproduction logs, not current certification |
| `scripts/acceptance-browser.mjs` | Real Chromium interaction checks |

Raw and baseline records may contain withdrawn claims. Their presence in Git is
for audit custody, not permission to use them as facts or publish them.

## Local requirements

- Node.js 22 is the documented reproduction runtime. Record the actual version
  used for each new run.
- The retained workbook `acceptance/raw/cdc2022-table-2.5.xlsx` and its proof file
  `acceptance/raw/cdc2022-extraction.json` must be present. The pipeline verifies
  the workbook SHA256 and expected source fields. Missing or mismatched evidence
  must fail; do not reconstruct it from expected numbers or substitute fixtures.
- Browser checks require an existing Playwright installation and Chromium.
  The runner has a machine-specific default module path; set
  `APAMSA_PLAYWRIGHT_MODULE` to the appropriate installed module on your machine.
  Scripts do not automatically install browser packages.
- The separate scientific reproduction script requires Python with `openpyxl`.

## Run locally

Work in an isolated private checkout. Preserve the original worktree and evidence.

```sh
node --version
npm run pipeline
npm run serve
```

The server defaults to `http://127.0.0.1:3000`, binds only to loopback, accepts
GET/HEAD requests, and serves an explicit file allowlist. Set `PORT` only if a
different local port is needed. Do not expose it publicly or deploy it as a
clinical or policy service.

`npm run pipeline` writes the generated reviewed JSON locally. To inspect the
pipeline without persisting output:

```sh
node --input-type=module -e 'import {runIngestionPipeline} from "./src/pipeline/ingest.mjs"; console.log(JSON.stringify(await runIngestionPipeline({persist:false}), null, 2));'
```

## Check behavior

```sh
npm run test:unit
npm test
npm run test:browser
python3 scripts/reproduce-scientific-claims.py
```

These checks have different meanings:

- `test:unit` runs the Node tests.
- `test` owns an ephemeral loopback server and runs Node tests plus HTTP/API
  assertions. HTTP/string checks are not browser interactions.
- `test:browser` runs real Chromium interactions against its owned local server.
  It exercises tabs, educational interpretations, warnings, export and failure
  states. It creates local acceptance artifacts and temporarily removes/restores
  a backend file to check failure behavior; use a disposable isolated checkout.
- Scientific reproduction checks retained evidence and calculations. It does not
  automatically establish source freshness, qualified clinical acceptance, or a
  new independent review.

Capture commit, runtime, commands, failures and artifact hashes for a new run.
Historical passing counts in audit documents are not proof that the current
checkout passes. Keep unsupported data excluded, unknown values null, historical
source years visible, and missing-source failures explicit.

## Development boundaries

1. Keep source provenance, units, year, case definition and uncertainty attached
   to every released claim.
2. Do not equate regenerated output timestamps with fresh evidence retrieval.
3. Never turn prototype fixtures, provider-shaped records or demographic proxies
   into verified observations by relabeling them.
4. Keep secrets, correspondence and collaborator material out of source uploads
   and model prompts. Scope any external coding review to approved files.
5. Do not describe historical direct shell/model work as native Fleet execution.
   New Fleet work needs its own genuine admission, execution and review evidence.
6. No deployment, clinical use, public sharing or outreach follows from this
   documentation or from passing tests.

## Documentation and review trail

- [Scientific provenance audit](SCIENTIFIC-PROVENANCE-AUDIT.md)
- [Research protocol](docs/RESEARCH-PROTOCOL.md)
- [Limitations and bias](docs/LIMITATIONS-AND-BIAS.md)
- [Stakeholder brief](docs/APAMSA-STAKEHOLDER-BRIEF.md)
- [Independent acceptance review](CODEX-INDEPENDENT-ACCEPTANCE.md)
- [Acceptance evidence manifest](ACCEPTANCE-EVIDENCE.json)

Package metadata declares Apache-2.0. Verify applicable license files, source
rights and third-party data terms before redistribution; metadata alone is not
clearance to publish all retained material.
