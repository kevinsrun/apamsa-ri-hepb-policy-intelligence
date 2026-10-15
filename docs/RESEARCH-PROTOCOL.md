# RESEARCH PROTOCOL — independent audit correction

**Status: REJECTED — REMEDIATION REQUIRED (original acceptance claims withdrawn).**

The original document is preserved in `acceptance/baseline/RESEARCH-PROTOCOL.md.txt` and Git history. It is historical claimed evidence, not certification.

Only the CDC 2022 Rhode Island newly reported chronic count **364** and rate **33.3/100,000** are independently source-verified here. These are historical notifications, not statewide prevalence or new-infection incidence.

All twelve alleged provider identities are withheld. Medicare counts are prototype fixtures. Demographics, perinatal percentages, lab billing shares, need scores and statewide prevalence are unsupported, unverified or unvalidated and must not guide clinical care, referrals or resource allocation. The active API/UI/export excludes them.

The educational serology engine requires clinical assessment and dated records; negative IgM, recent negative HBsAg and elevated ALT alone do not confirm chronicity. Concurrent antigen and antibody do not establish an escape mutation.

The prior 22 tests and 10 HTTP/string checks were reproduced, but the latter were not browser interactions. See `acceptance/logs/` for baseline, failed obsolete assertions and independent real-browser tests.

No verified five-agent Fleet-orchestrated research mission was found. Reported agent tokens/costs are not native Fleet accounting. No historical mission records were fabricated.

See `SCIENTIFIC-PROVENANCE-AUDIT.md`, `CODEX-INDEPENDENT-ACCEPTANCE.md`, `ACCEPTANCE-EVIDENCE.json` and `acceptance/scientific-claims.json` for current scope, sources, evidence and restrictions.

## Local verification

```sh
npm run pipeline
npm test
npm run test:browser
# Python with openpyxl:
python3 scripts/reproduce-scientific-claims.py
```

Browser runner requires installed Playwright and Chromium; set `APAMSA_PLAYWRIGHT_MODULE` to its module path outside this prototype if needed. No external package is downloaded automatically. Server binds only 127.0.0.1 and serves an explicit public-file allowlist. No deployment authorized.

## Repository custody

The scratch original is unchanged. This remediation is an isolated Git worktree retaining its complete local history. Permanent relocation requires an approved destination, remote/backup plan and dependency checks. Do not remove the scratch original.
