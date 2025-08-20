import { Plot, OptimizationResult } from '../types';
import { FinancialCalculations } from './FinancialCalculations';

export class OptimizationEngine {
  static analyzePlotConsolidation(plots: Plot[]): OptimizationResult {
    const inefficientPlots = plots.filter(plot => plot.area < 5); // Small plots threshold
    const consolidationCandidates = this.findAdjacentPlots(inefficientPlots);
    const projectedSavings = this.calculateConsolidationSavings(consolidationCandidates);
    
    return {
      currentEfficiency: this.calculateCurrentEfficiency(plots),
      optimizedStructure: this.generateOptimizedStructure(plots),
      projectedSavings,
      implementationPlan: this.createImplementationPlan(consolidationCandidates),
    };
  }

  private static findAdjacentPlots(plots: Plot[]): Array<{ plots: Plot[]; potentialSize: number }> {
    // Simplified adjacency logic - in real implementation, this would use coordinates
    const candidates: Array<{ plots: Plot[]; potentialSize: number }> = [];
    
    for (let i = 0; i < plots.length - 1; i++) {
      for (let j = i + 1; j < plots.length; j++) {
        const plot1 = plots[i];
        const plot2 = plots[j];
        
        // Check if plots are adjacent (simplified by checking consecutive numbers)
        if (Math.abs(plot1.number - plot2.number) === 1) {
          candidates.push({
            plots: [plot1, plot2],
            potentialSize: plot1.area + plot2.area,
          });
        }
      }
    }
    
    return candidates;
  }

  private static calculateConsolidationSavings(
    candidates: Array<{ plots: Plot[]; potentialSize: number }>
  ): number {
    let totalSavings = 0;
    
    candidates.forEach(candidate => {
      // Calculate savings from reduced operational overhead
      const numberOfPlots = candidate.plots.length;
      const savingsPerPlot = 500; // R$ savings per plot eliminated
      totalSavings += (numberOfPlots - 1) * savingsPerPlot;
      
      // Add efficiency gains from larger plot sizes
      const efficiencyGain = candidate.potentialSize > 10 ? 0.1 : 0.05; // 10% or 5% efficiency gain
      const averageRevenue = candidate.plots.reduce((sum, plot) => sum + plot.area * 19000, 0) / numberOfPlots;
      totalSavings += averageRevenue * efficiencyGain;
    });
    
    return totalSavings;
  }

  private static calculateCurrentEfficiency(plots: Plot[]): number {
    const totalArea = plots.reduce((sum, plot) => sum + plot.area, 0);
    const smallPlots = plots.filter(plot => plot.area < 5).length;
    const efficiency = ((plots.length - smallPlots) / plots.length) * 100;
    
    return Math.round(efficiency);
  }

