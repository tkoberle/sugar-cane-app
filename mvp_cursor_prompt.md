# Sugar Cane Farm Management MVP - Cursor AI Prompt

Create a comprehensive React Native MVP application for sugar cane farm management based on real-world client data analysis. This app should focus on financial planning, plot optimization, and production cycle management.

## Project Overview
Build a production-ready mobile application that helps sugar cane farmers optimize their operations through data-driven decision making. The app is based on analysis of a real 168.69-hectare farm with 19 plots and 5-year production cycles.

## Core Architecture

### Technology Stack
- **React Native** with TypeScript
- **Redux Toolkit** for state management
- **SQLite** for local storage (react-native-sqlite-storage)
- **React Navigation** for navigation
- **React Hook Form** + Zod for forms and validation
- **React Native Maps** for plot visualization
- **Recharts** for analytics and charts
- **Date-fns** for date management

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── store/             # Redux store and slices
├── services/          # Business logic and calculations
├── database/          # SQLite schema and operations
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── constants/         # App constants
```

## Core Features to Implement

### 1. Plot Management System

#### Plot Entity Structure
```typescript
interface Plot {
  id: string;
  number: number;
  area: number;              // Variable sizes (0.48 to 32 hectares)
  currentCycle: number;      // 0=new, 1=first cut, etc.
  plantingDate: Date;
  lastHarvestDate?: Date;
  status: 'active' | 'reform' | 'rotation' | 'new';
  coordinates?: {lat: number, lng: number}[];
  soilType?: string;
  notes?: string;
}

interface CycleCategory {
  cycle: number;             // 0, 1, 2, 3, 4, 5
  name: string;             // "Primeiro Corte", "Segundo Corte", etc.
  expectedProductivity: number; // 110, 100, 90, 85, 80 ton/ha
  standardRevenue: number;   // Revenue per hectare
  standardCosts: number;     // Costs per hectare
}
```

#### Plot Management Features
- **Plot List:** Display all plots with key metrics (area, cycle, status)
- **Plot Details:** Individual plot information and history
- **Plot Grouping:** Group plots by cutting cycle for bulk operations
- **Map View:** Visual representation of plots with color-coding by cycle
- **Plot Creation/Editing:** Add new plots or modify existing ones

### 2. Production Cycle Management

#### Production Tracking
```typescript
interface Production {
  id: string;
  plotId: string;
  cycle: number;
  harvestDate: Date;
  tonnage: number;
  atr: number;              // Sugar content (ATR)
  revenue: number;
  costs: number;
  notes?: string;
}

interface ATRPayment {
  id: string;
  productionId: string;
  atrValue: number;
  pricePerKgATR: number;
  grossValue: number;
  deductions: {
    inss?: number;
    aplacana?: number;
    other?: number;
  };
  netValue: number;
  paymentDate: Date;
}
```

#### Cycle Management Features
- **Cycle Dashboard:** Overview of all cutting cycles
- **Productivity Tracking:** Actual vs expected yields
- **ATR Management:** Sugar content tracking and pricing
- **Revenue Calculations:** ATR-based payment calculations
- **Cycle Planning:** Plan next year's cutting schedule

### 3. Financial Planning System

#### Financial Entities
```typescript
interface SafraPlanning {
  id: string;
  year: string;             // "2025-26"
  startDate: Date;          // September
  endDate: Date;            // August
  previousRevenue: number;
  personalNeeds: number;
  availableBudget: number;
  plannedReforms: string[]; // Plot IDs
  status: 'planning' | 'active' | 'completed';
}

