/**
 * APAMSA Rhode Island Hepatitis B Research Platform
 * Clinical Evidence & CDC 2023 Screening Guidelines Knowledge Base
 *
 * Source: Conners EE, Panagiotakopoulos L, Hofmeister MG, et al.
 * "Screening and Testing for Hepatitis B Virus Infection: CDC Recommendations — United States, 2023."
 * MMWR Recomm Rep 2023;72(No. RR-1):1–25.
 * DOI: http://dx.doi.org/10.15585/mmwr.rr7201a1
 */

export const CDC_2023_RECOMMENDATIONS = [
  {
    guidelineId: "CDC-HBV-2023-REC1",
    source: "CDC MMWR Recommendations and Reports",
    publicationYear: 2023,
    recommendationType: "UNIVERSAL_ADULT",
    targetPopulation: "All adults aged 18 years and older at least once in their lifetime",
    recommendedTests: ["HBsAg", "anti-HBs", "total anti-HBc"],
    rationale:
      "Universal adult screening replaces risk-based screening alone, which failed to identify up to 67% of chronic infections due to stigma, lack of disclosure, and asymptomatic disease progression. Initial triple-panel testing identifies active infection, resolved natural immunity, vaccine-induced immunity, and susceptibility.",
    citation:
      "Conners EE, et al. MMWR Recomm Rep 2023;72(No. RR-1):1–25.",
  },
  {
    guidelineId: "CDC-HBV-2023-REC2",
    source: "CDC MMWR Recommendations and Reports",
    publicationYear: 2023,
    recommendationType: "PREGNANCY",
    targetPopulation: "All pregnant persons during each pregnancy, preferably in the first trimester",
    recommendedTests: ["HBsAg"],
    rationale:
      "Universal screening during pregnancy prevents perinatal transmission through timely postexposure immunoprophylaxis (hepatitis B immune globulin and hepatitis B vaccine within 12 hours of birth) and maternal antiviral therapy when HBV DNA > 200,000 IU/mL.",
    citation:
      "Schillie S, et al. MMWR Recomm Rep 2018;67(No. RR-1):1–31.",
  },
  {
    guidelineId: "CDC-HBV-2023-REC3",
    source: "CDC MMWR Recommendations and Reports",
    publicationYear: 2023,
    recommendationType: "PERIODIC_RISK",
    targetPopulation:
      "Persons with ongoing risk factors regardless of age, tested periodically while risk persists",
    recommendedTests: ["HBsAg", "anti-HBs", "total anti-HBc"],
    rationale:
      "Periodic screening is indicated for persons on hemodialysis, persons who inject drugs (PWID), incarcerated persons, men who have sex with men (MSM), persons with HIV or HCV, and household/sexual contacts of persons with HBV.",
    citation:
      "Conners EE, et al. MMWR Recomm Rep 2023;72(No. RR-1):1–25.",
  },
];

/** Educational typical-pattern interpretation, not a diagnosis or surveillance case classifier.
 * CDC 2023 screening Table 1 and CDC surveillance Table 3-1 are distinct from
 * longitudinal confirmation. A single negative IgM, recent negative HBsAg, or ALT
 * elevation does not independently establish chronic infection.
 */
