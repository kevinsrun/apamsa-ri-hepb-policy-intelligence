# Research claim matrix export feature

Implement `src/policy/export.mjs`, exporting `claimsToTsv(claims, options = {})`.
No dependencies, I/O, shell, network or side effects. Use pure JavaScript ESM.

Input is an array of claim objects. Default includes only `eligibleForBrief === true` records whose status is VERIFIED or VERIFIED WITH QUALIFICATIONS. With explicit boolean `includeHistory: true`, include audit records too, retaining their original status. Recognized statuses also include INCONSISTENT, UNVERIFIED and NOT REPRODUCIBLE. Reject duplicate IDs, malformed input, invalid statuses, invalid option types, nonfinite quantitative values, and non-HTTPS source URLs on eligible rows. Null values and absent fields become empty cells, never zero.

Output is TSV with exactly this header and order:
`id claim status value unit datasetYear population numerator denominator sourceUrl evidenceTimestamp limitations`
The separator is a literal tab. Every row has 12 columns. Finish with a newline. Preserve order; empty selection returns the header plus newline. Join limitation strings with `; `. Convert tabs/newlines in cell text to a single space. Neutralize spreadsheet formulas by prefixing an apostrophe when a text cell (including after leading whitespace) starts with `=`, `+`, `-` or `@`. Do not silently certify audit history. No model should decide which evidence is true; the structured status is a trusted input only after separate source verification.
