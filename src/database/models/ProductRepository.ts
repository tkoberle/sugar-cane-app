import { executeQuery } from '../connection';
import { Product } from '../../types/entities';

export class ProductRepository {
  static async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await executeQuery(
      `INSERT INTO products (id, name, brand, type, active_ingredient, concentration, unit_of_measure, cost_per_unit, supplier, registration_number, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product.name,
        product.brand,
        product.type,
        product.activeIngredient || null,
        product.concentration || null,
        product.unitOfMeasure,
        product.costPerUnit,
        product.supplier || null,
        product.registrationNumber || null,
        product.isActive
      ]
    );

    return id;
  }

  static async findById(id: string): Promise<Product | null> {
    const result = await executeQuery(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows.raw()[0];
    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      type: row.type,
      activeIngredient: row.active_ingredient,
      concentration: row.concentration,
      unitOfMeasure: row.unit_of_measure,
      costPerUnit: row.cost_per_unit,
      supplier: row.supplier,
      registrationNumber: row.registration_number,
      isActive: row.is_active === 1,
      createdAt: new Date(row.created_at)
    };
  }

  static async findAll(activeOnly: boolean = true): Promise<Product[]> {
    const query = activeOnly 
      ? 'SELECT * FROM products WHERE is_active = 1 ORDER BY name'
      : 'SELECT * FROM products ORDER BY name';
    
    const result = await executeQuery(query);

    return result.rows.raw().map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      type: row.type,
      activeIngredient: row.active_ingredient,
      concentration: row.concentration,
      unitOfMeasure: row.unit_of_measure,
      costPerUnit: row.cost_per_unit,
      supplier: row.supplier,
      registrationNumber: row.registration_number,
      isActive: row.is_active === 1,
      createdAt: new Date(row.created_at)
    }));
  }

  static async findByType(type: Product['type']): Promise<Product[]> {
    const result = await executeQuery(
      'SELECT * FROM products WHERE type = ? AND is_active = 1 ORDER BY name',
      [type]
    );

    return result.rows.raw().map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      type: row.type,
      activeIngredient: row.active_ingredient,
      concentration: row.concentration,
      unitOfMeasure: row.unit_of_measure,
      costPerUnit: row.cost_per_unit,
      supplier: row.supplier,
      registrationNumber: row.registration_number,
      isActive: row.is_active === 1,
      createdAt: new Date(row.created_at)
    }));
  }

  static async update(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.brand !== undefined) {
      fields.push('brand = ?');
      values.push(updates.brand);
    }
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.activeIngredient !== undefined) {
      fields.push('active_ingredient = ?');
      values.push(updates.activeIngredient);
    }
    if (updates.concentration !== undefined) {
      fields.push('concentration = ?');
      values.push(updates.concentration);
    }
    if (updates.unitOfMeasure !== undefined) {
      fields.push('unit_of_measure = ?');
      values.push(updates.unitOfMeasure);
    }
    if (updates.costPerUnit !== undefined) {
      fields.push('cost_per_unit = ?');
      values.push(updates.costPerUnit);
    }
    if (updates.supplier !== undefined) {
      fields.push('supplier = ?');
      values.push(updates.supplier);
    }
    if (updates.registrationNumber !== undefined) {
      fields.push('registration_number = ?');
      values.push(updates.registrationNumber);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await executeQuery(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async delete(id: string): Promise<void> {
    await executeQuery('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
  }

  static async search(searchTerm: string): Promise<Product[]> {
    const result = await executeQuery(
      `SELECT * FROM products 
       WHERE (name LIKE ? OR brand LIKE ? OR active_ingredient LIKE ?) 
       AND is_active = 1 
       ORDER BY name`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );

    return result.rows.raw().map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      type: row.type,
      activeIngredient: row.active_ingredient,
      concentration: row.concentration,
      unitOfMeasure: row.unit_of_measure,
      costPerUnit: row.cost_per_unit,
      supplier: row.supplier,
      registrationNumber: row.registration_number,
      isActive: row.is_active === 1,
      createdAt: new Date(row.created_at)
    }));
  }
}