export function interpretTriplePanel(hbsAg, antiHBs, totalAntiHBc, options = {}) {
  if (![hbsAg,antiHBs,totalAntiHBc].every(v=>typeof v==='boolean') || !options || typeof options!=='object' || Array.isArray(options)) throw new TypeError('Three explicit boolean results and an options object are required');
  const bools=['igmAntiHBc','priorHbsAgNegativeWithin6Mo','hbsAgPersistentAtLeast6Months','knownPriorHbv','hbvDnaDetected','recentHepBVaccination','vaccinationSeriesComplete','recentHbig'];
  for (const key of Object.keys(options)) {
    if (bools.includes(key)) {if(typeof options[key]!=='boolean')throw new TypeError('Invalid optional result');}
    else if(key==='altMultipleUln'){if(!Number.isFinite(options[key]) || options[key]<0)throw new TypeError('Invalid ALT multiple');}
    else throw new TypeError('Unsupported clinical option');
  }
  const {igmAntiHBc,priorHbsAgNegativeWithin6Mo,hbsAgPersistentAtLeast6Months,knownPriorHbv,hbvDnaDetected,recentHbig,vaccinationSeriesComplete}=options;
  const result=(clinicalStatus,cdcCategory,actionRequired,immunityType='INDETERMINATE',reactivationRisk='UNKNOWN',diagnosticCertainty='NON_DEFINITIVE')=>({hbsAg,antiHBs,totalAntiHBc,clinicalStatus,cdcCategory,actionRequired,immunityType,reactivationRisk,diagnosticCertainty,
    clinicalUse:'Educational pattern only; confirm results and history with a clinician. Not an autonomous diagnosis or treatment recommendation.',
    sourceUrls:['https://www.cdc.gov/mmwr/volumes/72/rr/rr7201a1.htm','https://www.cdc.gov/hepatitis/php/surveillance-guidance/hepatitis-b.html']});
  if ((igmAntiHBc===true && !totalAntiHBc) || (hbsAgPersistentAtLeast6Months===true && (!hbsAg || priorHbsAgNegativeWithin6Mo===true))) return result('Discordant results or longitudinal history','DISCORDANT_HISTORY','Repeat/confirm laboratory results and reconcile dated records with a clinician; do not infer infection phase.');
  if (!hbsAg && igmAntiHBc===true && totalAntiHBc) return result('Possible resolving acute infection or reactivation','RESOLVING_ACUTE_POSSIBLE','Evaluate history, IgM, HBV DNA and repeat serology. An isolated core pattern can occur during the window period; IgM can also occur in reactivation.','INDETERMINATE','POTENTIAL_ACTIVE_INFECTION');
  if (!hbsAg && hbvDnaDetected===true) return result('HBV DNA detected with negative HBsAg (possible occult pattern)','DNA_POSITIVE_HBSAG_NEGATIVE','Confirm HBV DNA and assess infection phase, assay sensitivity and history with a clinician; this alone does not establish chronicity.','INDETERMINATE','POTENTIAL_ACTIVE_INFECTION');
  if (hbsAg && !antiHBs && totalAntiHBc) {
    if(hbsAgPersistentAtLeast6Months===true) return result('Chronic HBV infection supported by documented HBsAg persistence','CHRONIC_LONGITUDINAL','Documented HBsAg persistence for at least six months supports chronicity. Link to clinical care for HBV DNA, liver assessment and contact evaluation. IgM positivity may reflect a flare/reactivation.','ACTIVE_INFECTION','ACTIVE_INFECTION','LONGITUDINAL_EVIDENCE_REQUIRES_CLINICIAN_CONFIRMATION');
    if(igmAntiHBc===true || priorHbsAgNegativeWithin6Mo===true) return result('Pattern suggesting recent infection; acute versus reactivation requires assessment','ACUTE_POSSIBLE','IgM or recent seroconversion supports recent infection, not chronicity. Review prior HBV history, confirm results and assess symptoms/HBV DNA; IgM can be positive during chronic flares.','ACTIVE_INFECTION','ACTIVE_INFECTION');
    return result(igmAntiHBc===false?'Typical chronic serologic pattern; duration not established':'HBV infection pattern; acute/chronic phase undetermined',igmAntiHBc===false?'CHRONIC_PATTERN':'INFECTION_PHASE_UNDETERMINED','Link to clinical care. Negative IgM can support a typical chronic pattern but does not date infection. Confirm chronicity using longitudinal evidence such as HBsAg persistence for at least six months; ALT severity is not an infection-duration clock.','ACTIVE_INFECTION','ACTIVE_INFECTION');
  }
  if (!hbsAg && !antiHBs && !totalAntiHBc) return result('Susceptible pattern; consider vaccination history','SUSCEPTIBLE','Offer vaccination if susceptible per ACIP. A prior completed vaccine series with waning anti-HBs needs history-specific assessment, not automatic revaccination.','NONE_DETECTED','NONE_IDENTIFIED','TYPICAL_PATTERN');
  if (!hbsAg && antiHBs && !totalAntiHBc) return result(recentHbig?'Possible passive antibody after HBIG':'Vaccine-immunity pattern; check vaccine history','IMMUNE_VACCINE',vaccinationSeriesComplete?'Reassure if an appropriately documented complete series and compatible serology; assess special risk circumstances.':'Check vaccine series and recent HBIG history. Complete an incomplete series per ACIP; antibody positivity alone does not prove long-term protection after partial vaccination.','VACCINE_OR_PASSIVE','NONE_IDENTIFIED','TYPICAL_PATTERN');
  if (!hbsAg && antiHBs && totalAntiHBc) return result('Resolved past infection pattern','IMMUNE_NATURAL','Discuss reactivation risk, particularly before immunosuppressive treatment; further testing/monitoring is determined clinically. This pattern is not proof of sterilizing cure.','NATURAL','POTENTIAL_UNDER_IMMUNOSUPPRESSION','TYPICAL_PATTERN');
  if (!hbsAg && !antiHBs && totalAntiHBc) return result('Isolated Anti-HBc (Uncertain / Non-Definitive)','ISOLATED_CORE_NON_DEFINITIVE','Consider waning anti-HBs after past infection, false positive, occult infection, acute window period or assay-undetected variants. Review risk/immune status; repeat anti-HBc when a false positive is plausible, and assess HBV DNA particularly with immunosuppression. Vaccinate if shown susceptible; no blanket vaccine-challenge protocol is implied.','INDETERMINATE_ISOLATED_CORE','POTENTIAL_OCCULT_OR_REACTIVATION');
  if (hbsAg && !antiHBs && !totalAntiHBc) return result('Isolated HBsAg: early infection or transient/false-positive result','ISOLATED_HBSAG_NON_DEFINITIVE','Confirm HBsAg, review recent vaccination and assay interference, consider HBV DNA and repeat serology with clinical assessment. Do not automatically diagnose acute or chronic infection.','INDETERMINATE','POTENTIAL_ACTIVE_INFECTION');
  if (hbsAg && antiHBs && totalAntiHBc) return result('Concurrent HBsAg and anti-HBs (non-definitive)','CONCURRENT_MARKERS_NON_DEFINITIVE','Confirm results and assess HBV DNA/history. Coexisting antibody does not exclude infection. Variants or assay effects are possibilities, not a mutation diagnosis; sequencing is not automatically required.','INDETERMINATE','POTENTIAL_ACTIVE_INFECTION');
  return result('Atypical Serologic Pattern (Non-Definitive)','ATYPICAL_NON_DEFINITIVE','Repeat/confirm tests, review recent vaccination/HBIG and assay effects, assess HBV DNA and consult a clinician.');
}

