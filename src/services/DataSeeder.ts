import { Platform } from 'react-native';
import { PlotRepository } from '../database';
import { executeQuery } from '../database/connection';
import { samplePlots } from '../constants/sampleData';
import { Plot } from '../types';

export class DataSeeder {
  static async seedDatabase(): Promise<void> {
    try {
      console.log('Starting database seeding...');
      
      // Skip seeding on web for now (would need different storage solution)
      if (Platform.OS === 'web') {
        console.log('Web platform detected, skipping database seeding');
        return;
      }
      
      // Check if data already exists
      const existingPlots = await PlotRepository.getAllPlots();
      if (existingPlots.length > 0) {
        console.log('Database already contains data, skipping seeding');
        return;
      }

      // Seed plots - bypass auto-numbering for sample data to preserve original numbers
      for (const plot of samplePlots) {
        const { id, createdAt, updatedAt, ...plotData } = plot;
        // Use direct SQL insert to preserve the original plot numbers
        await this.insertPlotWithNumber(plotData);
      }

      console.log(`Successfully seeded ${samplePlots.length} plots`);
      
      // You can add more seeding here for productions, etc.
      
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  private static async insertPlotWithNumber(plot: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const id = `plot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await executeQuery(`
      INSERT INTO plots (
        id, number, name, area, planting_date, last_harvest_date,
        status, coordinates, soil_type, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      plot.number,
      plot.name || null,
      plot.area,
      plot.plantingDate,
      plot.lastHarvestDate || null,
      plot.status,
      plot.coordinates ? JSON.stringify(plot.coordinates) : null,
      plot.soilType || null,
      plot.notes || null,
      now,
      now
    ]);
  }
}