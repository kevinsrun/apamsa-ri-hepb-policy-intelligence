/**
 * APAMSA Rhode Island Hepatitis B Research Platform
 * Clinical Evidence & CDC 2023 Screening Guidelines Knowledge Base
 *
 * Source: Conners EE, Panagiotakopoulos L, Hofmeister MG, et al.
 * "Screening and Testing for Hepatitis B Virus Infection: CDC Recommendations — United States, 2023."
 * MMWR Recomm Rep 2023;72(No. RR-1):1–29.
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
      "Conners EE, et al. MMWR Recomm Rep 2023;72(No. RR-1):1–29.",
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
      "Conners EE, et al. MMWR Recomm Rep 2023;72(No. RR-1):1–29.",
  },
];

/**
 * Evaluates a triple-panel serology combination according to CDC/AASLD diagnostic criteria
 * Including all 8 permutations: susceptible, vaccine immune, natural immune, chronic active,
 * isolated anti-HBc (window / occult / waning), early acute, coexisting escape mutant, and atypical.
 *
 * @param {boolean} hbsAg - Hepatitis B surface antigen
 * @param {boolean} antiHBs - Hepatitis B surface antibody
 * @param {boolean} totalAntiHBc - Total antibody to Hepatitis B core antigen
 * @param {object} [options]
 * @param {boolean} [options.igmAntiHBc] - Optional IgM anti-HBc status
 */
export function interpretTriplePanel(hbsAg, antiHBs, totalAntiHBc, options = {}) {
  const { igmAntiHBc } = options;

  // 1. Susceptible (Non-Immune)
  if (!hbsAg && !antiHBs && !totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Susceptible (Non-Immune)",
      actionRequired:
        "Administer complete hepatitis B vaccine series (e.g., 2-dose Heplisav-B or 3-dose Engerix-B/Recombivax HB). No post-vaccination testing needed unless high risk.",
      immunityType: "NONE",
      reactivationRisk: "NONE",
      cdcCategory: "SUSCEPTIBLE"
    };
  }

  // 2. Vaccine-Induced Immunity
  if (!hbsAg && antiHBs && !totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Vaccine-Induced Immunity",
      actionRequired: "Protected against hepatitis B. No further vaccination or routine screening needed.",
      immunityType: "VACCINE",
      reactivationRisk: "NONE",
      cdcCategory: "IMMUNE_VACCINE"
    };
  }

  // 3. Resolved Natural Infection (Immune)
  if (!hbsAg && antiHBs && totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Resolved Past Hepatitis B Infection (Immune)",
      actionRequired:
        "No vaccination required. Naturally immune from resolved past infection. NOTE: Intracellular cccDNA persists; patient carries potential risk for HBV reactivation if undergoing severe immunosuppression, chemotherapy, anti-CD20 therapy (e.g., rituximab), or organ transplantation. Baseline ALT/HBV DNA monitoring recommended prior to immunosuppressive regimens.",
      immunityType: "NATURAL",
      reactivationRisk: "MODERATE_UNDER_SEVERE_IMMUNOSUPPRESSION",
      cdcCategory: "IMMUNE_NATURAL"
    };
  }

  // 4. Chronic Active Hepatitis B Infection
  if (hbsAg && !antiHBs && totalAntiHBc) {
    const isAcute = igmAntiHBc === true;
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: isAcute ? "Acute Hepatitis B Infection" : "Chronic Hepatitis B Infection",
      actionRequired:
        "Immediate referral to gastroenterologist, hepatologist, or infectious disease specialist. Order quantitative HBV DNA viral load, comprehensive hepatic metabolic panel (ALT/AST), and assess for hepatic fibrosis/cirrhosis (transient elastography/FIB-4). Screen household, sexual, and needle-sharing contacts. Advise abstinence from alcohol.",
      immunityType: "CHRONIC_ACTIVE",
      reactivationRisk: "ACTIVE_INFECTION",
      cdcCategory: isAcute ? "ACUTE_INFECTION" : "CHRONIC_INFECTION"
    };
  }

  // 5. Isolated Anti-HBc (Uncertain / Distant Exposure)
  if (!hbsAg && !antiHBs && totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Isolated Anti-HBc (Uncertain / Distant Exposure)",
      actionRequired:
        "Evaluate 4 differential diagnostic possibilities: (1) Resolved distant HBV infection with waning, undetectable anti-HBs titers (most frequent); (2) False-positive anti-HBc test; (3) Occult chronic HBV infection with low-level replication below HBsAg detection threshold; (4) Resolving acute HBV during the 'window period'. In asymptomatic non-immunosuppressed adults: administer 1 dose of hepatitis B vaccine and retest anti-HBs at 4-8 weeks. If anamnestic rise (>=10 mIU/mL), consider immune; if no response, complete full vaccine series.",
      immunityType: "ACUTE_OR_INDETERMINATE",
      reactivationRisk: "POTENTIAL_OCCULT_OR_REACTIVATION",
      cdcCategory: "ISOLATED_CORE"
    };
  }

  // 6. Early Acute Infection (Pre-core Seroconversion)
  if (hbsAg && !antiHBs && !totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Early Acute Hepatitis B Infection",
      actionRequired:
        "Early acute infection prior to core antibody seroconversion, or rare immune evasion / immunodeficiency. Monitor clinical status for acute liver failure and repeat full serologic panel in 2-4 weeks.",
      immunityType: "ACUTE_OR_INDETERMINATE",
      reactivationRisk: "ACTIVE_ACUTE",
      cdcCategory: "EARLY_ACUTE"
    };
  }

  // 7. Coexisting HBsAg and Anti-HBs
  if (hbsAg && antiHBs && totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Concurrent HBsAg and Anti-HBs (Escape Mutant / Seroconversion)",
      actionRequired:
        "Observed in 10-15% of chronic HBV patients, representing emergence of immune escape mutants (e.g. 'a' determinant s-gene mutations) or an active seroconversion transition. Anti-HBs fails to neutralize circulating mutant virions. Patient remains potentially infectious. Refer to hepatology for HBV DNA quantitation and S-gene sequencing.",
      immunityType: "CHRONIC_ACTIVE",
      reactivationRisk: "ACTIVE_INFECTION",
      cdcCategory: "ESCAPE_MUTANT_OR_TRANSITIONAL"
    };
  }

  // 8. Atypical: HBsAg(+) and Anti-HBs(+) with Anti-HBc(-)
  return {
    hbsAg,
    antiHBs,
    totalAntiHBc,
    clinicalStatus: "Atypical Serologic Pattern",
    actionRequired: "Biologically unexpected combination. Repeat testing with a different validated assay and consult viral hepatitis expert.",
    immunityType: "ACUTE_OR_INDETERMINATE",
    reactivationRisk: "UNKNOWN",
    cdcCategory: "ATYPICAL"
  };
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
    clinicalRole: "Acute infection indicator",
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
    "CMS suppresses data cells with <= 10 services to protect patient privacy.",
    "CDC 2023 recommendations recommend universal triple-panel screening once in a lifetime, but commercial payer adoption, Medicare national coverage determinations, and clinical order sets experience transition lags."
  ],
};
