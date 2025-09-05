import { executeQuery, executeTransaction } from '../connection';
import { SoilPreparation, SoilPreparationAction } from '../../types/entities';

export class SoilPreparationRepository {
  static async create(soilPrep: Omit<SoilPreparation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `soil_prep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await executeTransaction(async () => {
      // Create soil preparation
      await executeQuery(
        `INSERT INTO soil_preparations (id, name, description, total_cost, estimated_duration)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          soilPrep.name,
          soilPrep.description || null,
          soilPrep.totalCost,
          soilPrep.estimatedDuration
        ]
      );

      // Create actions
      for (const action of soilPrep.actions) {
        await this.createAction({
          ...action,
          soilPreparationId: id
        });
      }
    });

    return id;
  }

  static async createAction(action: Omit<SoilPreparationAction, 'id'>): Promise<string> {
    const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await executeQuery(
      `INSERT INTO soil_preparation_actions (id, soil_preparation_id, product_id, dosage, dosage_unit, application_method, engineer_report_blob, action_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        action.soilPreparationId,
        action.productId,
        action.dosage,
        action.dosageUnit,
        action.applicationMethod || null,
        action.engineerReportBlob || null,
        action.order
      ]
    );

    return id;
  }

  static async findById(id: string): Promise<SoilPreparation | null> {
    const result = await executeQuery(
      'SELECT * FROM soil_preparations WHERE id = ?',
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows.raw()[0];
    
    // Get actions with product details
    const actionsResult = await executeQuery(`
      SELECT spa.*, p.name as product_name, p.brand as product_brand, p.type as product_type, p.unit_of_measure, p.cost_per_unit
      FROM soil_preparation_actions spa
      INNER JOIN products p ON spa.product_id = p.id
      WHERE spa.soil_preparation_id = ?
      ORDER BY spa.action_order
    `, [id]);

    const actions: SoilPreparationAction[] = actionsResult.rows.raw().map(actionRow => ({
      id: actionRow.id,
      soilPreparationId: actionRow.soil_preparation_id,
      productId: actionRow.product_id,
      dosage: actionRow.dosage,
      dosageUnit: actionRow.dosage_unit,
      applicationMethod: actionRow.application_method,
      engineerReportBlob: actionRow.engineer_report_blob,
      order: actionRow.action_order
    }));

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      actions,
      totalCost: row.total_cost,
      estimatedDuration: row.estimated_duration,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  static async findAll(): Promise<SoilPreparation[]> {
    const result = await executeQuery('SELECT * FROM soil_preparations ORDER BY name');
    
    const preparations: SoilPreparation[] = [];
    for (const row of result.rows.raw()) {
      const preparation = await this.findById(row.id);
      if (preparation) preparations.push(preparation);
    }
    
    return preparations;
  }

  static async update(id: string, updates: Partial<Omit<SoilPreparation, 'id' | 'createdAt' | 'updatedAt' | 'actions'>>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.totalCost !== undefined) {
      fields.push('total_cost = ?');
      values.push(updates.totalCost);
    }
    if (updates.estimatedDuration !== undefined) {
      fields.push('estimated_duration = ?');
      values.push(updates.estimatedDuration);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await executeQuery(
      `UPDATE soil_preparations SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async updateActions(soilPrepId: string, actions: Omit<SoilPreparationAction, 'id' | 'soilPreparationId'>[]): Promise<void> {
    await executeTransaction(async () => {
      // Delete existing actions
      await executeQuery('DELETE FROM soil_preparation_actions WHERE soil_preparation_id = ?', [soilPrepId]);

      // Create new actions
      for (const action of actions) {
        await this.createAction({
          ...action,
          soilPreparationId: soilPrepId
        });
      }

      // Recalculate total cost
      const costResult = await executeQuery(`
        SELECT SUM(spa.dosage * p.cost_per_unit) as total_cost
        FROM soil_preparation_actions spa
        INNER JOIN products p ON spa.product_id = p.id
        WHERE spa.soil_preparation_id = ?
      `, [soilPrepId]);

      const totalCost = costResult.rows.raw()[0]?.total_cost || 0;
      await executeQuery(
        'UPDATE soil_preparations SET total_cost = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [totalCost, soilPrepId]
      );
    });
  }

  static async delete(id: string): Promise<void> {
    await executeTransaction(async () => {
      // Delete actions first
      await executeQuery('DELETE FROM soil_preparation_actions WHERE soil_preparation_id = ?', [id]);
      // Delete soil preparation
      await executeQuery('DELETE FROM soil_preparations WHERE id = ?', [id]);
      // Remove from category associations
      await executeQuery('DELETE FROM category_soil_preparations WHERE soil_preparation_id = ?', [id]);
    });
  }

  static async deleteAction(actionId: string): Promise<void> {
    await executeQuery('DELETE FROM soil_preparation_actions WHERE id = ?', [actionId]);
  }

  static async calculateTotalCost(soilPrepId: string): Promise<number> {
    const result = await executeQuery(`
      SELECT SUM(spa.dosage * p.cost_per_unit) as total_cost
      FROM soil_preparation_actions spa
      INNER JOIN products p ON spa.product_id = p.id
      WHERE spa.soil_preparation_id = ?
    `, [soilPrepId]);

    return result.rows.raw()[0]?.total_cost || 0;
  }

  static async search(searchTerm: string): Promise<SoilPreparation[]> {
    const result = await executeQuery(
      `SELECT * FROM soil_preparations 
       WHERE name LIKE ? OR description LIKE ?
       ORDER BY name`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    const preparations: SoilPreparation[] = [];
    for (const row of result.rows.raw()) {
      const preparation = await this.findById(row.id);
      if (preparation) preparations.push(preparation);
    }
    
    return preparations;
  }
}