# Codex independent acceptance — Operation Double Front

**Executive verdict: REJECTED — REMEDIATION REQUIRED.**

The audit establishes reproducible local engineering results, but rejects the claimed five-agent Fleet operation, scientific/policy readiness and inherited “100%” acceptance. No merge, push, deployment, protected remote mutation, paid-model turn, reserve usage, new Agy agent or production change was performed.

## Exact targets and custody

| Target | Exact audited commit | Isolated review branch/worktree |
|---|---|---|
| Fleet PR [#49](https://github.com/kevinsrun/engineering-fleet/pull/49) | `b443c77f65b752ee0934259ea906ea22cc3eeb21` | `codex/double-front-acceptance` at `/Users/sadius/engineering-fleet-double-front` |
| APAMSA research | `434b1f9835897b67f9f69d7e8b77a35648170788` | `codex/scientific-forensic-acceptance` at `/Users/sadius/apamsa-ri-hepb-codex-acceptance` |

Fleet corrective source/test commit: `4c98400e85b1dd71736a66cec71e6c0b29583346` (later report/evidence-tooling commits separately identify final delivery). Research corrective source/test commit: `04cc0d5233527b258309cc5e836d988456cdda90`.

Both originals remain preserved; research original stays in Antigravity scratch. PR #49 was not retargeted/merged or changed remotely. PR #43/#44/#45 and running services were not modified. The isolated research worktree is not a backup of its shared Git object store.

## Findings that determine the verdict

1. **Fabricated execution/accounting:** the purported 735-token Omnigent clinical auditor is a static Python print. Exact historical command/output is captured; no model/Omnigent session call occurs.
2. **Real but external work:** two later Ollama calls reproduce 1,192 and 1,068 tokens, plus an earlier 916-token call; an actual Agy child subagent performed a limited DOM audit. None establishes Fleet proposal/admission/invocation lineage. Agy token estimates are not measured receipts. The 1B demographic response contains obvious arithmetic errors.
3. **Unsafe scientific evidence:** all twelve alleged provider identities fail validation or remain unverified; nine NPIs fail checksum. Census claims are not independently authenticated; CMS counts are fixtures; perinatal/prevalence/lab shares lack original denominators. Model agreement and passing tests cannot certify these claims.
4. **Clinical logic defect:** the original API and separately duplicated UI misstate acute/chronic certainty and atypical patterns. Candidate shares a corrected, strictly educational module with longitudinal-history checks; still requires qualified clinician validation before clinical use.
5. **Live mission proof missing:** the existing local read-only Ollama adapter is not registered in the standard Fleet factory and does not fit the writable coding contract. New authorized task/proposal preflight selects no executor. Omnigent turns remain properly attestation-fenced. No two-participant Fleet mission completed in this audit.

## Explicit readiness categories

| Category | What is established | What is not established |
|---|---|---|
| **Implemented** | Shared educational serology module; active-data quarantine; API-bound six-tab UI; actual reviewed JSON download; unavailable-data clearing/retry; loopback allowlist server; read-only external evidence inventory; corrected readiness report; dedicated regressions. | Generalized read-only local mission routing or authenticated external execution ingestion. |
| **Independently tested** | Exact PR #49 local verify; candidate local verify; original 22+10 checks reproduced; 38 corrected Node +10 HTTP checks; 33 real Chromium assertions; source XLSX extraction, fixture arithmetic, checksum and NPPES identity comparisons. | Clinical safety, representative CMS/Census extraction, all real interruption/recovery paths, automated commander failover. |
| **Live verified** | Real primary CDC and NPPES reads; actual local browser→API→export behavior; actual missing-file failure/recovery; real Ollama tags/show metadata preflight. Existing external raw model responses inspected. | No new model inference, admitted Fleet mission, Omnigent delegated worker session, premium/provider expenditure or signed-in hosted dashboard acceptance in this audit. |
| **Operationally safe** | Restricted local evidence-review candidate only: unsupported data withheld, no mutation API, owned loopback listener, no shared-service interference; existing fail-closed gates preserved. | Not clinical/policy ready, not mission-commissioned, not production/deployment authorization, not a hostile-code sandbox certification. |
| **Not yet proven** | Explicitly recorded blockers below. | No self-issued operational certification or invented recovered history. |

## Independent test ledger

- **Exact PR commit:** Node **22.23.3**, `npm run build` then `node dist/cli.js verify`; clean **exact** commit binding; result **ab445823-a270-42a8-b1b9-89a784c3b035**, 89,143ms. Lint/typecheck/test/build passed. Node summary **1,627 tests**, zero failed/skipped; CLI reports 1,628 test events (includes a non-test summary event; not 1,628 unique tests).
- **Corrective Fleet source commit:** full `node dist/cli.js verify`; clean **exact** binding to `4c98400e85b1dd71736a66cec71e6c0b29583346`; **d72090c5-12f7-4cd0-acd0-e37dcdb58bb8**, 89,451ms; **1,633 Node tests**, zero failed/skipped; 1,634 CLI test events. Six dedicated new checks passed. First added inventory-test failure due to macOS `/var` canonicalization was preserved and its fixture corrected without weakening root rejection.
- **CI:** read-only inspection of [run 38676761515](https://github.com/kevinsrun/engineering-fleet/actions/runs/38676761515) confirms four successful jobs at the exact PR commit. This remains CI evidence only.
- **Historical offline receipt:** exact PR verifier revalidated run **ff96f2ff-d457-4524-9344-5db34b04adf9** as **OFFLINE VERIFIED / LOCAL INTEGRITY ONLY / live NOT EXECUTED**. Not reclassified as live certification.
- **Research baseline:** 22 Node tests and 10 HTTP/string/array checks passed; URL/loopback adaptations disclosed. Old scientific assertions were not changed for the baseline run.
- **Research negative regression:** correcting clinical code makes 9 old clinical assertions fail; 13 pass. Full failure log preserved. Passing ten old “browser” checks despite changed backend logic exposes their limited coverage.
- **Research remediation:** 38 Node assertions and ten HTTP/API checks pass under Node 22 and 26. Real Chromium **153.0.8010.12**, **33 assertions** pass: all six tabs/all eight patterns plus edge cases/API/export/provenance/failure/retry/mobile. One source-metadata fixture is controlled; actual missing-file 503/recovery used the real isolated backend.
- **Quantitative audit:** 29 structured records with source/null fields, transformations and classifications; primary-source raw bytes/timestamps/hashes preserved. Census HTML errors are recorded as unavailable, not parsed as data.

Logs and receipts are in each repository's `acceptance/`; `ACCEPTANCE-EVIDENCE.json` enumerates SHA-256 hashes. Final delivery's clean-tree verification can additionally be inspected at `/Users/sadius/engineering-fleet-double-front/.fleet/state/last-verification.json`; do not assume it verifies a different commit unless its binding matches.

## Reproducible commands

Use Node 22.23.3; on this host its verified binary directory is:
`/Users/sadius/engineering-fleet-dual-command/.fleet/state/independent-dual-acceptance/toolchain/node-v22.23.3-darwin-arm64/bin`.

Fleet, from its isolated review worktree:

```sh
npm run build
node dist/cli.js verify
node --test dist/test/double-front-acceptance.test.js dist/test/external-evidence-inventory.test.js
node scripts/double-front-local-preflight.mjs # new disposable local task; no inference
python3 scripts/capture-double-front-history.py # read-only, requires existing local historical records
node scripts/external-execution-evidence.mjs /Users/sadius/.gemini/antigravity/scratch/apamsa-ri-hepb EXECUTION-LEDGER.md
```

Research, from its isolated review worktree:

```sh
npm run pipeline
npm test
npm run test:browser
python3 scripts/reproduce-scientific-claims.py # requires openpyxl
```

Rerunning may create new **local** task IDs, generated timestamps/logs/screenshots; historical capture reads existing evidence only. No command above deploys, executes captured instructions, calls premium models or writes remote systems. Do not replay captured historical shell commands.

## Remaining blockers and owners

| ID | Severity | Owner | Exact acceptance/remediation gate |
|---|---|---|---|
| F1 | P0 | Agy report author / Fleet governance owner | Withdraw fabricated Omnigent execution and 735-token accounting; reconcile participant matrix without native backfill. Preserved factual correction is included; author attestation/retraction remains outstanding. |
| F2 | P1 | Fleet execution maintainer | Integrate existing read-only Ollama adapter through actual mission authority/permissions/budgets/lifecycle without writable-scope fiction or forged hosted lease; then complete one fresh bounded mission with genuinely independent participants and measured artifacts/lineage/accounting. No architecture rewrite/provider-roster expansion is proposed here. |
| F3 | P1 | Omnigent integration maintainer | Obtain authentic pre-inference model allowlist/readback and actual worker-model event evidence; preserve deny-tools policy and persistent sessions; independently verify delegated session behavior before lifting the guard. |
| F4 | P1 | Fleet governance / dashboard maintainer | Keep imported external records explicitly untrusted/external; design any authenticated ingestion without conferring native mission success, replay rights or event-producer authority. Current bounded inventory does not solve this larger commissioning gate. |
| S1 | P1 | Research data owner | Retrieve and preserve authoritative CMS/ACS/RIDOH extracts, field definitions/years/denominators and uncertainty; replace fabricated provider identities with registry-matched RI records; do not infer patient compliance from aggregate services. Until then, quarantine remains mandatory. |
| S2 | P1 | Qualified HBV clinician / research PI | Independently validate clinical rules, discordant history, vaccination/HBIG/immunosuppression contexts and UI wording; determine medical-device/policy scope before any clinical use. Passing code tests is not medical certification. |
| S3 | P2 | Repository operator | Approve permanent non-scratch destination and independent backup/remote; verify full Git history, dependencies and clean-checkout reproduction before moving/removing original. |
| O1 | P2 | Fleet acceptance owner | Live autonomous command succession, cancellation under real effects, restart recovery and true hosted telemetry remain unproven by this offline/local audit; commission only with fresh scoped approval and complete evidence. |

No engine is removed and no architectural winner is selected. The corrected candidate is suitable only for **local, restricted evidence inspection**, not the original claimed operational/policy deployment.

## Deliverables

`SCIENTIFIC-PROVENANCE-AUDIT.md` gives numerical/clinical detail. `FLEET-ORCHESTRATION-TRUTH.md` gives exact historical instructions, agent matrix, current integration blockers and custody recommendations. `ACCEPTANCE-EVIDENCE.json` binds targets, candidate commits, statuses, sources and artifact hashes. Reports and source fixes are on separate local branches; no remote push or deploy was performed.

## Evidence custody

Research-specific `acceptance/` paths resolve under `/Users/sadius/apamsa-ri-hepb-codex-acceptance`; Fleet-specific `acceptance/double-front/` paths resolve under `/Users/sadius/engineering-fleet-double-front`. See the per-repository evidence manifest for canonical paths and hashes. No copied record becomes native Fleet execution.
