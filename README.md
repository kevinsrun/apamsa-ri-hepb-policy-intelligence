# Rhode Island Hepatitis B Policy Intelligence

Internal Brown APAMSA research workspace. Drafts are not approved for outreach, publication, clinical decisions or referrals. No deployment or automatic merge is authorized.

## Local application

Use Node.js 22 or newer: `npm run serve`, then open `http://127.0.0.1:3000/policy`. The historical reviewed prototype remains at `/`. The loopback-only server exposes an explicit public-file allowlist and processed data, never raw alleged identities or `.git`.

The policy application provides a searchable Evidence Explorer, qualified provider-city service comparisons, versioned legislation/history, a disputed-claim audit, organizational stakeholder directory, citation-bearing Markdown briefs, JSON downloads and a research work queue. Data years and unsupported claims remain explicit. It is a local prototype, not a commissioned public-health service.

## Reproduce and verify

Install Python `openpyxl` and `pypdf` in a separate environment; the captured environment used openpyxl 3.1.5 and pypdf (version recorded in campaign evidence). No model is needed for reproduction.

- `python3 scripts/collect-policy-sources.py`: bounded, unauthenticated source capture; retains failures and immutable content-addressed bytes. Run only for an intentional refresh; this can change the evidence snapshot.
- `python3 scripts/build-policy-dataset.py`: offline hash verification and deterministic calculations from retained evidence.
- `npm test`: existing science and HTTP checks.
- `npm run test:policy`: claim lineage, source hashes, policy/brief exclusion and real API failure checks.
- `node scripts/policy-browser.mjs`: real Chromium interaction tests; use an existing Playwright installation via `APAMSA_PLAYWRIGHT_MODULE` if needed. Does not install browsers.
- `node scripts/run-export-confined.mjs`: macOS deny-default, read-only execution of the pending feature acceptance contract for the separately scoped Fleet export task. It fails until the new module is delivered; the baseline on this development branch is explicitly experimental.

`data/processed/policy-intelligence.json` is the clean research registry; `data/evidence/` contains original public source captures and retrieval manifests. `acceptance/scientific-claims.json` preserves disputed history. See [policy landscape](docs/dual-mandate/policy-landscape.md) and [preliminary options](docs/dual-mandate/policy-options.md).

## Fleet boundary

The controlling executable is pinned separately to Fleet `288af82e3c371f1f850448d6ffb459e18b9d7c92`; no generated research code can replace it. The operator authorized at most three routine subscription invocations (two routine, one recovery reserve), concurrency one, zero automatic retries and no paid fallback. The existing Codex profile requires explicit same-user-host-access acknowledgment; the operator separately authorized its tool-free use with time/output limits and an accounting token ceiling. Native hard token enforcement remains unverified. Do not describe source-only model work as an independent epidemiological audit. No protected model usage is permitted.
