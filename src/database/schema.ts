export const createTablesSQL = [
  // Plots table
  `CREATE TABLE IF NOT EXISTS plots (
    id TEXT PRIMARY KEY,
    number INTEGER UNIQUE,
    name TEXT,
    area REAL NOT NULL,
    current_cycle INTEGER DEFAULT 0,
    planting_date TEXT,
    last_harvest_date TEXT,
    status TEXT DEFAULT 'active',
    coordinates TEXT,
    soil_type TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Production records
  `CREATE TABLE IF NOT EXISTS productions (
    id TEXT PRIMARY KEY,
    plot_id TEXT REFERENCES plots(id),
    cycle INTEGER NOT NULL,
    harvest_date TEXT NOT NULL,
    tonnage REAL NOT NULL,
    atr REAL NOT NULL,
    revenue REAL NOT NULL,
    costs REAL NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // ATR payments
  `CREATE TABLE IF NOT EXISTS atr_payments (
    id TEXT PRIMARY KEY,
    production_id TEXT REFERENCES productions(id),
    atr_value REAL NOT NULL,
    price_per_kg_atr REAL NOT NULL,
    gross_value REAL NOT NULL,
    deductions_inss REAL DEFAULT 0,
    deductions_aplacana REAL DEFAULT 0,
    deductions_other REAL DEFAULT 0,
    net_value REAL NOT NULL,
    payment_date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Safra planning
  `CREATE TABLE IF NOT EXISTS safra_planning (
    id TEXT PRIMARY KEY,
    year TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    previous_revenue REAL NOT NULL,
    personal_needs REAL NOT NULL,
    available_budget REAL NOT NULL,
    planned_reforms TEXT,
    status TEXT DEFAULT 'planning',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Cash flow
  `CREATE TABLE IF NOT EXISTS cash_flow (
    id TEXT PRIMARY KEY,
    safra_id TEXT REFERENCES safra_planning(id),
    month TEXT NOT NULL,
    revenue REAL NOT NULL,
    expenses REAL NOT NULL,
    balance REAL NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Input applications
  `CREATE TABLE IF NOT EXISTS input_applications (
    id TEXT PRIMARY KEY,
    plot_id TEXT REFERENCES plots(id),
    input_type TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit_cost REAL NOT NULL,
    total_cost REAL NOT NULL,
    application_date TEXT NOT NULL,
    dosage_per_hectare REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Cycle categories (reference data)
  `CREATE TABLE IF NOT EXISTS cycle_categories (
    cycle INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    expected_productivity REAL NOT NULL,
    standard_revenue REAL NOT NULL,
    standard_costs REAL NOT NULL
  )`
];

export const insertCycleCategoriesSQL = `
  INSERT OR REPLACE INTO cycle_categories (cycle, name, expected_productivity, standard_revenue, standard_costs) VALUES
  (0, 'Plantio Novo', 0, 0, 365.38),
  (1, 'Primeiro Corte', 110, 19774.02, 1984.43),
  (2, 'Segundo Corte', 100, 17976.38, 1759.43),
  (3, 'Terceiro Corte', 90, 16178.75, 1674.44),
  (4, 'Quarto Corte', 85, 15279.93, 3734.20),
  (5, 'Quinto Corte', 80, 14381.11, 0)
`;

export const createIndexesSQL = [
  'CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status)',
  'CREATE INDEX IF NOT EXISTS idx_plots_cycle ON plots(current_cycle)',
  'CREATE INDEX IF NOT EXISTS idx_productions_plot ON productions(plot_id)',
  'CREATE INDEX IF NOT EXISTS idx_productions_cycle ON productions(cycle)',
  'CREATE INDEX IF NOT EXISTS idx_atr_payments_production ON atr_payments(production_id)',
  'CREATE INDEX IF NOT EXISTS idx_cash_flow_safra ON cash_flow(safra_id)',
  'CREATE INDEX IF NOT EXISTS idx_input_applications_plot ON input_applications(plot_id)'
];