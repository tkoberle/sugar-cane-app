import { executeQuery, executeTransaction } from '../connection';
import { Category, CategoryType, CategoryHistory } from '../../types/entities';

export class CategoryRepository {
  static async create(category: Omit<Category, 'plots' | 'soilPreparations'>): Promise<string> {
    const id = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await executeQuery(
      `INSERT INTO categories (id, cycle, name, expected_productivity, standard_revenue, standard_costs, parent_category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        category.cycle,
        category.name,
        category.expectedProductivity,
        category.standardRevenue,
        category.standardCosts,
        category.parentCategoryId || null
      ]
    );

    return id;
  }

  static async findById(id: string): Promise<Category | null> {
    const result = await executeQuery(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows.raw()[0];
    
    // Get associated plots
    const plotsResult = await executeQuery(`
      SELECT p.* FROM plots p
      INNER JOIN plot_categories pc ON p.id = pc.plot_id
      WHERE pc.category_id = ? AND pc.is_active = 1
    `, [id]);

    // Get associated soil preparations
    const soilPrepsResult = await executeQuery(`
      SELECT sp.* FROM soil_preparations sp
      INNER JOIN category_soil_preparations csp ON sp.id = csp.soil_preparation_id
      WHERE csp.category_id = ?
    `, [id]);

    return {
      id: row.id,
      cycle: row.cycle as CategoryType,
      name: row.name,
      expectedProductivity: row.expected_productivity,
      standardRevenue: row.standard_revenue,
      standardCosts: row.standard_costs,
      plots: plotsResult.rows.raw().map(p => ({
        ...p,
        currentCycle: p.current_cycle,
        plantingDate: new Date(p.planting_date),
        lastHarvestDate: p.last_harvest_date ? new Date(p.last_harvest_date) : undefined,
        coordinates: p.coordinates ? JSON.parse(p.coordinates) : undefined,
        soilType: p.soil_type,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      })),
      soilPreparations: soilPrepsResult.rows.raw().map(sp => ({
        ...sp,
        actions: [], // Will be loaded separately if needed
        totalCost: sp.total_cost,
        estimatedDuration: sp.estimated_duration,
        createdAt: new Date(sp.created_at),
        updatedAt: new Date(sp.updated_at)
      })),
      parentCategoryId: row.parent_category_id
    };
  }

  static async findAll(): Promise<Category[]> {
    const result = await executeQuery('SELECT * FROM categories ORDER BY cycle, name');
    
    const categories: Category[] = [];
    for (const row of result.rows.raw()) {
      const category = await this.findById(row.id);
      if (category) categories.push(category);
    }
    
    return categories;
  }

  static async update(id: string, updates: Partial<Omit<Category, 'id' | 'plots' | 'soilPreparations'>>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.cycle !== undefined) {
      fields.push('cycle = ?');
      values.push(updates.cycle);
    }
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.expectedProductivity !== undefined) {
      fields.push('expected_productivity = ?');
      values.push(updates.expectedProductivity);
    }
    if (updates.standardRevenue !== undefined) {
      fields.push('standard_revenue = ?');
      values.push(updates.standardRevenue);
    }
    if (updates.standardCosts !== undefined) {
      fields.push('standard_costs = ?');
      values.push(updates.standardCosts);
    }
    if (updates.parentCategoryId !== undefined) {
      fields.push('parent_category_id = ?');
      values.push(updates.parentCategoryId);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await executeQuery(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async delete(id: string): Promise<void> {
    await executeTransaction(async () => {
      // Remove plot associations
      await executeQuery('DELETE FROM plot_categories WHERE category_id = ?', [id]);
      // Remove soil preparation associations
      await executeQuery('DELETE FROM category_soil_preparations WHERE category_id = ?', [id]);
      // Delete the category
      await executeQuery('DELETE FROM categories WHERE id = ?', [id]);
    });
  }

  static async assignPlots(categoryId: string, plotIds: string[]): Promise<void> {
    await executeTransaction(async () => {
      // Deactivate existing assignments
      await executeQuery(
        'UPDATE plot_categories SET is_active = 0 WHERE category_id = ?',
        [categoryId]
      );

      // Create new assignments
      for (const plotId of plotIds) {
        await executeQuery(
          `INSERT INTO plot_categories (id, plot_id, category_id, is_active)
           VALUES (?, ?, ?, 1)`,
          [`pc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, plotId, categoryId]
        );
      }
    });
  }

  static async assignSoilPreparations(categoryId: string, soilPrepIds: string[]): Promise<void> {
    await executeTransaction(async () => {
      // Remove existing associations
      await executeQuery('DELETE FROM category_soil_preparations WHERE category_id = ?', [categoryId]);

      // Create new associations
      for (const soilPrepId of soilPrepIds) {
        await executeQuery(
          `INSERT INTO category_soil_preparations (id, category_id, soil_preparation_id)
           VALUES (?, ?, ?)`,
          [`csp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, categoryId, soilPrepId]
        );
      }
    });
  }

  static async saveHistory(history: Omit<CategoryHistory, 'id'>): Promise<string> {
    const id = `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await executeQuery(
      `INSERT INTO category_history (id, category_id, configuration_date, plot_ids, soil_preparation_ids, changed_by, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        history.categoryId,
        history.configurationDate.toISOString(),
        JSON.stringify(history.plotIds),
        JSON.stringify(history.soilPreparationIds),
        history.changedBy,
        history.notes || null
      ]
    );

    return id;
  }

  static async getHistory(categoryId: string): Promise<CategoryHistory[]> {
    const result = await executeQuery(
      'SELECT * FROM category_history WHERE category_id = ? ORDER BY configuration_date DESC',
      [categoryId]
    );

    return result.rows.raw().map(row => ({
      id: row.id,
      categoryId: row.category_id,
      configurationDate: new Date(row.configuration_date),
      plotIds: JSON.parse(row.plot_ids),
      soilPreparationIds: JSON.parse(row.soil_preparation_ids),
      changedBy: row.changed_by,
      notes: row.notes
    }));
  }
}