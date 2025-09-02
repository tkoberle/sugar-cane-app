export interface Plot {
  id: string;
  number: number;
  name?: string;
  area: number;
  currentCycle: number;
  plantingDate: Date;
  lastHarvestDate?: Date;
  status: 'active' | 'reform' | 'rotation' | 'new';
  coordinates?: {lat: number, lng: number}[];
  soilType?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt: Date;
  updatedAt: Date;
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

export interface Product {
  id: string;
  name: string;
  brand: string;
  type: 'pesticide' | 'fertilizer' | 'herbicide' | 'soil_corrector' | 'pest_control_biological' | 'pest_control_chemical';
  activeIngredient?: string;
  concentration?: string;
  unitOfMeasure: string;
  costPerUnit: number;
  supplier?: string;
  registrationNumber?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CategoryHistory {
  id: string;
  categoryId: string;
  configurationDate: Date;
  plotIds: string[];
  soilPreparationIds: string[];
  changedBy: string;
  notes?: string;
}

export interface Production {
  id: string;
  plotId: string;
  cycle: number;
  harvestDate: Date;
  tonnage: number;
  atr: number;
  revenue: number;
  costs: number;
  notes?: string;
  createdAt?: Date;
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
  paymentDate: Date;
}

export interface SafraPlanning {
  id: string;
  year: string;
  startDate: Date;
  endDate: Date;
  previousRevenue: number;
  personalNeeds: number;
  availableBudget: number;
  plannedReforms: string[];
  status: 'planning' | 'active' | 'completed';
  createdAt?: Date;
}

export interface CashFlow {
  id: string;
  safraId: string;
  month: Date;
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
  applicationDate: Date;
  dosagePerHectare: number;
  createdAt?: Date;
}

export interface CostCategory {
  category: string;
  totalCost: number;
  costPerHectare: number;
  plots: string[];
}