# Scientific provenance audit — independent acceptance

**Verdict: REJECTED — REMEDIATION REQUIRED for policy/clinical use.**

Original research commit: `434b1f9835897b67f9f69d7e8b77a35648170788`.
Remediation source/test commit: `04cc0d5233527b258309cc5e836d988456cdda90`.
Research branch: `codex/scientific-forensic-acceptance`; original scratch repository preserved, no remote configured.

## Quantitative reproduction

The machine-readable audit `acceptance/scientific-claims.json` contains **29 individual claim/identity records**. Each includes original URL (or explicit null when absent), publication year, dataset year, table, field, unit, numerator/denominator, filters, formula, reproduced result and classification. Null is unknown, not zero. Raw bytes, source retrieval timestamps, HTTP metadata and SHA-256 hashes are preserved in `acceptance/raw/`. A retrieval success or plausible fixture value is not factual verification.

| Claim | Independent result | Classification / consequence |
|---|---|---|
| 767 HBsAg / 607 total anti-HBc / 593 anti-HBs | Reproduced by summing `line_srvc_cnt` for 87340/86704/86706 in the local RI 2023 fixture. | **PROTOTYPE**; no original CMS extraction/publication. Not observed utilization. |
| Panel ratios | 593/767 ≈77.31%; 607/767 ≈79.14%. Baseline analytics instead asserted 86.8%/77.2%. | **DERIVED from prototype only**. Cannot identify completed patient panels, clinical practice inertia or individual compliance. Active analysis withdrawn. |
| 78.3% foreign-born/age share | No original RIDOH source, eligible case denominator or extraction found. | **UNVERIFIED**, quarantined. |
| 68.4% reference-lab share / complement 31.6% | No observed laboratory/office billing denominator. | **UNVERIFIED heuristic**, quarantined. |
| 138 chronic cases | No original 2023 RIDOH row or reconciled case definition found. | **UNVERIFIED**; a different year's 364 is not evidence that 138 is false. |
| 98.4% perinatal screening | No eligible pregnancy cohort or screened numerator found. | **UNVERIFIED**, quarantined. |
| 364 newly reported chronic cases; 33.3/100,000 | Actual CDC XLSX `Tab2.5`: B42 Rhode Island; C42 364; D42 33.3. | **VERIFIED**, dataset 2022; page dated October 21, 2024. Notifications, not total prevalence or newly acquired infections. Exact rate population denominator is not supplied in this table; do not reverse-engineer it from a rounded rate. |
| Acute rate 0.10 | Chronic Table 2.5 does not verify this acute statistic. | **UNVERIFIED**, active value null. |
| Providence foreign-born 137,408 | Local fixture actually says **137,450**. | **CONTRADICTED by fixture**; authoritative population truth remains unverified. |
| State foreign-born 162,114 | Five local fixture rows sum to **162,155**. | **CONTRADICTED by fixture**; authoritative population truth remains unverified. |
| Providence concentration 84.76% | Claimed inputs: 84.760107%; fixture inputs: 84.764577%. Both round to 84.76%. | **DERIVED** arithmetic only. Agreement to two decimals does not validate inputs. |
| Five-county population 1,095,605 | Local fixture sum reproduced. | **DERIVED**, not Census-verified. |
| Prevalence 3,000–8,000+ | No model, primary estimate, uncertainty analysis or population denominator found. | **UNVERIFIED estimate**, not inferred from annual notifications. |
| Providence/Washington need scores | `0.7*20.80+0.3*6.24 = 16.432 →16.43`; `0.7*4.20+0.3*2.60=3.72`. | **ESTIMATED/unvalidated proxy**; arbitrary weights, overlapping demographic categories, unverified inputs. No clinical/equity validation or resource-allocation use. |
| County cases 301/29/16/13/5 | Modeled distribution, not observed county surveillance. | **ESTIMATED/unvalidated**, withheld. |

### Census source failure is preserved, not filled with assumptions

