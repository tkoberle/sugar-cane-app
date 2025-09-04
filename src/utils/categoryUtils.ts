import { Category, Plot } from '../types';

/**
 * Get category information for a specific plot
 */
export const getPlotCategoryInfo = (
  plotId: string, 
  categories: Category[]
): {
  isAssigned: boolean;
  categoryName?: string;
  categoryId?: string;
} => {
  // Find the category that contains this plot
  const assignedCategory = categories.find(category => 
    category.plots.some(plot => plot.id === plotId)
  );

  if (assignedCategory) {
    return {
      isAssigned: true,
      categoryName: assignedCategory.name,
      categoryId: assignedCategory.id,
    };
  }

  return {
    isAssigned: false,
  };
};

/**
 * Get category information for multiple plots
 */
export const getPlotsWithCategoryInfo = (
  plots: Plot[], 
  categories: Category[]
): Array<{
  plot: Plot;
  categoryInfo: {
    isAssigned: boolean;
    categoryName?: string;
    categoryId?: string;
  };
}> => {
  return plots.map(plot => ({
    plot,
    categoryInfo: getPlotCategoryInfo(plot.id, categories),
  }));
};

/**
 * Get plots that are not assigned to any category for a specific cycle
 */
export const getUnassignedPlotsForCycle = (
  plots: Plot[], 
  categories: Category[], 
  cycle: number
): Plot[] => {
  const plotsInCycle = plots.filter(plot => plot.currentCycle === cycle);
  
  return plotsInCycle.filter(plot => {
    const categoryInfo = getPlotCategoryInfo(plot.id, categories);
    return !categoryInfo.isAssigned;
  });
};

/**
 * Check if a plot is assigned to a specific category
 */
export const isPlotInCategory = (
  plotId: string, 
  categoryId: string, 
  categories: Category[]
): boolean => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.plots.some(plot => plot.id === plotId) : false;
};