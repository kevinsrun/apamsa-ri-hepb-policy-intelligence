# Rhode Island hepatitis B policy landscape — internal research draft

Evidence reviewed October 20–21, 2026. This is a bounded source review, not an exhaustive legal opinion, clinical protocol or publication-ready advocacy product. Every numeric research record is in `data/processed/policy-intelligence.json`; original disputed claims remain in `acceptance/scientific-claims.json`. Reproduce with `scripts/build-policy-dataset.py` after verifying captured hashes.

## Burden and disparities

The retained [CDC 2022 Table 2.5](https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html) gives Rhode Island 364 newly reported confirmed chronic cases and 33.3 per 100,000. These are notifications, not total prevalence or new acquisition. The exact population denominator is absent. The [2023 table](https://www.cdc.gov/hepatitis-surveillance-2023/hepatitis-b/table-2-5.html) was independently observed through the web tool: 216 and 19.7, respectively. Direct raw retrieval returned 403, so that observation is separately qualified and is not presented as an original downloaded dataset. Annual notification differences cannot establish a change in true prevalence or screening performance.

The 78.3% foreign-born/age claim lacks its case numerator, joint population definition and denominator. Census API captures for 2024 ACS profiles are HTML Missing Key responses, despite HTTP 200. No county demographic rate or need ranking is certified. AAPI health equity is a research priority, not permission to treat race or migration background as an individual diagnosis. Demographic categories overlap and do not establish HBV status.

## Screening, prevention and perinatal programs

The [CDC 2023 screening recommendation](https://www.cdc.gov/mmwr/volumes/72/rr/rr7201a1.htm) supports initial adult triple-panel screening. Guideline recommendations and observed implementation are distinct. The [RIDOH perinatal program](https://health.ri.gov/immunization/ridoh-programs/perinatal-hepatitis-prevention-program) describes screening referral and case management for affected pregnant people/new mothers. Program existence does not verify 98.4% screening coverage; the eligible pregnancy cohort remains unavailable. Clinical vaccination and treatment protocols require current clinician review before use. No new clinical decision logic is implemented here.

## Medicare and access

Official [2023 CMS provider/service data](https://data.cms.gov/data-api/v1/dataset/0e9f2f2b-7bf9-451a-912c-e02e654dd725/data-viewer), filtered to rendering-provider state RI, yield published `Tot_Srvcs` sums of 236 (87340), 182 (86704) and 203 (86706). The original 767/607/593 are reproduced only in the retained prototype fixture; no authentic original extract supports them. The new sums do not prove that another geography/dataset would have the same values. Low-volume suppression, repeat services, diagnostic/monitoring indications and out-of-state laboratories prevent conversion to unique patient screening coverage. Clinical Laboratory specialty cannot establish the disputed 68.4% reference-laboratory market share.

[Medicare NCD 210.6](https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?ncdid=369) describes coverage criteria; a coverage policy is not observed uptake, a blanket guarantee for every patient, or evidence that universal guideline screening is reimbursed in every circumstance. The [RI Medicaid adult eligibility page](https://eohhs.ri.gov/consumer/adults/medicaid-adults), [state plan/waiver index](https://eohhs.ri.gov/reference-center/medicaid-state-plan-and-1115-waiver) and [current non-citizen coverage notice](https://staycovered.ri.gov/updates-news/medicaid-updates/changes-medicaid-eligibility-non-citizens) identify policy materials requiring close implementation review. The latter describes changes effective October 1, 2026. This platform does not determine individual eligibility or quantify HBV-specific coverage losses. Obtain current eligibility/navigation advice from the responsible agencies.

## Rhode Island law and legislative history

The official registry identifies [216-RICR-40-10-15](https://rules.sos.ri.gov/Regulations/part/216-40-10-15) as active, effective January 4, 2022. Its occupational bloodborne-pathogen provisions include hepatitis B vaccination. The `reg_id=9705` version is inactive, ending on that date. This occupational rule does not establish universal patient screening.

[R.I. Gen. Laws §23-28.36-1](https://webserver.rilegislature.gov/Statutes/TITLE23/23-28.36/23-28.36-1.htm) explicitly includes HBV among first-responder exposure concerns; operative provisions must be reviewed before interpreting duties. [§23-11-19](https://webserver.rilegislature.gov/Statutes/TITLE23/23-11/23-11-19.HTM) provides for needle/syringe exchange with viral-hepatitis education/referral. No measured program effect is inferred.

[2025 S0751](https://webserver.rilegislature.gov/Billtext25/SenateText25/S0751.pdf) is an introduced proposal concerning occupational exposure notification. Its header identifies Bissaillon and co-sponsors, March 7 introduction and Senate Labor & Gaming referral. Final disposition is UNVERIFIED; the status endpoint tried returned 404. It is not assumed active or enacted in 2026. [2005 H6472](https://webserver.rilegislature.gov/BillText05/HouseText05/H6472.pdf) is a historical awareness-month resolution, with a read-and-passed header. It creates no present screening requirement; its old medical assertions are not current evidence. No comprehensive finding of the absence of other HBV legislation is claimed.

## Geographic limits and research priorities

The platform compares three municipalities only as rendering-provider billing locations. It does not allocate disease cases to those cities. County HBV burden, language access, linkage to care, treatment retention and screening denominators remain gaps. Providence and Washington County scores remain unvalidated proxy arithmetic and are excluded from briefs and resource-allocation recommendations.

The public organizational directory lists RIDOH, its perinatal program, Brown medical-school Student Affairs, RIHCA and the Hepatitis B Foundation. These are research contacts, not verified referral capacity or endorsements. No outreach occurred.
