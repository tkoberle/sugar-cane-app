import { Platform } from 'react-native';
import { createTablesSQL, insertCycleCategoriesSQL, createIndexesSQL } from './schema';

// Platform-specific SQLite import
let SQLite: any;

if (Platform.OS === 'web') {
  // For web, we'll use a mock implementation or IndexedDB wrapper
  // In a production app, you might use sql.js or another web-compatible solution
  SQLite = {
    openDatabase: () => Promise.resolve({
      executeSql: () => Promise.resolve([{ rows: { raw: () => [], length: 0, item: () => ({}) } }]),
      close: () => Promise.resolve(),
    }),
  };
} else {
  SQLite = require('react-native-sqlite-storage');
  SQLite.DEBUG(false);
  SQLite.enablePromise(true);
}

const DATABASE_NAME = 'SugarCaneApp.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAYNAME = 'Sugar Cane Farm Management Database';
const DATABASE_SIZE = 200000;

let db: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabase(
      DATABASE_NAME,
      DATABASE_VERSION,
      DATABASE_DISPLAYNAME,
      DATABASE_SIZE
    );

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
    // Create tables
    for (const sql of createTablesSQL) {
      await db.executeSql(sql);
    }

    // Insert cycle categories reference data
    await db.executeSql(insertCycleCategoriesSQL);

    // Create indexes
    for (const sql of createIndexesSQL) {
      await db.executeSql(sql);
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
      await db.close();
      db = null;
      console.log('Database closed successfully');
    } catch (error) {
      console.error('Error closing database:', error);
      throw error;
    }
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call openDatabase first.');
  }
  return db;
};

export const executeQuery = async (
  query: string,
  params: any[] = []
): Promise<SQLite.SQLiteResultSet> => {
  const database = getDatabase();
  try {
    const result = await database.executeSql(query, params);
    return result[0];
  } catch (error) {
    console.error('Error executing query:', query, error);
    throw error;
  }
};