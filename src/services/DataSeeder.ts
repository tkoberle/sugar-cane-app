import { Platform } from 'react-native';
import { PlotRepository } from '../database';
import { samplePlots } from '../constants/sampleData';

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

      // Seed plots
      for (const plot of samplePlots) {
        const { id, createdAt, updatedAt, ...plotData } = plot;
        await PlotRepository.createPlot(plotData);
      }

      console.log(`Successfully seeded ${samplePlots.length} plots`);
      
      // You can add more seeding here for productions, etc.
      
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}