# Research Protocol: Rhode Island Hepatitis B Screening Assessment
**Version:** 1.0.0  
**Authors:** APAMSA Research Team & Antigravity Acting Orchestrator  
**Repository:** `apamsa-ri-hepb`  

---

## 1. Research Objective
Assess the epidemiological alignment, geographic distribution, and measurement limitations of hepatitis B screening in Rhode Island following the CDC's 2023 MMWR recommendation shift from risk-targeted to universal adult triple-panel screening.

## 2. Ingestion & Transformation Protocol
1. **Demographic Indicators:** Extract 5-year Census Bureau American Community Survey (ACS) county indicators for all 5 Rhode Island counties (Bristol, Kent, Newport, Providence, Washington). Calculate proportion of Asian American residents, foreign-born residents, and uninsured individuals.
2. **Surveillance Benchmark:** Ingest Rhode Island Department of Health (RIDOH) viral hepatitis surveillance data for chronic hepatitis B cases by county and demographic group.
3. **Provider Directory:** Standardize National Provider Identifier (NPI) records from NPPES for Rhode Island primary care (Internal Medicine, Family Medicine) and specialist (Gastroenterology, Infectious Disease, OB/GYN) clinicians.
4. **Medicare Claims Extraction:** Ingest CMS Medicare Physician & Other Practitioners Part B aggregate procedure data for Rhode Island providers across HCPCS/CPT codes:
   - `87340`: HBsAg qualitative/semiquantitative
   - `86706`: Anti-HBs
   - `86704`: Total Anti-HBc
   - `86705`: Anti-HBc IgM
   - `G0499`: Hepatitis B screening, high risk adult

## 3. Analytical Protocol
1. **Discordance Ratio Calculation:**
   $$\text{Ratio}_{\text{anti-HBs}} = \frac{\sum \text{Services}(86706)}{\sum \text{Services}(87340)}$$
   $$\text{Ratio}_{\text{total anti-HBc}} = \frac{\sum \text{Services}(86704)}{\sum \text{Services}(87340)}$$
2. **County Need Score:**
   $$\text{Need Score} = (0.7 \times \% \text{Foreign-Born}) + (0.3 \times \% \text{Asian})$$
3. **Screening Rate per 10,000 Adults:**
   $$\text{Rate} = \left(\frac{\text{Total Recorded Services}}{\text{Adult Population}}\right) \times 10,000$$

## 4. Governance & Privacy Verification
- **HIPAA Compliance:** Aggregated administrative public data only. Zero individual patient identifiers (PHI) or protected health records are ingested.
- **Suppression Protection:** Preservation of CMS cell suppression ($\le 10$ services).
