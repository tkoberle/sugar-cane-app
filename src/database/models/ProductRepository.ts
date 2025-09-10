import { executeQuery } from '../connection';
import { Product } from '../../types/entities';

export class ProductRepository {
  static async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await executeQuery(
      `INSERT INTO products (
        id, name, brand, category, type, registration_number, mapa_classification,
        active_ingredient, concentration, formulation_type, activity, fertilizer_type,
        species, guarantee, physical_nature, unit_of_measure, cost_per_unit,
        package_size, supplier, manufacturer, application_method, min_dosage,
        max_dosage, dosage_unit, target_crops, target_pests, toxic_class,
        environmental_class, withdrawal_period, reentry_period, description,
        technical_data_sheet, safety_data_sheet, notes, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product.name,
        product.brand,
        product.category,
        product.type,
        product.registrationNumber || null,
        product.mapaClassification || null,
        product.activeIngredient || null,
        product.concentration || null,
        product.formulationType || null,
        product.activity || null,
        product.fertilizerType || null,
        product.species || null,
        product.guarantee || null,
        product.physicalNature || null,
        product.unitOfMeasure,
        product.costPerUnit,
        product.packageSize || null,
        product.supplier || null,
        product.manufacturer || null,
        product.applicationMethod ? JSON.stringify(product.applicationMethod) : null,
        product.recommendedDosage?.min || null,
        product.recommendedDosage?.max || null,
        product.recommendedDosage?.unit || null,
        product.targetCrops ? JSON.stringify(product.targetCrops) : null,
        product.targetPests ? JSON.stringify(product.targetPests) : null,
        product.toxicClass || null,
        product.environmentalClass || null,
        product.withdrawalPeriod || null,
        product.reentryPeriod || null,
        product.description || null,
        product.technicalDataSheet || null,
        product.safetyDataSheet || null,
        product.notes || null,
        product.isActive,
        now,
        now
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
    return this.mapRowToProduct(row);
  }

  private static mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      type: row.type,
      registrationNumber: row.registration_number,
      mapaClassification: row.mapa_classification,
      activeIngredient: row.active_ingredient,
      concentration: row.concentration,
      formulationType: row.formulation_type,
      activity: row.activity,
      fertilizerType: row.fertilizer_type,
      species: row.species,
      guarantee: row.guarantee,
      physicalNature: row.physical_nature,
      unitOfMeasure: row.unit_of_measure,
      costPerUnit: row.cost_per_unit,
      packageSize: row.package_size,
      supplier: row.supplier,
      manufacturer: row.manufacturer,
      applicationMethod: row.application_method ? JSON.parse(row.application_method) : undefined,
      recommendedDosage: (row.min_dosage || row.max_dosage || row.dosage_unit) ? {
        min: row.min_dosage,
        max: row.max_dosage,
        unit: row.dosage_unit,
      } : undefined,
      targetCrops: row.target_crops ? JSON.parse(row.target_crops) : undefined,
      targetPests: row.target_pests ? JSON.parse(row.target_pests) : undefined,
      toxicClass: row.toxic_class,
      environmentalClass: row.environmental_class,
      withdrawalPeriod: row.withdrawal_period,
      reentryPeriod: row.reentry_period,
      description: row.description,
      technicalDataSheet: row.technical_data_sheet,
      safetyDataSheet: row.safety_data_sheet,
      notes: row.notes,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findAll(activeOnly: boolean = true): Promise<Product[]> {
    const query = activeOnly 
      ? 'SELECT * FROM products WHERE is_active = 1 ORDER BY name'
      : 'SELECT * FROM products ORDER BY name';
    
    const result = await executeQuery(query);

    return result.rows.raw().map(row => this.mapRowToProduct(row));
  }

  static async findByCategory(category: Product['category']): Promise<Product[]> {
    const result = await executeQuery(
      'SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY name',
      [category]
    );

    return result.rows.raw().map(row => this.mapRowToProduct(row));
  }

  static async findByType(type: Product['type']): Promise<Product[]> {
    const result = await executeQuery(
      'SELECT * FROM products WHERE type = ? AND is_active = 1 ORDER BY name',
      [type]
    );

    return result.rows.raw().map(row => this.mapRowToProduct(row));
  }

  static async update(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    // Basic fields
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.brand !== undefined) {
      fields.push('brand = ?');
      values.push(updates.brand);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }

    // Brazilian regulatory fields
    if (updates.registrationNumber !== undefined) {
      fields.push('registration_number = ?');
      values.push(updates.registrationNumber);
    }
    if (updates.mapaClassification !== undefined) {
      fields.push('mapa_classification = ?');
      values.push(updates.mapaClassification);
    }
    if (updates.activeIngredient !== undefined) {
      fields.push('active_ingredient = ?');
      values.push(updates.activeIngredient);
    }
    if (updates.concentration !== undefined) {
      fields.push('concentration = ?');
      values.push(updates.concentration);
    }
    if (updates.formulationType !== undefined) {
      fields.push('formulation_type = ?');
      values.push(updates.formulationType);
    }

    // EMBRAPA fields
    if (updates.activity !== undefined) {
      fields.push('activity = ?');
      values.push(updates.activity);
    }
    if (updates.fertilizerType !== undefined) {
      fields.push('fertilizer_type = ?');
      values.push(updates.fertilizerType);
    }
    if (updates.species !== undefined) {
      fields.push('species = ?');
      values.push(updates.species);
    }
    if (updates.guarantee !== undefined) {
      fields.push('guarantee = ?');
      values.push(updates.guarantee);
    }
    if (updates.physicalNature !== undefined) {
      fields.push('physical_nature = ?');
      values.push(updates.physicalNature);
    }

    // Commercial fields
    if (updates.unitOfMeasure !== undefined) {
      fields.push('unit_of_measure = ?');
      values.push(updates.unitOfMeasure);
    }
    if (updates.costPerUnit !== undefined) {
      fields.push('cost_per_unit = ?');
      values.push(updates.costPerUnit);
    }
    if (updates.packageSize !== undefined) {
      fields.push('package_size = ?');
      values.push(updates.packageSize);
    }
    if (updates.supplier !== undefined) {
      fields.push('supplier = ?');
      values.push(updates.supplier);
    }
    if (updates.manufacturer !== undefined) {
      fields.push('manufacturer = ?');
      values.push(updates.manufacturer);
    }

    // Technical fields
    if (updates.applicationMethod !== undefined) {
      fields.push('application_method = ?');
      values.push(updates.applicationMethod ? JSON.stringify(updates.applicationMethod) : null);
    }
    if (updates.recommendedDosage !== undefined) {
      fields.push('min_dosage = ?');
      fields.push('max_dosage = ?');
      fields.push('dosage_unit = ?');
      values.push(updates.recommendedDosage?.min || null);
      values.push(updates.recommendedDosage?.max || null);
      values.push(updates.recommendedDosage?.unit || null);
    }
    if (updates.targetCrops !== undefined) {
      fields.push('target_crops = ?');
      values.push(updates.targetCrops ? JSON.stringify(updates.targetCrops) : null);
    }
    if (updates.targetPests !== undefined) {
      fields.push('target_pests = ?');
      values.push(updates.targetPests ? JSON.stringify(updates.targetPests) : null);
    }

    // Safety fields
    if (updates.toxicClass !== undefined) {
      fields.push('toxic_class = ?');
      values.push(updates.toxicClass);
    }
    if (updates.environmentalClass !== undefined) {
      fields.push('environmental_class = ?');
      values.push(updates.environmentalClass);
    }
    if (updates.withdrawalPeriod !== undefined) {
      fields.push('withdrawal_period = ?');
      values.push(updates.withdrawalPeriod);
    }
    if (updates.reentryPeriod !== undefined) {
      fields.push('reentry_period = ?');
      values.push(updates.reentryPeriod);
    }

    // Additional fields
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.technicalDataSheet !== undefined) {
      fields.push('technical_data_sheet = ?');
      values.push(updates.technicalDataSheet);
    }
    if (updates.safetyDataSheet !== undefined) {
      fields.push('safety_data_sheet = ?');
      values.push(updates.safetyDataSheet);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
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
       WHERE (name LIKE ? OR brand LIKE ? OR active_ingredient LIKE ? OR species LIKE ? OR registration_number LIKE ?) 
       AND is_active = 1 
       ORDER BY name`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );

    return result.rows.raw().map(row => this.mapRowToProduct(row));
  }
}