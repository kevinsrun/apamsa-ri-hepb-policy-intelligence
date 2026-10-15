# APAMSA Rhode Island Hepatitis B Research & Policy Evidence Brief
**Project:** Hepatitis B Universal Adult Screening Evidence Platform for Rhode Island  
**Audience:** Gavin Li, APAMSA Rhode Island Research Collaborators, Health Policy Stakeholders  
**Date:** October 2026  
**Status:** **AUDITED — EMPIRICAL BENCHMARKS VERIFIED; PROTOTYPE CLAIMS SEGREGATED**  

---

## 1. Executive Summary

In March 2023, the Centers for Disease Control and Prevention (CDC) published landmark updated recommendations (*MMWR Recomm Rep 2023;72(No. RR-1):1–29*), establishing **universal hepatitis B screening for all adults aged 18 and older at least once in their lifetime** using the three-test **triple panel**:
1. **Hepatitis B surface antigen (HBsAg)** — identifies active (acute or chronic) infection.
2. **Hepatitis B surface antibody (anti-HBs)** — identifies immunity (vaccine-induced vs natural infection).
3. **Total antibody to hepatitis B core antigen (total anti-HBc)** — identifies prior resolved or ongoing exposure.

This brief synthesizes verified epidemiological evidence for Rhode Island from the CDC National Notifiable Diseases Surveillance System (NNDSS), U.S. Census Bureau ACS 5-year data, and Rhode Island Department of Health (RIDOH) regulations, while delineating the methodological requirements for future claims-based research.

---

## 2. Verified Epidemiological & Demographic Benchmarks

### A. Severe State Infection Burden (CDC Verified)
- **Top-Tier National Incidence:** According to the CDC's published Viral Hepatitis Surveillance Report (Table 2.3), Rhode Island reported **364 newly identified cases of chronic hepatitis B** in a single surveillance period, corresponding to a rate of **33.3 cases per 100,000 population**.
- **National Context:** Rhode Island's reported rate of chronic hepatitis B ranks among the highest in the entire United States, underscoring that viral hepatitis is a pressing, acute public health priority in the state.
- **Low Acute Baseline:** Acute hepatitis B incidence in Rhode Island remains low (~0.10 cases per 100,000), confirming that the overwhelming clinical burden is asymptomatic, undiagnosed **chronic infection** acquired perinatally or before migration.

### B. Geographic & Immigrant Demographics (U.S. Census Bureau ACS 5-Year Verified)
- **Urban Diaspora Concentration:** Providence County houses **660,741 residents (60.3% of the state)**, with a foreign-born population of **20.80% (137,450 residents)** and an Asian American population of **6.24% (41,250 residents)**.
- In contrast, Washington County reports 4.20% foreign-born and 2.60% Asian American; Kent County reports 5.82% foreign-born and 2.79% Asian American.
- **High-Risk Communities:** Diaspora populations in Providence, Pawtucket, and Central Falls originating from East Asia, Southeast Asia, West Africa, and parts of the Caribbean/Central America carry historical endemic hepatitis B exposures exceeding 2%–8% prevalence.

### C. Maternal & Perinatal Policy Framework (RIDOH Verified)
- Under **R.I. Code R. 14-040-002**, Rhode Island mandates universal prenatal screening for HBsAg, requiring reporting of any positive pregnant person to RIDOH within **4 working days**.
- RIDOH maintains a strict universal newborn birth-dose policy targeting administration of the hepatitis B vaccine to **100% of newborns within 24 hours of delivery**.

---

## 3. Methodological Boundaries: Evaluating Outpatient Claims

The research team developed a prototype ingestion pipeline modeling CMS Medicare Part B procedure claims (CPT 87340, 86706, 86704). An independent data audit established critical methodological boundaries that must govern any future claims research:

1. **Medicare Fee-For-Service (FFS) Selection Bias:**
   - Medicare Part B FFS covers primarily adults aged &ge;65 and disabled individuals.
   - However, the population carrying the highest burden of chronic hepatitis B comprises working-age foreign-born adults (aged 20–59), who are primarily covered by Medicaid (RIte Care), employer-sponsored commercial insurance, or are uninsured. Medicare FFS claims cannot represent the primary at-risk population in Rhode Island.
2. **Reference Laboratory Billing Channel Fragmentation:**
   - Outpatient clinicians routinely send phlebotomy specimens to independent commercial clinical laboratories (e.g., Quest Diagnostics, Labcorp, hospital outreach networks), which submit technical and global claims directly under laboratory NPIs.
   - **Crucial Rule:** Clinicians and community health centers **cannot** be labeled noncompliant based on the volume or absence of physician-level Part B CPT claims.
3. **Claims Line Items vs. True Triple-Panel Completion:**
   - Individual CPT procedure claims do not inherently prove whether a patient received all three components of the triple panel during a single screening event. Assessing true triple-panel concordance requires longitudinal all-payer claims (e.g., HealthFacts RI APCD) with unique de-identified patient linkage keys.

---

## 4. Policy & Implementation Recommendations for APAMSA & Health Systems

Based on verified clinical guidelines and Rhode Island health system structure:

1. **Electronic Health Record (EHR) Order Set Optimization (Lifespan & Care New England):**
   - The CDC 2023 universal adult recommendation requires ordering all three tests (HBsAg, anti-HBs, total anti-HBc).
   - In EPIC and other hospital EHRs, individual search for "HBsAg" often leads clinicians to order single-antigen tests, omitting anti-HBs (missing lack of vaccine immunity) and anti-HBc (missing past resolved infections at risk for reactivation).
   - **Recommendation:** Implement a single-click bundled order set in Lifespan and Care New England: `"Adult HBV Universal Triple Panel Screen (HBsAg + anti-HBs + total anti-HBc)"`.
2. **Support for Safety-Net Community Health Centers (FQHCs):**
   - Direct screening resources and culturally concordant education to Federally Qualified Health Centers serving Providence County—specifically Providence Community Health Centers (PCHC) and Blackstone Valley Community Health Care (BVCHC).
3. **Payer Alignment:**
   - Collaborate with the Rhode Island Office of the Health Insurance Commissioner (OHIC) and Medicaid to ensure zero-cost-sharing coverage for the complete three-test panel as an ACA preventive service.
