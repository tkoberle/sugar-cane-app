import { executeQuery } from '../database/connection';

export const debugDatabase = {
  // List all tables
  async listTables() {
    const result = await executeQuery("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tables:', result.rows.raw());
    return result.rows.raw();
  },

  // Get table schema
  async getTableSchema(tableName: string) {
    const result = await executeQuery(`PRAGMA table_info(${tableName})`);
    console.log(`📊 Schema for ${tableName}:`, result.rows.raw());
    return result.rows.raw();
  },

  // Run custom query
  async query(sql: string, params: any[] = []) {
    try {
      const result = await executeQuery(sql, params);
      console.log(`🔍 Query: ${sql}`);
      console.log('📄 Results:', result.rows.raw());
      return result.rows.raw();
    } catch (error) {
      console.error('❌ Query error:', error);
      throw error;
    }
  },

  // Count records in all tables
  async getTableCounts() {
    const tables = await this.listTables();
    const counts = {};
    
    for (const table of tables) {
      try {
        const result = await executeQuery(`SELECT COUNT(*) as count FROM ${table.name}`);
        counts[table.name] = result.rows.raw()[0].count;
      } catch (error) {
        counts[table.name] = `Error: ${error.message}`;
      }
    }
    
    console.log('🔢 Table counts:', counts);
    return counts;
  },

  // Get recent products
  async getProducts() {
    return this.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 10');
  },

  // Get all plots
  async getPlots() {
    return this.query('SELECT * FROM plots ORDER BY number');
  }
};

// Global debug function for console access
(global as any).debugDB = debugDatabase;