/**
 * APAMSA Rhode Island Hepatitis B Research Platform
 * Clinical Evidence & CDC 2023 Screening Guidelines Knowledge Base
 *
 * Source: Conners EE, Panagiotakopoulos L, Hofmeister MG, et al.
 * "Screening and Testing for Hepatitis B Virus Infection: CDC Recommendations — United States, 2023."
 * MMWR Recomm Rep 2023;72(No. RR-1):1–29.
 * DOI: http://dx.doi.org/10.15585/mmwr.rr7201a1
 */

/**
 * @typedef {Object} ClinicalGuideline
 * @property {string} guidelineId
 * @property {string} source
 * @property {number} publicationYear
 * @property {'UNIVERSAL_ADULT' | 'PREGNANCY' | 'PERIODIC_RISK' | 'PEDIATRIC'} recommendationType
 * @property {string} targetPopulation
 * @property {string[]} recommendedTests
 * @property {string} rationale
 * @property {string} citation
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
 * @param {boolean} hbsAg
 * @param {boolean} antiHBs
 * @param {boolean} totalAntiHBc
 */
export function interpretTriplePanel(hbsAg, antiHBs, totalAntiHBc) {
  if (hbsAg && !antiHBs && totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Chronic Hepatitis B Infection",
      actionRequired:
        "Refer to specialist (hepatologist/gastroenterologist/infectious disease). Assess liver enzymes (ALT/AST), viral load (HBV DNA), and hepatic fibrosis. Screen household and sexual contacts.",
      immunityType: "CHRONIC_ACTIVE",
    };
  }

  if (!hbsAg && antiHBs && totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Resolved Past Hepatitis B Infection (Immune)",
      actionRequired:
        "No vaccination required. Immune from past infection. Note potential for viral reactivation during severe immunosuppression or B-cell depleting therapy (e.g. rituximab).",
      immunityType: "NATURAL",
    };
  }

  if (!hbsAg && antiHBs && !totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Vaccine-Induced Immunity",
      actionRequired: "Protected against hepatitis B. No further vaccination or screening needed.",
      immunityType: "VACCINE",
    };
  }

  if (!hbsAg && !antiHBs && !totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Susceptible (Non-Immune)",
      actionRequired:
        "Administer complete hepatitis B vaccine series (e.g., 2-dose Heplisav-B or 3-dose Engerix-B/Recombivax HB).",
      immunityType: "NONE",
    };
  }

  if (!hbsAg && !antiHBs && totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Isolated Anti-HBc (Uncertain / Distant Exposure)",
      actionRequired:
        "Possible interpretations: resolved distant infection with waning anti-HBs, false-positive anti-HBc, or occult HBV. Recommend repeat testing or assessing response to single vaccine booster.",
      immunityType: "ACUTE_OR_INDETERMINATE",
    };
  }

  if (hbsAg && !antiHBs && !totalAntiHBc) {
    return {
      hbsAg,
      antiHBs,
      totalAntiHBc,
      clinicalStatus: "Early Acute Hepatitis B Infection",
      actionRequired:
        "Early acute infection prior to core antibody seroconversion. Monitor clinical status and re-test serologies in 2-4 weeks.",
      immunityType: "ACUTE_OR_INDETERMINATE",
    };
  }

  return {
    hbsAg,
    antiHBs,
    totalAntiHBc,
    clinicalStatus: "Atypical Serologic Pattern",
    actionRequired: "Repeat serologic testing and consult infectious disease or liver specialist.",
    immunityType: "ACUTE_OR_INDETERMINATE",
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
