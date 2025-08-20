import { executeQuery } from '../connection';
import { Production } from '../../types';

export class ProductionRepository {
  static async getAllProductions(): Promise<Production[]> {
    const result = await executeQuery(`
      SELECT 
        id, plot_id as plotId, cycle, harvest_date as harvestDate,
        tonnage, atr, revenue, costs, notes, created_at as createdAt
      FROM productions 
      ORDER BY harvest_date DESC
    `);

    return result.rows.raw().map(row => ({
      ...row,
      harvestDate: new Date(row.harvestDate),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    }));
  }

  static async getProductionById(id: string): Promise<Production | null> {
    const result = await executeQuery(`
      SELECT 
        id, plot_id as plotId, cycle, harvest_date as harvestDate,
        tonnage, atr, revenue, costs, notes, created_at as createdAt
      FROM productions 
      WHERE id = ?
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows.item(0);
    return {
      ...row,
      harvestDate: new Date(row.harvestDate),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    };
  }

  static async getProductionsByPlot(plotId: string): Promise<Production[]> {
    const result = await executeQuery(`
      SELECT 
        id, plot_id as plotId, cycle, harvest_date as harvestDate,
        tonnage, atr, revenue, costs, notes, created_at as createdAt
      FROM productions 
      WHERE plot_id = ?
      ORDER BY harvest_date DESC
    `, [plotId]);

    return result.rows.raw().map(row => ({
      ...row,
      harvestDate: new Date(row.harvestDate),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    }));
  }

  static async getProductionsByCycle(cycle: number): Promise<Production[]> {
    const result = await executeQuery(`
      SELECT 
        id, plot_id as plotId, cycle, harvest_date as harvestDate,
        tonnage, atr, revenue, costs, notes, created_at as createdAt
      FROM productions 
      WHERE cycle = ?
      ORDER BY harvest_date DESC
    `, [cycle]);

    return result.rows.raw().map(row => ({
      ...row,
      harvestDate: new Date(row.harvestDate),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    }));
  }

  static async createProduction(production: Omit<Production, 'id' | 'createdAt'>): Promise<string> {
    const id = `production_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await executeQuery(`
      INSERT INTO productions (
        id, plot_id, cycle, harvest_date, tonnage, atr, revenue, costs, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      production.plotId,
      production.cycle,
      production.harvestDate.toISOString(),
      production.tonnage,
      production.atr,
      production.revenue,
      production.costs,
      production.notes || null,
      now
    ]);

    return id;
  }

  static async updateProduction(id: string, production: Partial<Production>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (production.plotId !== undefined) {
      fields.push('plot_id = ?');
      values.push(production.plotId);
    }
    if (production.cycle !== undefined) {
      fields.push('cycle = ?');
      values.push(production.cycle);
    }
    if (production.harvestDate !== undefined) {
      fields.push('harvest_date = ?');
      values.push(production.harvestDate.toISOString());
    }
    if (production.tonnage !== undefined) {
      fields.push('tonnage = ?');
      values.push(production.tonnage);
    }
    if (production.atr !== undefined) {
      fields.push('atr = ?');
      values.push(production.atr);
    }
    if (production.revenue !== undefined) {
      fields.push('revenue = ?');
      values.push(production.revenue);
    }
    if (production.costs !== undefined) {
      fields.push('costs = ?');
      values.push(production.costs);
    }
    if (production.notes !== undefined) {
      fields.push('notes = ?');
      values.push(production.notes);
    }

    if (fields.length === 0) {
      return;
    }

    values.push(id);

    await executeQuery(`
      UPDATE productions SET ${fields.join(', ')} WHERE id = ?
    `, values);
  }

  static async deleteProduction(id: string): Promise<void> {
    await executeQuery('DELETE FROM productions WHERE id = ?', [id]);
  }

  static async getProductionSummaryByCycle(): Promise<Array<{
    cycle: number;
    cycleName: string;
    plotCount: number;
    totalArea: number;
    totalTonnage: number;
    totalRevenue: number;
    totalCosts: number;
    averageATR: number;
    averageProductivity: number;
  }>> {
    const result = await executeQuery(`
      SELECT 
        p.cycle,
        cc.name as cycleName,
        COUNT(DISTINCT pl.id) as plotCount,
        SUM(pl.area) as totalArea,
        SUM(p.tonnage) as totalTonnage,
        SUM(p.revenue) as totalRevenue,
        SUM(p.costs) as totalCosts,
        AVG(p.atr) as averageATR,
        SUM(p.tonnage) / SUM(pl.area) as averageProductivity
      FROM productions p
      LEFT JOIN plots pl ON p.plot_id = pl.id
      LEFT JOIN cycle_categories cc ON p.cycle = cc.cycle
      GROUP BY p.cycle, cc.name
      ORDER BY p.cycle
    `);

    return result.rows.raw();
  }
}