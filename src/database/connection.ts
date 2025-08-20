import { Platform } from 'react-native';
import { createTablesSQL, insertCycleCategoriesSQL, createIndexesSQL } from './schema';

// Platform-specific SQLite import
let SQLite: any;

if (Platform.OS === 'web') {
  // For web, we'll use a mock implementation with sample data
  const { samplePlots } = require('../constants/sampleData');
  
  SQLite = {
    openDatabaseAsync: () => Promise.resolve({
      execAsync: () => Promise.resolve([]),
      getAllAsync: (query: string) => {
        // Mock plots data for web
        if (query.includes('FROM plots')) {
          return Promise.resolve(samplePlots.map(plot => ({
            id: plot.id,
            number: plot.number,
            area: plot.area,
            currentCycle: plot.currentCycle,
            plantingDate: plot.plantingDate.toISOString(),
            lastHarvestDate: plot.lastHarvestDate?.toISOString() || null,
            status: plot.status,
            coordinates: plot.coordinates ? JSON.stringify(plot.coordinates) : null,
            soilType: plot.soilType || null,
            notes: plot.notes || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })));
        }
        return Promise.resolve([]);
      },
      getFirstAsync: (query: string, params: any[] = []) => {
        if (query.includes('FROM plots') && params.length > 0) {
          const plotId = params[0];
          const plot = samplePlots.find(p => p.id === plotId);
          if (plot) {
            return Promise.resolve({
              id: plot.id,
              number: plot.number,
              area: plot.area,
              currentCycle: plot.currentCycle,
              plantingDate: plot.plantingDate.toISOString(),
              lastHarvestDate: plot.lastHarvestDate?.toISOString() || null,
              status: plot.status,
              coordinates: plot.coordinates ? JSON.stringify(plot.coordinates) : null,
              soilType: plot.soilType || null,
              notes: plot.notes || null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
        return Promise.resolve(null);
      },
      runAsync: () => Promise.resolve({ lastInsertRowId: 1, changes: 1 }),
      closeAsync: () => Promise.resolve(),
    }),
  };
} else {
  // For mobile, use expo-sqlite
  SQLite = require('expo-sqlite');
}

const DATABASE_NAME = 'SugarCaneApp.db';

let db: any = null;

export const openDatabase = async (): Promise<any> => {
  if (db) {
    return db;
  }

  try {
    if (Platform.OS === 'web') {
      db = await SQLite.openDatabaseAsync();
    } else {
      db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    }

    console.log('Database opened successfully');
    await initializeDatabase();
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

const initializeDatabase = async (): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    if (Platform.OS === 'web') {
      // Skip initialization on web (mock implementation)
      console.log('Web platform: skipping database initialization');
      return;
    }

    // Create tables
    for (const sql of createTablesSQL) {
      await db.execAsync(sql);
    }

    // Insert cycle categories reference data
    await db.execAsync(insertCycleCategoriesSQL);

    // Create indexes
    for (const sql of createIndexesSQL) {
      await db.execAsync(sql);
    }

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    try {
      if (Platform.OS !== 'web') {
        await db.closeAsync();
      }
      db = null;
      console.log('Database closed successfully');
    } catch (error) {
      console.error('Error closing database:', error);
      throw error;
    }
  }
};

export const getDatabase = (): any => {
  if (!db) {
    throw new Error('Database not initialized. Call openDatabase first.');
  }
  return db;
};

export const executeQuery = async (
  query: string,
  params: any[] = []
): Promise<any> => {
  const database = getDatabase();
  try {
    if (Platform.OS === 'web') {
      // Use the mock database for web
      if (query.trim().toLowerCase().startsWith('select')) {
        const result = await database.getAllAsync(query, params);
        return { rows: { raw: () => result, length: result.length, item: (index: number) => result[index] } };
      } else {
        const result = await database.runAsync(query, params);
        return { insertId: result.lastInsertRowId, rowsAffected: result.changes };
      }
    }
    
    if (query.trim().toLowerCase().startsWith('select')) {
      const result = await database.getAllAsync(query, params);
      return { rows: { raw: () => result, length: result.length, item: (index: number) => result[index] } };
    } else {
      const result = await database.runAsync(query, params);
      return { insertId: result.lastInsertRowId, rowsAffected: result.changes };
    }
  } catch (error) {
    console.error('Error executing query:', query, error);
    throw error;
  }
};