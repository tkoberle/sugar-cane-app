import { CycleCategory } from '../types';

export const cycleCategoriesData: CycleCategory[] = [
  { 
    cycle: 0, 
    name: "Plantio Novo", 
    expectedProductivity: 0, 
    standardRevenue: 0, 
    standardCosts: 365.38 
  },
  { 
    cycle: 1, 
    name: "Primeiro Corte", 
    expectedProductivity: 110, 
    standardRevenue: 19774.02, 
    standardCosts: 1984.43 
  },
  { 
    cycle: 2, 
    name: "Segundo Corte", 
    expectedProductivity: 100, 
    standardRevenue: 17976.38, 
    standardCosts: 1759.43 
  },
  { 
    cycle: 3, 
    name: "Terceiro Corte", 
    expectedProductivity: 90, 
    standardRevenue: 16178.75, 
    standardCosts: 1674.44 
  },
  { 
    cycle: 4, 
    name: "Quarto Corte", 
    expectedProductivity: 85, 
    standardRevenue: 15279.93, 
    standardCosts: 3734.20 
  },
  { 
    cycle: 5, 
    name: "Quinto Corte", 
    expectedProductivity: 80, 
    standardRevenue: 14381.11, 
    standardCosts: 0 
  },
];

export const getCycleNameById = (cycle: number): string => {
  const category = cycleCategoriesData.find(cat => cat.cycle === cycle);
  return category ? category.name : `Ciclo ${cycle}`;
};

export const getExpectedProductivity = (cycle: number): number => {
  const category = cycleCategoriesData.find(cat => cat.cycle === cycle);
  return category ? category.expectedProductivity : 0;
};

export const getStandardRevenue = (cycle: number): number => {
  const category = cycleCategoriesData.find(cat => cat.cycle === cycle);
  return category ? category.standardRevenue : 0;
};

export const getStandardCosts = (cycle: number): number => {
  const category = cycleCategoriesData.find(cat => cat.cycle === cycle);
  return category ? category.standardCosts : 0;
};