Public requests to the [2022 ACS profile API](https://api.census.gov/data/2022/acs/acs5/profile.html) redirected to an HTML **Missing Key** page despite HTTP 200. Three preserved `.json`-named files therefore contain HTML, not Census datasets. Retrieval manifest marks `datasetParsed:false`. We did not obtain private API keys or promote fixture matches. DP02/DP05 are claimed source families, not authenticated original field-to-value lineage. A data owner must supply/retrieve documented official extracts, correct year/field identifiers and margins of error before any demographic result is released.

### Provider identities — none validated as alleged

Nine NPIs fail the [CMS NPI check-digit specification](https://www.cms.gov/Regulations-and-Guidance/Administrative-Simplification/NationalProvIdentStand/Downloads/NPIcheckdigit.pdf), using the Luhn checksum with the `80840` prefix (raw specification and retrieval metadata preserved):
`1427189021`, `1538290132`, `1750412354`, `1861523465`, `1972634576`, `1083745687`, `1194856798`, `1316078910`, `1427189032`.

The remaining three were queried against the primary NPPES API on October 15, 2026:

- [1649301243](https://npiregistry.cms.hhs.gov/api/?number=1649301243&version=2.1): no result; alleged identity **UNVERIFIED**, not proof of nonexistence.
- [1205967809](https://npiregistry.cms.hhs.gov/api/?number=1205967809&version=2.1): **OZARK VALLEYS COMMUNITY SERVICES, INC.**, Missouri organization, not alleged RI Dr. Robert Sullivan: **CONTRADICTED**.
- [1538290143](https://npiregistry.cms.hhs.gov/api/?number=1538290143&version=2.1): **CHARLES SMITH**, D.C., Hawaii, not alleged RI Brian Walsh: **CONTRADICTED**.

Ten digits and a valid checksum do not verify name, specialty, RI practice location, payer acceptance or referral suitability. All twelve identities and their associated claims are excluded from active provider search and downloaded reviewed data. Originals remain in explicitly quarantined historical/raw records for audit.

## Clinical engine review

Primary sources independently read and preserved:

1. [CDC 2023 screening recommendations](https://www.cdc.gov/mmwr/volumes/72/rr/rr7201a1.htm), March 10, 2023; **72(1):1–25**, not 1–29.
2. [CDC surveillance guidance, laboratory interpretation](https://www.cdc.gov/hepatitis/php/surveillance-guidance/hepatitis-b.html), especially Table 3-1. Surveillance classification is distinct from a clinical duration diagnosis.
3. [CDC 2022 chronic surveillance Table 2.5](https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html), and its [actual XLSX](https://www.cdc.gov/hepatitis-surveillance-2022/media/files/xlsx/table-2.5.xlsx).

Order below is HBsAg / anti-HBs / total anti-HBc. The browser imports the backend module; no duplicated clinical decision tree remains.

| Pattern | Restricted educational interpretation |
|---|---|
| −/−/− | Susceptible pattern; account for previously completed vaccination and waning antibody rather than automatically revaccinating. |
| −/+/− | Vaccine-immunity pattern; complete-series history and recent HBIG/passive antibody matter. |
| −/+/+ | Resolved past infection pattern; reactivation can occur with immunosuppression, not sterilizing cure. |
| +/−/+ | Active infection pattern; without IgM/history, phase undetermined. Negative IgM supports a typical chronic pattern, **not independent longitudinal proof**. |
| −/−/+ | Isolated core differential: past infection with waning antibody, false-positive result, window period, occult infection or assay-undetected variants. Risk/history, repeat testing and DNA assessment as clinically appropriate; no blanket one-dose vaccine challenge. |
| +/−/− | Isolated antigen: early infection, transient post-vaccination antigen or false-positive/assay issue; confirm, do not automatically diagnose acute disease. |
| +/+/+ | Concurrent markers do not prove an escape mutant or require automatic sequencing. Confirm results/DNA/history; antibody does not exclude infection. |
| +/+/− | Atypical; confirm/repeat and assess assay/vaccination/HBIG/history rather than assign a definitive disease phase. |

**Acute/chronic regression findings:** recent documented negative HBsAg followed by positivity suggests recent seroconversion, not chronicity. ALT >10× ULN describes severity, not duration. IgM positivity can occur in acute infection **or chronic flare/reactivation**. Documented HBsAg persistence ≥6 months supports clinical chronicity, subject to clinician confirmation; contradictory dated records are flagged. IgM-positive HBsAg-negative resolving/window patterns and DNA-positive HBsAg-negative patterns are separately handled.

These code changes were checked against primary guidance and independently exercised in a browser; they are **not a qualified clinical validation or permission to deploy clinical decision support**. A clinician must review before clinical/policy use.

## Software reproduction and remediation

- Baseline 22 Node assertions passed with scientific assertions unchanged; only base-URL injection and explicit loopback server routing were adapted for isolation. Baseline 10 “browser” assertions also passed, but were HTTP fetches/string matching/raw-array filtering, not browser interactions. A separate historical Antigravity subagent did perform CDP inspection; that does not transform this script into a browser test or validate science.
- After correcting clinical logic, **9 obsolete baseline clinical assertions failed, 13 passed**. Failure log preserved; not hidden by relabeling the run.
- Candidate: **38 Node tests +10 accurately labeled HTTP/API checks**, all pass; **33 real Chromium assertions**, all pass, including all six tabs, all eight patterns, acute/chronic edge cases, actual API-to-UI values, actual JSON download equality, unsupported provider exclusion, historical-age warnings, real backend-file loss/503, cleared stale display/disabled export, restoration/retry and mobile overflow.
- One browser missing-source-metadata response was a controlled regression. Other browser tests used the real owned loopback backend. A fresh source extraction is not implied by an API reload or newly generated timestamp.
- API/pipeline no longer supplies plausible defaults for missing data, labels provider shape as registry verification, exposes prototype rows as observed claims, or manufactures county surveillance. Active JSON includes only the two independently extracted historical CDC metrics, warnings and quarantine metadata.
- Replaced hardcoded scientific views with a smaller reviewed API-bound view while retaining six tabs and shared serology; unsafe charts/referral tables were removed rather than cosmetically rebadged. Export now actually downloads reviewed JSON.
- Local server binds **127.0.0.1**, permits GET/HEAD only and serves an explicit allowlist. `.git`, raw alleged provider data, package files and traversal requests return 404. No shared listener was stopped or restarted.

### Reproduction

From the research worktree with Node 22.23.3 (also tested with local Node 26):

```sh
npm run pipeline
npm test
npm run test:browser
python3 scripts/reproduce-scientific-claims.py  # Python with openpyxl
```

Playwright is already installed locally; set `APAMSA_PLAYWRIGHT_MODULE` to its module path on another machine. No browser/package installation, cloud write or model inference is automatic. Raw-fetch reproduction requires the documented primary URLs and may require an operator-owned Census API key; unavailable sources remain quarantined.

Evidence: `acceptance/logs/`, `acceptance/raw/`, `acceptance/screenshots/`, `acceptance/reviewed-export.json`, `acceptance/scientific-claims.json`, and `ACCEPTANCE-EVIDENCE.json`.

## Evidence custody

Research-specific `acceptance/` paths resolve under `/Users/sadius/apamsa-ri-hepb-codex-acceptance`; Fleet-specific `acceptance/double-front/` paths resolve under `/Users/sadius/engineering-fleet-double-front`. See the per-repository evidence manifest for canonical paths and hashes. No copied record becomes native Fleet execution.

The XLSX capture timestamp is approximate local file mtime following download, explicitly identified in `cdc2022-extraction.json`; it is not a signed retrieval receipt. Other primary-source retrieval records preserve HTTP/source timestamp metadata where returned.
