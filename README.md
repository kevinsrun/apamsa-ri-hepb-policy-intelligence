# Rhode Island Hepatitis B Policy Intelligence

Internal Brown APAMSA research workspace. Drafts are not approved for outreach, publication, clinical decisions or referrals. No deployment or automatic merge is authorized.

## Local application

Use Node.js 22 or newer: `npm run serve`, then open `http://127.0.0.1:3000/policy`. The historical reviewed prototype remains at `/`. The loopback-only server exposes an explicit public-file allowlist and processed data, never raw alleged identities or `.git`.

The policy application provides a searchable Evidence Explorer, qualified provider-city service comparisons, versioned legislation/history, a disputed-claim audit, organizational stakeholder directory, citation-bearing Markdown briefs, JSON downloads and a research work queue. Data years and unsupported claims remain explicit. It is a local prototype, not a commissioned public-health service.

## Reproduce and verify

Install the pinned offline builder dependency with `python3 -m pip install -r requirements-policy.txt` (openpyxl 3.1.5). Source-document inspection used pypdf 6.10.0; it is not required for the offline builder. No model is needed for reproduction.

- `python3 scripts/collect-policy-sources.py`: bounded, unauthenticated source capture; retains failures and immutable content-addressed bytes. Run only for an intentional refresh; this can change the evidence snapshot.
- `python3 scripts/build-policy-dataset.py`: offline hash verification and deterministic calculations from retained evidence.
- `npm test`: existing science and HTTP checks.
- `npm run test:policy`: claim lineage, source hashes, policy/brief exclusion and real API failure checks.
- `node scripts/policy-browser.mjs`: real Chromium interaction tests; use an existing Playwright installation via `APAMSA_PLAYWRIGHT_MODULE` if needed. Does not install browsers.
- `node scripts/run-export-confined.mjs`: macOS deny-default, read-only execution of the independently authored export contract, including the complete real claim registry.

`data/processed/policy-intelligence.json` is the clean research registry; `data/evidence/` contains original public source captures and retrieval manifests. `acceptance/scientific-claims.json` preserves disputed history. See [policy landscape](docs/dual-mandate/policy-landscape.md) and [preliminary options](docs/dual-mandate/policy-options.md).

## Fleet boundary

The controlling executable is pinned separately to Fleet `288af82e3c371f1f850448d6ffb459e18b9d7c92`; no generated research code can replace it. The operator authorized at most three routine subscription invocations (two routine, one recovery reserve), concurrency one, zero automatic retries and no paid fallback. The existing Codex profile requires explicit same-user-host-access acknowledgment; the operator separately authorized its tool-free use with time/output limits and an accounting token ceiling. Native hard token enforcement remains unverified. Do not describe source-only model work as an independent epidemiological audit. No protected model usage is permitted.

## Dual Mandate delivery

Open `/policy` after `npm run serve` for the seven-section research workspace. No hosting or outreach is enabled. `python3 -m pip install -r requirements-policy.txt` provides the offline builder dependency. Reproduce captured bytes with `python3 scripts/check-policy-reproduction.py`; refresh the generated registry with `python3 scripts/build-policy-dataset.py`. Source retrieval is separate and may fail; retained manifests and bytes remain the source of this build. Run `node scripts/export-policy.mjs` to regenerate the complete audit matrix, qualified-only matrix, citation brief, stakeholder directory and gaps memorandum in `docs/dual-mandate/`.

The exporter was genuinely generated through Fleet: original draft PR #2, a separately retained rejected task, then reserved recovery draft PR #6. Final model source commit: `3b6edc251920445558d9088175a5ceb16eeea373`. The delivered implementation passes the complete real-registry contract. Tests and data were independently authored, outside provider writable scope. The supervisor collected sources and implemented the platform; no autonomous research-collector or seven-agent topology is claimed.

Run `npm test`, `npm run test:policy`, and `node scripts/run-export-confined.mjs` on the commissioned macOS profile. The last command fails closed on unsupported OSes. GitHub's read-only Linux workflow instead runs the pure contract directly on an ephemeral runner without provider credentials; it does not claim native macOS confinement. Real Chromium checks use the already-installed Playwright module via `APAMSA_PLAYWRIGHT_MODULE`; run `node scripts/policy-browser.mjs`.

Three subscription calls used 42,819 reported tokens in total, including the rejected task. Cost is unmeasured, not asserted zero dollars. No further campaign inference is authorized. Two draft contributions were delivered automatically; no PR was merged. The separate failed/quota-suspended cases remain explicit. See campaign report and evidence manifest for ledger and witness limitations.