  private static generateOptimizedStructure(plots: Plot[]): OptimizationResult['optimizedStructure'] {
    return plots
      .filter(plot => plot.area < 5)
      .map(plot => ({
        plotId: plot.id,
        recommendedSize: Math.max(plot.area * 2, 5), // Minimum 5 hectares
        mergeCandidates: this.findMergeCandidates(plot, plots),
        priorityScore: this.calculatePriorityScore(plot),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  private static findMergeCandidates(targetPlot: Plot, allPlots: Plot[]): string[] {
    return allPlots
      .filter(plot => 
        plot.id !== targetPlot.id && 
        Math.abs(plot.number - targetPlot.number) <= 2 && // Within 2 plot numbers
        plot.area < 10 // Also small enough to benefit from merging
      )
      .slice(0, 3) // Limit to 3 candidates
      .map(plot => plot.id);
  }

  private static calculatePriorityScore(plot: Plot): number {
    let score = 0;
    
    // Smaller plots get higher priority
    if (plot.area < 2) score += 40;
    else if (plot.area < 3) score += 30;
    else if (plot.area < 5) score += 20;
    
    // Older cycles get higher priority (more benefit from consolidation)
    if (plot.currentCycle >= 4) score += 30;
    else if (plot.currentCycle >= 2) score += 20;
    
    // Reform status gets highest priority
    if (plot.status === 'reform') score += 50;
    
    return score;
  }

  private static createImplementationPlan(
    candidates: Array<{ plots: Plot[]; potentialSize: number }>
  ): OptimizationResult['implementationPlan'] {
    const plan: OptimizationResult['implementationPlan'] = [];
    
    // Phase 1: High priority consolidations
    const highPriorityMergers = candidates
      .filter(candidate => candidate.plots.some(plot => plot.status === 'reform'))
      .slice(0, 3);
    
    if (highPriorityMergers.length > 0) {
      plan.push({
        phase: 1,
        actions: [
          'Consolidar talhões em reforma',
          'Revisar limites das propriedades',
          'Atualizar sistema de irrigação'
        ],
        cost: highPriorityMergers.length * 25000,
        expectedROI: 0.25, // 25% ROI
      });
    }
    
    // Phase 2: Medium priority consolidations
    const mediumPriorityMergers = candidates
      .filter(candidate => 
        !candidate.plots.some(plot => plot.status === 'reform') &&
        candidate.plots.some(plot => plot.area < 3)
      )
      .slice(0, 2);
    
    if (mediumPriorityMergers.length > 0) {
      plan.push({
        phase: 2,
        actions: [
          'Consolidar talhões pequenos',
          'Otimizar rotas de colheita',
          'Instalar novos pontos de água'
        ],
        cost: mediumPriorityMergers.length * 20000,
        expectedROI: 0.18, // 18% ROI
      });
    }
    
    // Phase 3: Low priority optimizations
    const remainingMergers = candidates.length - highPriorityMergers.length - mediumPriorityMergers.length;
    
    if (remainingMergers > 0) {
      plan.push({
        phase: 3,
        actions: [
          'Consolidações finais',
          'Otimização geral do layout',
          'Implementação de melhorias tecnológicas'
        ],
        cost: remainingMergers * 15000,
        expectedROI: 0.12, // 12% ROI
      });
    }
    
    return plan;
  }

  static calculateOptimalPlotSize(
    currentPlots: Plot[],
    operationalCosts: number,
    machineryCapacity: number
  ): number {
    // Calculate average operational efficiency by plot size
    const plotsBySize = currentPlots.reduce((acc, plot) => {
      const sizeCategory = Math.floor(plot.area / 5) * 5; // Group by 5-hectare intervals
      if (!acc[sizeCategory]) {
        acc[sizeCategory] = { plots: [], totalArea: 0, avgProductivity: 0 };
      }
      acc[sizeCategory].plots.push(plot);
      acc[sizeCategory].totalArea += plot.area;
      return acc;
    }, {} as Record<number, { plots: Plot[]; totalArea: number; avgProductivity: number }>);

    // Find the size category with best efficiency
    let optimalSize = 10; // Default
    let bestEfficiency = 0;

    Object.entries(plotsBySize).forEach(([size, data]) => {
      const sizeNum = parseInt(size);
      if (data.plots.length >= 2) { // Need at least 2 plots for meaningful data
        // Simplified efficiency calculation
        const efficiency = data.totalArea / (data.plots.length * operationalCosts);
        if (efficiency > bestEfficiency && sizeNum >= 5) {
          bestEfficiency = efficiency;
          optimalSize = sizeNum + 5; // Recommend slightly larger
        }
      }
    });

    return Math.min(optimalSize, 25); // Cap at 25 hectares for practical reasons
  }

  static evaluateReformPriority(plots: Plot[]): Array<{ plot: Plot; priority: number; reason: string }> {
    return plots
      .map(plot => {
        let priority = 0;
        let reasons: string[] = [];

        // Age-based priority (cycle)
        if (plot.currentCycle >= 5) {
          priority += 50;
          reasons.push('Fim do ciclo produtivo');
        } else if (plot.currentCycle >= 4) {
          priority += 30;
          reasons.push('Baixa produtividade');
        }

        // Size-based priority
        if (plot.area < 2) {
          priority += 40;
          reasons.push('Talhão muito pequeno');
        } else if (plot.area < 5) {
          priority += 20;
          reasons.push('Talhão pequeno');
        }

        // Status-based priority
        if (plot.status === 'reform') {
          priority += 60;
          reasons.push('Já marcado para reforma');
        }

        // ROI calculation
        const roi = FinancialCalculations.calculateReformROI(plot, plot.currentCycle);
        if (roi > 30) {
          priority += 25;
          reasons.push('Alto retorno esperado');
        } else if (roi > 15) {
          priority += 10;
          reasons.push('Retorno moderado');
        }

        return {
          plot,
          priority,
          reason: reasons.join(', ') || 'Avaliação padrão',
        };
      })
      .sort((a, b) => b.priority - a.priority);
  }
}