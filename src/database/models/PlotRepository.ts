import { executeQuery } from '../connection';
import { Plot } from '../../types';

export class PlotRepository {
  static async getAllPlots(): Promise<Plot[]> {
    const result = await executeQuery(`
      SELECT 
        id, number, name, area, current_cycle as currentCycle,
        planting_date as plantingDate, last_harvest_date as lastHarvestDate,
        status, coordinates, soil_type as soilType, notes,
        created_at as createdAt, updated_at as updatedAt
      FROM plots 
      ORDER BY number
    `);

    return result.rows.raw().map(row => ({
      ...row,
      plantingDate: row.plantingDate ? new Date(row.plantingDate) : new Date(),
      lastHarvestDate: row.lastHarvestDate ? new Date(row.lastHarvestDate) : undefined,
      coordinates: row.coordinates ? JSON.parse(row.coordinates) : undefined,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  }

  static async getNextPlotNumber(): Promise<number> {
    const result = await executeQuery(`
      SELECT MAX(number) as maxNumber FROM plots
    `);
    
    const maxNumber = result.rows.raw()[0]?.maxNumber || 0;
    return maxNumber + 1;
  }

  static async getPlotById(id: string): Promise<Plot | null> {
    const result = await executeQuery(`
      SELECT 
        id, number, name, area, current_cycle as currentCycle,
        planting_date as plantingDate, last_harvest_date as lastHarvestDate,
        status, coordinates, soil_type as soilType, notes,
        created_at as createdAt, updated_at as updatedAt
      FROM plots 
      WHERE id = ?
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows.item(0);
    return {
      ...row,
      plantingDate: row.plantingDate ? new Date(row.plantingDate) : new Date(),
      lastHarvestDate: row.lastHarvestDate ? new Date(row.lastHarvestDate) : undefined,
      coordinates: row.coordinates ? JSON.parse(row.coordinates) : undefined,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    };
  }

  static async createPlot(plot: Omit<Plot, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `plot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const nextNumber = await this.getNextPlotNumber();

    await executeQuery(`
      INSERT INTO plots (
        id, number, name, area, current_cycle, planting_date, last_harvest_date,
        status, coordinates, soil_type, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      nextNumber,
      plot.name || null,
      plot.area,
      plot.currentCycle,
      plot.plantingDate.toISOString(),
      plot.lastHarvestDate?.toISOString() || null,
      plot.status,
      plot.coordinates ? JSON.stringify(plot.coordinates) : null,
      plot.soilType || null,
      plot.notes || null,
      now,
      now
    ]);

    return id;
  }

  static async updatePlot(id: string, plot: Partial<Plot>): Promise<void> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (plot.number !== undefined) {
      fields.push('number = ?');
      values.push(plot.number);
    }
    if (plot.name !== undefined) {
      fields.push('name = ?');
      values.push(plot.name);
    }
    if (plot.area !== undefined) {
      fields.push('area = ?');
      values.push(plot.area);
    }
    if (plot.currentCycle !== undefined) {
      fields.push('current_cycle = ?');
      values.push(plot.currentCycle);
    }
    if (plot.plantingDate !== undefined) {
      fields.push('planting_date = ?');
      values.push(plot.plantingDate.toISOString());
    }
    if (plot.lastHarvestDate !== undefined) {
      fields.push('last_harvest_date = ?');
      values.push(plot.lastHarvestDate?.toISOString() || null);
    }
    if (plot.status !== undefined) {
      fields.push('status = ?');
      values.push(plot.status);
    }
    if (plot.coordinates !== undefined) {
      fields.push('coordinates = ?');
      values.push(plot.coordinates ? JSON.stringify(plot.coordinates) : null);
    }
    if (plot.soilType !== undefined) {
      fields.push('soil_type = ?');
      values.push(plot.soilType);
    }
    if (plot.notes !== undefined) {
      fields.push('notes = ?');
      values.push(plot.notes);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await executeQuery(`
      UPDATE plots SET ${fields.join(', ')} WHERE id = ?
    `, values);
  }

  static async deletePlot(id: string): Promise<void> {
    await executeQuery('DELETE FROM plots WHERE id = ?', [id]);
  }

  static async getPlotsByCycle(cycle: number): Promise<Plot[]> {
    const result = await executeQuery(`
      SELECT 
        id, number, name, area, current_cycle as currentCycle,
        planting_date as plantingDate, last_harvest_date as lastHarvestDate,
        status, coordinates, soil_type as soilType, notes,
        created_at as createdAt, updated_at as updatedAt
      FROM plots 
      WHERE current_cycle = ?
      ORDER BY number
    `, [cycle]);

    return result.rows.raw().map(row => ({
      ...row,
      plantingDate: row.plantingDate ? new Date(row.plantingDate) : new Date(),
      lastHarvestDate: row.lastHarvestDate ? new Date(row.lastHarvestDate) : undefined,
      coordinates: row.coordinates ? JSON.parse(row.coordinates) : undefined,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  }

  static async getPlotsByStatus(status: Plot['status']): Promise<Plot[]> {
    const result = await executeQuery(`
      SELECT 
        id, number, name, area, current_cycle as currentCycle,
        planting_date as plantingDate, last_harvest_date as lastHarvestDate,
        status, coordinates, soil_type as soilType, notes,
        created_at as createdAt, updated_at as updatedAt
      FROM plots 
      WHERE status = ?
      ORDER BY number
    `, [status]);

    return result.rows.raw().map(row => ({
      ...row,
      plantingDate: row.plantingDate ? new Date(row.plantingDate) : new Date(),
      lastHarvestDate: row.lastHarvestDate ? new Date(row.lastHarvestDate) : undefined,
      coordinates: row.coordinates ? JSON.parse(row.coordinates) : undefined,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  }
}