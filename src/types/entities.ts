export interface Plot {
  id: string;
  number: number;
  name?: string;
  area: number;
  plantingDate: string;
  lastHarvestDate?: string;
  status: 'active' | 'reform' | 'rotation' | 'new';
  coordinates?: {lat: number, lng: number}[];
  soilType?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cycle {
  id: string;
  description: string;
  categories: Category[];
}

export enum CategoryType {
  reform = 0,
  first_cut = 1,
  second_cut = 2,
  third_cut = 3,
  fourth_cut = 4,
  fifth_cut = 5,
  sixth_cut = 6,
  seventh_cut = 7,
  eighth_cut = 8,
  ninth_cut = 9,
  tenth_cut = 10
}

export interface Category {
  id: string;
  cycle: CategoryType;
  name: string;
  expectedProductivity: number;
  standardRevenue: number;
  standardCosts: number;
  plots: Plot[];
  soilPreparations: SoilPreparation[];
  parentCategoryId?: string;
}

export interface SoilPreparation {
  id: string;
  name: string;
  description?: string;
  actions: SoilPreparationAction[];
  totalCost: number;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface SoilPreparationAction {
  id: string;
  soilPreparationId: string;
  productId: string;
  dosage: number;
  dosageUnit: string;
  applicationMethod?: string;
  engineerReportBlob?: string;
  order: number;
}

// Enhanced Product interface following Brazilian agricultural standards (EMBRAPA/MAPA)
export interface Product {
  id: string;
  name: string;
  brand: string;
  
  // Basic classification
  category: 'inoculant' | 'fertilizer' | 'pesticide' | 'herbicide' | 'fungicide' | 'insecticide' | 'soil_corrector' | 'biostimulant' | 'adjuvant';
  type: 'biological' | 'chemical' | 'organic' | 'mineral';
  
  // Brazilian regulatory fields (MAPA - Ministério da Agricultura)
  registrationNumber?: string;  // Registro no MAPA
  mapaClassification?: string;  // Classificação MAPA
  activeIngredient?: string;
  concentration?: string;
  formulationType?: 'liquid' | 'solid' | 'powder' | 'granular' | 'emulsion' | 'suspension';
  
  // EMBRAPA Bioinsumo specific fields (for inoculants and biological products)
  activity?: 'producer' | 'retailer' | 'both';
  fertilizerType?: string;      // For fertilizer classification
  species?: string;             // Microorganism species for biological products
  guarantee?: string;           // UFC/ml, UFC/g, or other guarantee units
  physicalNature?: 'fluid' | 'solid';
  
  // Commercial information
  unitOfMeasure: string;        // kg, L, ml, g, etc.
  costPerUnit: number;
  packageSize?: number;         // Size of commercial package
  supplier?: string;
  manufacturer?: string;
  
  // Technical specifications
  applicationMethod?: string[];  // ['foliar', 'soil', 'seed_treatment']
  recommendedDosage?: {
    min: number;
    max: number;
    unit: string;               // kg/ha, L/ha, ml/100kg_seeds
  };
  targetCrops?: string[];       // ['sugar_cane', 'soy', 'corn']
  targetPests?: string[];       // For pesticides
  
  // Regulatory and safety
  toxicClass?: '1' | '2' | '3' | '4' | 'NT'; // Toxicological class (NT = Not Toxic)
  environmentalClass?: 'I' | 'II' | 'III' | 'IV'; // Environmental impact
  withdrawalPeriod?: number;    // Days (carência)
  reentryPeriod?: number;       // Hours (período de reentrada)
  
  // Additional info
  description?: string;
  technicalDataSheet?: string;  // URL or base64 of technical sheet
  safetyDataSheet?: string;     // FISPQ
  notes?: string;
  
  // Status and metadata
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryHistory {
  id: string;
  categoryId: string;
  configurationDate: string;
  plotIds: string[];
  soilPreparationIds: string[];
  changedBy: string;
  notes?: string;
}

export interface Production {
  id: string;
  plotId: string;
  cycle: number;
  harvestDate: string;
  tonnage: number;
  atr: number;
  revenue: number;
  costs: number;
  notes?: string;
  createdAt?: string;
}

export interface ATRPayment {
  id: string;
  productionId: string;
  atrValue: number;
  pricePerKgATR: number;
  grossValue: number;
  deductions: {
    inss?: number;
    aplacana?: number;
    other?: number;
  };
  netValue: number;
  paymentDate: string;
}

export interface SafraPlanning {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  previousRevenue: number;
  personalNeeds: number;
  availableBudget: number;
  plannedReforms: string[];
  status: 'planning' | 'active' | 'completed';
  createdAt?: string;
}

export interface CashFlow {
  id: string;
  safraId: string;
  month: string;
  revenue: number;
  expenses: number;
  balance: number;
  notes?: string;
}

export interface OptimizationResult {
  currentEfficiency: number;
  optimizedStructure: {
    plotId: string;
    recommendedSize: number;
    mergeCandidates: string[];
    priorityScore: number;
  }[];
  projectedSavings: number;
  implementationPlan: {
    phase: number;
    actions: string[];
    cost: number;
    expectedROI: number;
  }[];
}

export interface InputApplication {
  id: string;
  plotId: string;
  inputType: 'herbicide' | 'fertilizer' | 'pesticide' | 'fuel' | 'labor';
  product: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  applicationDate: string;
  dosagePerHectare: number;
  createdAt?: string;
}

export interface CostCategory {
  category: string;
  totalCost: number;
  costPerHectare: number;
  plots: string[];
}