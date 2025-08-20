import { Plot, CycleCategory, Production } from '../types';

export class FinancialCalculations {
  static calculateAvailableBudget(previousRevenue: number, personalNeeds: number): number {
    return Math.max(0, previousRevenue - personalNeeds);
  }

  static calculateReformCost(area: number): number {
    return area * 15000; // R$ 15,000 per hectare
  }

  static calculateATRRevenue(tonnage: number, atr: number, pricePerKgATR: number): number {
    const totalATR = tonnage * 1000 * (atr / 100); // Convert to kg ATR
    return totalATR * pricePerKgATR;
  }

  static calculateExpectedProductivity(baseLine: number, cycle: number): number {
    const degradationRates = [0, 0, 0.091, 0.10, 0.056, 0.059]; // Based on real data
    
    if (cycle >= degradationRates.length) {
      return 0;
    }
    
    let totalDegradation = 1;
    for (let i = 1; i <= cycle; i++) {
      totalDegradation *= (1 - (degradationRates[i] || 0));
    }
    
    return baseLine * totalDegradation;
  }

  static calculateReformROI(plot: Plot, currentCycle: number, pricePerKgATR: number = 1.212): number {
    const reformCost = this.calculateReformCost(plot.area);
    const currentProductivity = this.calculateExpectedProductivity(110, currentCycle);
    const newProductivity = 110; // Reset to first cut
    const productivityGain = newProductivity - currentProductivity;
    
    if (productivityGain <= 0) {
      return 0;
    }
    
    const annualRevenue = productivityGain * plot.area * pricePerKgATR;
    return (annualRevenue / reformCost) * 100; // ROI as percentage
  }

  static calculatePlotRevenue(plot: Plot, production: Production): number {
    return production.tonnage * plot.area * 1.212; // Simplified calculation
  }

  static calculateNetProfit(revenue: number, costs: number, deductions: { inss?: number; aplacana?: number; other?: number } = {}): number {
    const totalDeductions = (deductions.inss || 0) + (deductions.aplacana || 0) + (deductions.other || 0);
    return revenue - costs - totalDeductions;
  }

  static calculateCostPerHectare(totalCost: number, area: number): number {
    return area > 0 ? totalCost / area : 0;
  }

  static calculateProductivityPerHectare(tonnage: number, area: number): number {
    return area > 0 ? tonnage / area : 0;
  }

  static calculateAverageATR(productions: Production[]): number {
    if (productions.length === 0) return 0;
    
    const totalATR = productions.reduce((sum, prod) => sum + prod.atr, 0);
    return totalATR / productions.length;
  }

  static calculateTotalRevenue(productions: Production[]): number {
    return productions.reduce((sum, prod) => sum + prod.revenue, 0);
  }

  static calculateTotalCosts(productions: Production[]): number {
    return productions.reduce((sum, prod) => sum + prod.costs, 0);
  }

  static calculateCashFlowProjection(
    currentBalance: number,
    monthlyRevenue: number,
    monthlyExpenses: number,
    months: number
  ): Array<{ month: number; revenue: number; expenses: number; balance: number }> {
    const projection = [];
    let balance = currentBalance;

    for (let month = 1; month <= months; month++) {
      balance += monthlyRevenue - monthlyExpenses;
      projection.push({
        month,
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        balance,
      });
    }

    return projection;
  }

  static calculateBreakEvenPoint(fixedCosts: number, variableCostPerUnit: number, pricePerUnit: number): number {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    return contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
  }

  static calculateEfficiencyMetrics(plots: Plot[], productions: Production[]): {
    totalArea: number;
    totalProduction: number;
    averageProductivity: number;
    totalRevenue: number;
    totalCosts: number;
    profitMargin: number;
  } {
    const totalArea = plots.reduce((sum, plot) => sum + plot.area, 0);
    const totalProduction = productions.reduce((sum, prod) => sum + prod.tonnage, 0);
    const totalRevenue = this.calculateTotalRevenue(productions);
    const totalCosts = this.calculateTotalCosts(productions);
    
    return {
      totalArea,
      totalProduction,
      averageProductivity: totalArea > 0 ? totalProduction / totalArea : 0,
      totalRevenue,
      totalCosts,
      profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0,
    };
  }
}