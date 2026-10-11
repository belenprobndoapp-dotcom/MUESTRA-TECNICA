export interface FacialMorphology {
  faceShape: string;
  faceShapeDescription: string;
  proportionsAnalysis: string;
  keyFacialFeatures: string[];
  jawlineAndCheekbones: string;
}

export interface ColorimetryDiagnostic {
  skinUndertone: string; // Cálido, Frío, Neutro
  undertoneTemperature: string;
  undertoneExplanation: string;
  seasonalPalette: string;
  currentHairDetected: string;
  recommendedJewelryAndClothing?: string;
}

export interface RecommendedHairColor {
  commercialName: string;
  technicalFormula: string; // Ej: Base 7.31 (Rubio Medio Dorado Ceniza)
  baseLevel: string; // Ej: Altura 7 - Rubio Medio
  primaryReflect: string; // Ej: .3 Dorado
  secondaryReflect: string; // Ej: .1 Ceniza
  hexColor: string;
  accentHexColor?: string;
  applicationTechnique: string;
  developerVolume: string; // Ej: 20 volúmenes
  whyItSuits: string;
}

export interface ColorToAvoid {
  toneName: string;
  technicalFormulaAvoid?: string;
  hexColor: string;
  reasonToAvoid: string;
}

export interface RecommendedHaircut {
  cutName: string;
  recommendedLength: string;
  visagismHarmony: string;
  technicalCuttingTechnique: string; // Grados de elevación, tijera, navaja, etc.
  stylingTips: string;
}

export interface CelebrityReference {
  name: string;
  knownCountryOrRegion: string;
  similarityReason: string;
  lookDescription: string;
  cutAndColorMatch: string;
  imageUrl?: string;
}

export interface VisagismReport {
  id?: string;
  clientName: string;
  countryReference: string;
  analysisDate?: string;
  timestamp?: number;
  uploadedImages?: string[];
  morphology: FacialMorphology;
  colorimetry: ColorimetryDiagnostic;
  recommendedHairColors: RecommendedHairColor[];
  colorsToAvoid: ColorToAvoid[];
  recommendedHaircuts: RecommendedHaircut[];
  celebrityReferences: CelebrityReference[];
  salonExecutiveSummary: string;
}