interface CashFlow {
  id: string;
  safraId: string;
  month: Date;
  revenue: number;
  expenses: number;
  balance: number;
  notes?: string;
}
```

#### Financial Features
- **Safra Planning:** Annual agricultural cycle planning
- **Budget Calculator:** Available investment calculation
- **Cash Flow Projections:** Monthly income/expense forecasts
- **Reform Planning:** Which plots to reform based on budget
- **ROI Analysis:** Return on investment by plot and cycle

### 4. Plot Optimization Engine

#### Optimization Algorithms
```typescript
interface OptimizationResult {
  currentEfficiency: number;
  optimizedStructure: {
    plotId: string;
    recommendedSize: number;
    mergeCandidates: string[];
    priorityScore: number;
  }[];
  projectedSavings: number;
  implementationPlan: {
    phase: number;
    actions: string[];
    cost: number;
    expectedROI: number;
  }[];
}
```

#### Optimization Features
- **Plot Analysis:** Identify inefficient plot sizes
- **Consolidation Recommendations:** Suggest plot mergers
- **Economic Modeling:** Calculate consolidation ROI
- **Implementation Planning:** Phased optimization approach

### 5. Input and Cost Management

#### Cost Tracking
```typescript
interface InputApplication {
  id: string;
  plotId: string;
  inputType: 'herbicide' | 'fertilizer' | 'pesticide' | 'fuel' | 'labor';
  product: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  applicationDate: Date;
  dosagePerHectare: number;
}

interface CostCategory {
  category: string;
  totalCost: number;
  costPerHectare: number;
  plots: string[];
}
```

## Screen Structure and Navigation

### Main Navigation Tabs
1. **Dashboard** - Overview and key metrics
2. **Plots** - Plot management and mapping
3. **Cycles** - Production cycle tracking
4. **Finance** - Financial planning and analysis
5. **Optimize** - Plot optimization tools

### Screen Hierarchy
```
Dashboard
├── Overview Cards (revenue, costs, efficiency)
├── Quick Actions
└── Recent Activities

Plots
├── Plot List
├── Plot Details
│   ├── Production History
│   ├── Cost History
│   └── Edit Plot
├── Map View
└── Add Plot

Cycles
├── Cycle Overview
├── Cycle Details
│   ├── Plot List
│   ├── Production Entry
│   └── ATR Tracking
└── Cycle Planning

Finance
├── Safra Planning
├── Budget Management
├── Cash Flow
├── ROI Analysis
└── Cost Analysis

Optimize
├── Plot Analysis
├── Consolidation Recommendations
├── Scenario Modeling
└── Implementation Plan
```

## Sample Data for Testing

### Plot Data (Based on Real Farm)
```typescript
const samplePlots: Plot[] = [
  { id: '1', number: 1, area: 1.29, currentCycle: 0, status: 'reform' },
  { id: '2', number: 2, area: 5.8, currentCycle: 0, status: 'reform' },
  { id: '3', number: 3, area: 11.51, currentCycle: 0, status: 'new' },
  { id: '4', number: 4, area: 15.28, currentCycle: 3, status: 'active' },
  { id: '5', number: 5, area: 17.04, currentCycle: 2, status: 'active' },
  { id: '6', number: 6, area: 3.34, currentCycle: 0, status: 'new' },
  { id: '7', number: 7, area: 20.73, currentCycle: 0, status: 'reform' },
  { id: '8', number: 8, area: 0.48, currentCycle: 3, status: 'active' },
  { id: '9', number: 9, area: 5.7, currentCycle: 5, status: 'active' },
  { id: '10', number: 10, area: 5.73, currentCycle: 5, status: 'active' },
  // ... continue with all 19 plots
];

const cycleCategoriesData: CycleCategory[] = [
  { cycle: 0, name: "Plantio Novo", expectedProductivity: 0, standardRevenue: 0, standardCosts: 365.38 },
  { cycle: 1, name: "Primeiro Corte", expectedProductivity: 110, standardRevenue: 19774.02, standardCosts: 1984.43 },
  { cycle: 2, name: "Segundo Corte", expectedProductivity: 100, standardRevenue: 17976.38, standardCosts: 1759.43 },
  { cycle: 3, name: "Terceiro Corte", expectedProductivity: 90, standardRevenue: 16178.75, standardCosts: 1674.44 },
  { cycle: 4, name: "Quarto Corte", expectedProductivity: 85, standardRevenue: 15279.93, standardCosts: 3734.20 },
  { cycle: 5, name: "Quinto Corte", expectedProductivity: 80, standardRevenue: 14381.11, standardCosts: 0 },
];
```

## Key Calculations and Business Logic

### 1. Financial Calculations
```typescript
// Available budget calculation
const calculateAvailableBudget = (previousRevenue: number, personalNeeds: number): number => {
  return Math.max(0, previousRevenue - personalNeeds);
};

