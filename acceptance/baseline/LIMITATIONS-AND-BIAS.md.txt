# Methodological Limitations & Measurement Bias Analysis
**Project:** APAMSA Rhode Island Hepatitis B Screening Assessment  
**Author:** Antigravity & Independent Peer Review (`gemma3:4b`)  

---

## 1. The Denominator & Coverage Bias

### The Medicare Fee-For-Service (FFS) Selection Effect
Public Medicare Physician & Other Practitioners data only includes fee-for-service Part B beneficiaries. In Rhode Island:
- Approximately **54% of Medicare beneficiaries** are enrolled in Medicare Advantage (Part C) managed care plans, which are excluded from standard FFS procedure files.
- The median age of Medicare FFS beneficiaries is **71 years**.
- However, RIDOH surveillance data shows that **78.3% of reported chronic Hepatitis B infections occur in adults aged 20–59**.
- Therefore, Medicare FFS data fundamentally under-represents the primary working-age immigrant population carrying the greatest burden of chronic hepatitis B in Rhode Island.

### Payer Disparity (Commercial, Medicaid, Uninsured)
High-prevalence diaspora populations in Providence, Pawtucket, and Central Falls are frequently covered by:
1. **Medicaid (RIte Care / RI Medicaid):** Low-income families and pregnant individuals.
2. **Employer-sponsored commercial insurance:** Blue Cross Blue Shield of Rhode Island, UnitedHealthcare, Tufts Health Plan.
3. **Uninsured / Underinsured:** Undocumented immigrants or individuals in coverage waiting periods.
These populations access testing through Federally Qualified Health Centers (FQHCs) or safety-net hospital clinics whose testing volume does not appear in Medicare Part B data.

---

## 2. Laboratory Billing Channel Fragmentation

### Reference Lab Billing vs. Ordering Clinicians
In Rhode Island, outpatient clinicians typically collect venipuncture blood specimens and send them to commercial reference laboratories:
- **Quest Diagnostics** (Marlborough / regional testing center)
- **Labcorp** (Raritan / regional laboratory)
- **Lifespan Laboratories / Rhode Island Hospital Outreach**
- **Care New England Laboratories**

These reference laboratories submit claims directly using their own institutional NPIs. Consequently:
- A physician's Part B claim history may show **zero** laboratory procedure codes, even if the physician meticulously orders CDC-recommended screening for every adult patient.
- **Critical Policy Safeguard:** Clinicians and health centers CANNOT be judged noncompliant or substandard based on the absence of billed CPT 87340, 86706, or 86704 codes.

---

## 3. Claims Aggregation vs. Patient-Level Screenings

In aggregate billing data, CPT codes are reported as line items. While we observe a significant volume discrepancy (767 HBsAg vs 607 anti-HBc vs 593 anti-HBs), this aggregate ratio does not establish that 23% of screened patients received incomplete care. To prove patient-level failure, longitudinal de-identified all-payer claims data (such as Rhode Island's HealthFacts RI APCD) must be analyzed with unique patient linking identifiers.
