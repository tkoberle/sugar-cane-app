import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Production } from '../../types';
import { ProductionRepository } from '../../database';

interface ProductionsState {
  productions: Production[];
  selectedProduction: Production | null;
  cycleSummary: Array<{
    cycle: number;
    cycleName: string;
    plotCount: number;
    totalArea: number;
    totalTonnage: number;
    totalRevenue: number;
    totalCosts: number;
    averageATR: number;
    averageProductivity: number;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: ProductionsState = {
  productions: [],
  selectedProduction: null,
  cycleSummary: [],
  loading: false,
  error: null,
};

export const fetchProductions = createAsyncThunk(
  'productions/fetchProductions',
  async () => {
    return await ProductionRepository.getAllProductions();
  }
);

export const fetchProductionById = createAsyncThunk(
  'productions/fetchProductionById',
  async (id: string) => {
    return await ProductionRepository.getProductionById(id);
  }
);

export const fetchProductionsByPlot = createAsyncThunk(
  'productions/fetchProductionsByPlot',
  async (plotId: string) => {
    return await ProductionRepository.getProductionsByPlot(plotId);
  }
);

export const fetchProductionsByCycle = createAsyncThunk(
  'productions/fetchProductionsByCycle',
  async (cycle: number) => {
    return await ProductionRepository.getProductionsByCycle(cycle);
  }
);

export const fetchProductionSummary = createAsyncThunk(
  'productions/fetchProductionSummary',
  async () => {
    return await ProductionRepository.getProductionSummaryByCycle();
  }
);

export const createProduction = createAsyncThunk(
  'productions/createProduction',
  async (productionData: Omit<Production, 'id' | 'createdAt'>) => {
    const id = await ProductionRepository.createProduction(productionData);
    return await ProductionRepository.getProductionById(id);
  }
);

export const updateProduction = createAsyncThunk(
  'productions/updateProduction',
  async ({ id, productionData }: { id: string; productionData: Partial<Production> }) => {
    await ProductionRepository.updateProduction(id, productionData);
    return await ProductionRepository.getProductionById(id);
  }
);

export const deleteProduction = createAsyncThunk(
  'productions/deleteProduction',
  async (id: string) => {
    await ProductionRepository.deleteProduction(id);
    return id;
  }
);

const productionsSlice = createSlice({
  name: 'productions',
  initialState,
  reducers: {
    clearSelectedProduction: (state) => {
      state.selectedProduction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductions.fulfilled, (state, action: PayloadAction<Production[]>) => {
        state.loading = false;
        state.productions = action.payload;
      })
      .addCase(fetchProductions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch productions';
      })
      .addCase(fetchProductionById.fulfilled, (state, action: PayloadAction<Production | null>) => {
        state.selectedProduction = action.payload;
      })
      .addCase(fetchProductionsByPlot.fulfilled, (state, action: PayloadAction<Production[]>) => {
        state.productions = action.payload;
      })
      .addCase(fetchProductionsByCycle.fulfilled, (state, action: PayloadAction<Production[]>) => {
        state.productions = action.payload;
      })
      .addCase(fetchProductionSummary.fulfilled, (state, action) => {
        state.cycleSummary = action.payload;
      })
      .addCase(createProduction.fulfilled, (state, action: PayloadAction<Production | null>) => {
        if (action.payload) {
          state.productions.unshift(action.payload);
        }
      })
      .addCase(updateProduction.fulfilled, (state, action: PayloadAction<Production | null>) => {
        if (action.payload) {
          const index = state.productions.findIndex(p => p.id === action.payload!.id);
          if (index !== -1) {
            state.productions[index] = action.payload;
          }
          if (state.selectedProduction?.id === action.payload.id) {
            state.selectedProduction = action.payload;
          }
        }
      })
      .addCase(deleteProduction.fulfilled, (state, action: PayloadAction<string>) => {
        state.productions = state.productions.filter(p => p.id !== action.payload);
        if (state.selectedProduction?.id === action.payload) {
          state.selectedProduction = null;
        }
      });
  },
});

export const { clearSelectedProduction, clearError: clearProductionsError } = productionsSlice.actions;
export default productionsSlice.reducer;