// Plot reform cost calculation
const calculateReformCost = (area: number): number => {
  return area * 15000; // R$ 15,000 per hectare
};

// ATR-based revenue calculation
const calculateATRRevenue = (tonnage: number, atr: number, pricePerKgATR: number): number => {
  const totalATR = tonnage * 1000 * (atr / 100); // Convert to kg ATR
  return totalATR * pricePerKgATR;
};

// Productivity degradation
const calculateExpectedProductivity = (baseLine: number, cycle: number): number => {
  const degradationRates = [0, 0, 0.091, 0.10, 0.056, 0.059]; // Based on real data
  const totalDegradation = degradationRates.slice(0, cycle + 1).reduce((acc, rate) => acc * (1 - rate), 1);
  return baseLine * totalDegradation;
};
```

### 2. Optimization Algorithms
```typescript
// Plot consolidation analysis
const analyzePlotConsolidation = (plots: Plot[]): OptimizationResult => {
  const inefficientPlots = plots.filter(p => p.area < 5); // Small plots
  const consolidationCandidates = findAdjacentPlots(inefficientPlots);
  const projectedSavings = calculateConsolidationSavings(consolidationCandidates);
  
  return {
    currentEfficiency: calculateCurrentEfficiency(plots),
    optimizedStructure: generateOptimizedStructure(plots),
    projectedSavings,
    implementationPlan: createImplementationPlan(consolidationCandidates)
  };
};

// ROI calculation for reforms
const calculateReformROI = (plot: Plot, currentCycle: number): number => {
  const reformCost = calculateReformCost(plot.area);
  const currentProductivity = calculateExpectedProductivity(110, currentCycle);
  const newProductivity = 110; // Reset to first cut
  const productivityGain = newProductivity - currentProductivity;
  const annualRevenue = productivityGain * plot.area * 1.212; // Price per kg ATR
  
  return annualRevenue / reformCost; // Simple ROI
};
```

## UI/UX Guidelines

### Design System
- **Primary Color:** Green (#2E7D32) - Representing agriculture
- **Secondary Color:** Orange (#F57C00) - Representing harvest/productivity
- **Accent Color:** Blue (#1976D2) - For financial/data elements
- **Background:** Light gray (#F5F5F5)
- **Cards:** White with subtle shadows

### Component Examples
```typescript
// Plot Status Card
const PlotCard = ({ plot }: { plot: Plot }) => (
  <View style={styles.plotCard}>
    <Text style={styles.plotNumber}>Talhão {plot.number}</Text>
    <Text style={styles.plotArea}>{plot.area} ha</Text>
    <Text style={styles.plotCycle}>
      {cycleCategoriesData[plot.currentCycle]?.name}
    </Text>
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plot.status) }]}>
      <Text style={styles.statusText}>{plot.status}</Text>
    </View>
  </View>
);

