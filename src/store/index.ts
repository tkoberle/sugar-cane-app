import { configureStore } from '@reduxjs/toolkit';
import plotsReducer from './slices/plotsSlice';
import productionsReducer from './slices/productionsSlice';

export const store = configureStore({
  reducer: {
    plots: plotsReducer,
    productions: productionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export specific actions to avoid naming conflicts
export { 
  fetchPlots, 
  fetchPlotById, 
  createPlot, 
  updatePlot, 
  deletePlot, 
  fetchPlotsByCycle, 
  fetchPlotsByStatus,
  clearSelectedPlot,
  clearPlotsError 
} from './slices/plotsSlice';

export { 
  fetchProductions, 
  fetchProductionById, 
  fetchProductionsByPlot, 
  fetchProductionsByCycle, 
  fetchProductionSummary,
  createProduction, 
  updateProduction, 
  deleteProduction,
  clearSelectedProduction,
  clearProductionsError 
} from './slices/productionsSlice';