export const HEPB_CODES = {
  "87340": {
    code: "87340",
    name: "HBsAg (Hepatitis B surface antigen)",
    shortDescription: "Hepatitis B surface Ag EIA",
    clinicalRole: "Active infection indicator (acute or chronic)",
    panel_component: "hbsag",
    is_triple_panel_component: true,
  },
  "86706": {
    code: "86706",
    name: "Anti-HBs (Hepatitis B surface antibody)",
    shortDescription: "Hepatitis B surface Ab",
    clinicalRole: "Immunity indicator (vaccine vs natural)",
    panel_component: "antihbs",
    is_triple_panel_component: true,
  },
  "86704": {
    code: "86704",
    name: "Total Anti-HBc (Hepatitis B core antibody)",
    shortDescription: "Hepatitis B core Ab total",
    clinicalRole: "Past or current infection exposure indicator",
    panel_component: "antihbc_total",
    is_triple_panel_component: true,
  },
  "86705": {
    code: "86705",
    name: "Anti-HBc IgM (Hepatitis B core antibody, IgM)",
    shortDescription: "Hepatitis B core Ab IgM",
    clinicalRole: "Recent infection marker; can also be positive during chronic flares",
    panel_component: "antihbc_igm",
    is_triple_panel_component: false,
  },
  "G0499": {
    code: "G0499",
    name: "Hepatitis B screening, high risk adult (Medicare)",
    shortDescription: "Hepatitis B screen high risk",
    clinicalRole: "Medicare preventive benefit code",
    panel_component: "medicare_screen",
    is_triple_panel_component: false,
  },
};

export const CLINICAL_RULES = {
  universalAdultAgeCutoff: 18,
  triplePanelCodes: ["87340", "86706", "86704"],
  caveats: [
    "Three billed procedure services in claims data DO NOT necessarily represent one complete triple-panel screening event for a single beneficiary.",
    "A provider with absent or low billing claims CANNOT be labeled noncompliant; laboratory services are frequently billed by independent clinical laboratories rather than ordering clinicians.",
    "Medicare Fee-For-Service (FFS) data primarily captures beneficiaries aged 65+ and younger disabled individuals; it cannot be extrapolated to commercial, Medicaid, or uninsured Rhode Island populations.",
    "CMS public-use files suppress some low-count beneficiary cells; confirm the specific file documentation before applying a threshold.",
    "CDC 2023 recommendations recommend universal triple-panel screening once in a lifetime, but commercial payer adoption, Medicare national coverage determinations, and clinical order sets experience transition lags."
  ],
};