// Financial Summary Card
const FinancialSummaryCard = ({ safra }: { safra: SafraPlanning }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.cardTitle}>Safra {safra.year}</Text>
    <View style={styles.financialRow}>
      <Text>Receita Anterior:</Text>
      <Text style={styles.amount}>R$ {formatCurrency(safra.previousRevenue)}</Text>
    </View>
    <View style={styles.financialRow}>
      <Text>Necessidades Pessoais:</Text>
      <Text style={styles.expense}>R$ {formatCurrency(safra.personalNeeds)}</Text>
    </View>
    <View style={styles.financialRow}>
      <Text>Orçamento Disponível:</Text>
      <Text style={styles.available}>R$ {formatCurrency(safra.availableBudget)}</Text>
    </View>
  </View>
);
```

## Database Schema (SQLite)

```sql
-- Plots table
CREATE TABLE plots (
  id TEXT PRIMARY KEY,
  number INTEGER UNIQUE,
  area REAL NOT NULL,
  current_cycle INTEGER DEFAULT 0,
  planting_date TEXT,
  last_harvest_date TEXT,
  status TEXT DEFAULT 'active',
  coordinates TEXT, -- JSON string
  soil_type TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Production records
CREATE TABLE productions (
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
);

-- Safra planning
CREATE TABLE safra_planning (
  id TEXT PRIMARY KEY,
  year TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  previous_revenue REAL NOT NULL,
  personal_needs REAL NOT NULL,
  available_budget REAL NOT NULL,
  status TEXT DEFAULT 'planning',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Input applications
CREATE TABLE input_applications (
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
);
```

## Performance Requirements
- App launch time: < 3 seconds
- Plot list rendering: < 1 second for 50+ plots
- Financial calculations: < 500ms for complex scenarios
- Map rendering: Smooth performance with 20+ plot overlays
- Database queries: < 100ms for standard operations

## Testing Data and Scenarios
Include comprehensive test data representing:
- Multiple safra cycles (2023-24, 2024-25, 2025-26)
- Various plot sizes and cycles
- Real financial scenarios from spreadsheet analysis
- Optimization test cases with measurable improvements

## Offline Functionality
- Core features work without internet
- Data sync when connection available
- Local SQLite database as single source of truth
- Export functionality for backup

## Implementation Status (Updated August 26 2025)

### ✅ **COMPLETED FEATURES**

#### **Plot Management System - FULLY IMPLEMENTED**
- **✅ Plot Creation Form**: Complete form with validation using React Hook Form + Zod
- **✅ Sequential Auto-Numbering**: Automatic plot number assignment (next highest + 1)
- **✅ Plot Names**: Optional descriptive names for plots (e.g., "Talhão da Várzea")
- **✅ Read-Only Plot Numbers**: Numbers auto-generated, not user-editable
- **✅ Real-time Calculations**: Productivity estimates and revenue projections
- **✅ Plot Cards Enhancement**: Display format "# - Plot Name" with text truncation
- **✅ Database Integration**: Full CRUD operations with SQLite
- **✅ Sample Data**: 19 realistic plots with Brazilian farm data
- **✅ Data Seeding**: Automatic population of sample data on mobile

#### **Technical Infrastructure - IMPLEMENTED**
- **✅ Database Schema**: Complete SQLite schema with migrations
- **✅ Redux Store**: Async actions for plot management with TypeScript
- **✅ Form Validation**: Comprehensive validation with error handling
- **✅ Cross-Platform**: Web mock database + mobile SQLite support
- **✅ UI Components**: Reusable form components and plot cards

### **Key Technical Achievements**

1. **Auto-Sequential Numbering System**
   ```typescript
   static async getNextPlotNumber(): Promise<number> {
     const result = await executeQuery('SELECT MAX(number) as maxNumber FROM plots');
     const maxNumber = result.rows.raw()[0]?.maxNumber || 0;
     return maxNumber + 1;
   }
   ```

2. **Enhanced Plot Interface**
   ```typescript
   interface Plot {
     id: string;
     number: number;        // Auto-generated sequentially
     name?: string;         // Optional descriptive name
     area: number;
     currentCycle: number;
     // ... other fields
   }
   ```

3. **Improved Plot Cards Display**
   - Format: "1 - Talhão da Entrada" (number first, then name)
   - Text truncation to prevent overflow
   - Responsive layout for various name lengths

### 🔄 **IN PROGRESS**
- **Production Data Entry Forms**: Plot selection, ATR calculation, photo capture

### 📋 **PENDING IMPLEMENTATION**
- Financial Planning Screens
- Plot Optimization Engine
- Data Visualization Charts
- GPS Coordinate Mapping
- Export Functionality

## Success Metrics
1. **Functional:** All features work as specified
2. **Performance:** Meets performance requirements
3. **Usability:** Intuitive for non-technical users
4. **Accuracy:** Financial calculations match spreadsheet
5. **Scalability:** Handles 100+ plots efficiently

## Current Development Focus
The foundation is solid with complete plot management. Next priority is implementing production data entry forms to enable farmers to track harvest data, ATR (sugar content), and calculate revenues in real-time.

Generate a complete, production-ready React Native application following these specifications. Focus on creating a solid architectural foundation that can be extended while delivering immediate value for sugar cane farm management.