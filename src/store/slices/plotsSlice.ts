import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Plot } from '../../types';
import { PlotRepository } from '../../database';

interface PlotsState {
  plots: Plot[];
  selectedPlot: Plot | null;
  nextPlotNumber: number;
  loading: boolean;
  error: string | null;
}

const initialState: PlotsState = {
  plots: [],
  selectedPlot: null,
  nextPlotNumber: 1,
  loading: false,
  error: null,
};

export const fetchPlots = createAsyncThunk(
  'plots/fetchPlots',
  async () => {
    return await PlotRepository.getAllPlots();
  }
);

export const fetchPlotById = createAsyncThunk(
  'plots/fetchPlotById',
  async (id: string) => {
    return await PlotRepository.getPlotById(id);
  }
);

export const getNextPlotNumber = createAsyncThunk(
  'plots/getNextPlotNumber',
  async () => {
    const nextNumber = await PlotRepository.getNextPlotNumber();
    console.log('Redux: getNextPlotNumber result:', nextNumber);
    return nextNumber;
  }
);

export const createPlot = createAsyncThunk(
  'plots/createPlot',
  async (plotData: Omit<Plot, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => {
    const id = await PlotRepository.createPlot(plotData);
    return await PlotRepository.getPlotById(id);
  }
);

export const updatePlot = createAsyncThunk(
  'plots/updatePlot',
  async ({ id, plotData }: { id: string; plotData: Partial<Plot> }) => {
    await PlotRepository.updatePlot(id, plotData);
    return await PlotRepository.getPlotById(id);
  }
);

export const deletePlot = createAsyncThunk(
  'plots/deletePlot',
  async (id: string) => {
    await PlotRepository.deletePlot(id);
    return id;
  }
);

export const fetchPlotsByCycle = createAsyncThunk(
  'plots/fetchPlotsByCycle',
  async (cycle: number) => {
    return await PlotRepository.getPlotsByCycle(cycle);
  }
);

export const fetchPlotsByStatus = createAsyncThunk(
  'plots/fetchPlotsByStatus',
  async (status: Plot['status']) => {
    return await PlotRepository.getPlotsByStatus(status);
  }
);

const plotsSlice = createSlice({
  name: 'plots',
  initialState,
  reducers: {
    clearSelectedPlot: (state) => {
      state.selectedPlot = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlots.fulfilled, (state, action: PayloadAction<Plot[]>) => {
        state.loading = false;
        state.plots = action.payload;
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plots';
      })
      .addCase(fetchPlotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlotById.fulfilled, (state, action: PayloadAction<Plot | null>) => {
        state.loading = false;
        state.selectedPlot = action.payload;
      })
      .addCase(fetchPlotById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plot';
      })
      .addCase(createPlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlot.fulfilled, (state, action: PayloadAction<Plot | null>) => {
        state.loading = false;
        if (action.payload) {
          state.plots.push(action.payload);
        }
      })
      .addCase(createPlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create plot';
      })
      .addCase(updatePlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlot.fulfilled, (state, action: PayloadAction<Plot | null>) => {
        state.loading = false;
        if (action.payload) {
          const index = state.plots.findIndex(plot => plot.id === action.payload!.id);
          if (index !== -1) {
            state.plots[index] = action.payload;
          }
          if (state.selectedPlot?.id === action.payload.id) {
            state.selectedPlot = action.payload;
          }
        }
      })
      .addCase(updatePlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update plot';
      })
      .addCase(deletePlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlot.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.plots = state.plots.filter(plot => plot.id !== action.payload);
        if (state.selectedPlot?.id === action.payload) {
          state.selectedPlot = null;
        }
      })
      .addCase(deletePlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete plot';
      })
      .addCase(getNextPlotNumber.fulfilled, (state, action: PayloadAction<number>) => {
        state.nextPlotNumber = action.payload;
      });
  },
});

export const { clearSelectedPlot, clearError: clearPlotsError } = plotsSlice.actions;
export default plotsSlice.reducer;