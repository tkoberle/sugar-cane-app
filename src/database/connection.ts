import { Platform } from 'react-native';
import { createTablesSQL, insertCycleCategoriesSQL, createIndexesSQL } from './schema';

// Platform-specific SQLite import
let SQLite: any;

if (Platform.OS === 'web') {
  // For web, we'll use a mock implementation
  SQLite = {
    openDatabaseAsync: () => Promise.resolve({
      execAsync: () => Promise.resolve([]),
      getAllAsync: () => Promise.resolve([]),
      getFirstAsync: () => Promise.resolve(null),
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
      // Mock result for web
      return { rows: { raw: () => [], length: 0, item: () => ({}) } };
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