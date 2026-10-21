# Rhode Island hepatitis B — internal evidence draft

Draft for research review. Not approved for outreach, clinical use or publication.

- Published RI-provider 87340 services, 2023: **236 billed services** (VERIFIED WITH QUALIFICATIONS; data year 2023). [Primary source](https://data.cms.gov/data-api/v1/dataset/0e9f2f2b-7bf9-451a-912c-e02e654dd725/data?filter%5BRndrng_Prvdr_State_Abrvtn%5D=RI&filter%5BHCPCS_Cd%5D=87340&size=5000&offset=0)
  Population: 2023 published Original Medicare Part B FFS rendering-provider/HCPCS/place-of-service rows; provider state RI. Numerator: 236; denominator: unknown — not inferred.
  Limitation: Published Original Medicare FFS provider-service records; low-volume suppression applies.
  Limitation: RI is rendering-provider address, not beneficiary residence; out-of-state laboratory billing is excluded.
  Limitation: Services can repeat per person and do not identify completed triple panels, screening-only indications, prevalence, noncompliance or all-payer use.
  Limitation: Not the original extract behind the disputed prototype counts; no statewide patient screening denominator.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-21T02:30:13.069908+00:00.
- Published RI-provider 86704 services, 2023: **182 billed services** (VERIFIED WITH QUALIFICATIONS; data year 2023). [Primary source](https://data.cms.gov/data-api/v1/dataset/0e9f2f2b-7bf9-451a-912c-e02e654dd725/data?filter%5BRndrng_Prvdr_State_Abrvtn%5D=RI&filter%5BHCPCS_Cd%5D=86704&size=5000&offset=0)
  Population: 2023 published Original Medicare Part B FFS rendering-provider/HCPCS/place-of-service rows; provider state RI. Numerator: 182; denominator: unknown — not inferred.
  Limitation: Published Original Medicare FFS provider-service records; low-volume suppression applies.
  Limitation: RI is rendering-provider address, not beneficiary residence; out-of-state laboratory billing is excluded.
  Limitation: Services can repeat per person and do not identify completed triple panels, screening-only indications, prevalence, noncompliance or all-payer use.
  Limitation: Not the original extract behind the disputed prototype counts; no statewide patient screening denominator.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-21T02:30:13.537399+00:00.
- Published RI-provider 86706 services, 2023: **203 billed services** (VERIFIED WITH QUALIFICATIONS; data year 2023). [Primary source](https://data.cms.gov/data-api/v1/dataset/0e9f2f2b-7bf9-451a-912c-e02e654dd725/data?filter%5BRndrng_Prvdr_State_Abrvtn%5D=RI&filter%5BHCPCS_Cd%5D=86706&size=5000&offset=0)
  Population: 2023 published Original Medicare Part B FFS rendering-provider/HCPCS/place-of-service rows; provider state RI. Numerator: 203; denominator: unknown — not inferred.
  Limitation: Published Original Medicare FFS provider-service records; low-volume suppression applies.
  Limitation: RI is rendering-provider address, not beneficiary residence; out-of-state laboratory billing is excluded.
  Limitation: Services can repeat per person and do not identify completed triple panels, screening-only indications, prevalence, noncompliance or all-payer use.
  Limitation: Not the original extract behind the disputed prototype counts; no statewide patient screening denominator.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-21T02:30:14.075531+00:00.
- RI newly reported chronic hepatitis B cases, 2022: **364 reported confirmed cases** (VERIFIED WITH QUALIFICATIONS; data year 2022). [Primary source](https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html)
  Population: Rhode Island newly reported confirmed chronic HBV cases, 2022. Numerator: 364; denominator: unknown — not inferred.
  Limitation: Historical surveillance notifications; not total prevalence or newly acquired infections.
  Limitation: Exact population denominator is absent from the source table; never reverse-engineered from a rounded rate.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-15T13:11:13.330554+00:00.
- RI newly reported chronic hepatitis B rate, 2022: **33.3 per 100,000 population** (VERIFIED WITH QUALIFICATIONS; data year 2022). [Primary source](https://www.cdc.gov/hepatitis-surveillance-2022/hepatitis-b/table-2-5.html)
  Population: Rhode Island newly reported confirmed chronic HBV cases, 2022. Numerator: 364; denominator: unknown — not inferred.
  Limitation: Historical surveillance notifications; not total prevalence or newly acquired infections.
  Limitation: Exact population denominator is absent from the source table; never reverse-engineered from a rounded rate.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-15T13:11:13.330554+00:00.
- RI newly reported chronic hepatitis B cases, 2023: **216 reported confirmed cases** (VERIFIED WITH QUALIFICATIONS; data year 2023). [Primary source](https://www.cdc.gov/hepatitis-surveillance-2023/hepatitis-b/table-2-5.html)
  Population: Rhode Island newly reported confirmed chronic HBV cases, 2023. Numerator: 216; denominator: unknown — not inferred.
  Limitation: Not an original HTTP response capture; raw-byte re-extraction remains pending.
  Limitation: Notifications, not prevalence or incident acquisition. Exact rate denominator absent.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-21T02:37:21.547749+00:00.
- RI newly reported chronic hepatitis B rate, 2023: **19.7 per 100,000 population** (VERIFIED WITH QUALIFICATIONS; data year 2023). [Primary source](https://www.cdc.gov/hepatitis-surveillance-2023/hepatitis-b/table-2-5.html)
  Population: Rhode Island newly reported confirmed chronic HBV cases, 2023. Numerator: 216; denominator: unknown — not inferred.
  Limitation: Not an original HTTP response capture; raw-byte re-extraction remains pending.
  Limitation: Notifications, not prevalence or incident acquisition. Exact rate denominator absent.
  Reproduction: scripts/build-policy-dataset.py; evidence observed 2026-10-21T02:37:21.547749+00:00.

Unsupported disputed values, modeled county need scores and alleged provider identities are excluded. Coverage policies do not prove observed access.