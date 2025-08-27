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

export interface CycleCategory {
  cycle: number;
  name: string;
  expectedProductivity: number;
  standardRevenue: number;
  standardCosts: number;
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