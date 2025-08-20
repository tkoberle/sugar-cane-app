# Sugar Cane Farm Management MVP

A comprehensive React Native application for sugar cane farm management with plot tracking, production cycles, financial planning, and optimization tools. Built with TypeScript, Redux, SQLite, and Brazilian agricultural best practices.

## 🌱 Overview

This application provides a complete digital solution for managing sugar cane farming operations, specifically designed for Brazilian agricultural practices. It handles everything from individual plot management to financial planning and optimization recommendations.

### Key Features

- **Plot Management**: Track 19+ plots with varying sizes (0.48 to 32 hectares)
- **Production Cycles**: Monitor 5-year cutting cycles with productivity degradation tracking
- **Financial Planning**: Calculate ROI, reform costs, and ATR-based revenue
- **Optimization Engine**: Analyze plot consolidation opportunities and efficiency improvements
- **Offline-First**: SQLite database for reliable data storage
- **Cross-Platform**: Runs on iOS, Android, and web

## 🏗️ Technical Architecture

### Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Database**: SQLite (react-native-sqlite-storage)
- **Navigation**: React Navigation v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: React Native Chart Kit
- **Maps**: React Native Maps (future implementation)

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Card, StatusBadge, LoadingSpinner)
│   └── PlotCard.tsx    # Plot-specific components
├── screens/            # Screen components organized by feature
│   ├── Dashboard/      # Farm overview and metrics
│   ├── Plots/          # Plot management screens
│   ├── Cycles/         # Production cycle tracking
│   ├── Finance/        # Financial planning tools
│   └── Optimize/       # Optimization analysis
├── navigation/         # Navigation configuration
│   ├── TabNavigator.tsx
│   └── stacks/         # Feature-specific stack navigators
├── store/             # Redux store and slices
│   ├── slices/        # Feature-specific Redux slices
│   └── hooks.ts       # Typed Redux hooks
├── services/          # Business logic and calculations
│   ├── FinancialCalculations.ts
│   ├── OptimizationEngine.ts
│   └── DataSeeder.ts
├── database/          # SQLite schema and operations
│   ├── connection.ts  # Database setup and connection
│   ├── schema.ts      # Table definitions
│   └── models/        # Repository pattern implementations
├── types/             # TypeScript type definitions
│   ├── entities.ts    # Business entity types
│   └── navigation.ts  # Navigation type safety
├── utils/             # Helper functions and formatters
├── constants/         # App constants and sample data
└── ...
```

## 📊 Data Model

### Core Entities

#### Plot
```typescript
interface Plot {
  id: string;
  number: number;
  area: number;              // Hectares
  currentCycle: number;      // 0=new, 1-5=cutting cycles
  plantingDate: Date;
  lastHarvestDate?: Date;
  status: 'active' | 'reform' | 'rotation' | 'new';
  coordinates?: {lat: number, lng: number}[];
  soilType?: string;
  notes?: string;
}
```

#### Production
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
```

#### Financial Planning
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
```

## 🧮 Business Logic

### Financial Calculations

#### Key Algorithms
- **Reform ROI**: `calculateReformROI(plot, currentCycle)`
- **ATR Revenue**: `calculateATRRevenue(tonnage, atr, pricePerKgATR)`
- **Productivity Degradation**: Based on real-world degradation rates
- **Available Budget**: `calculateAvailableBudget(previousRevenue, personalNeeds)`

#### Productivity Degradation Model
```typescript
const degradationRates = [0, 0, 0.091, 0.10, 0.056, 0.059];
// Cycle 0: New planting (0% degradation)
// Cycle 1: First cut (0% degradation)
// Cycle 2: Second cut (9.1% degradation)
// Cycle 3: Third cut (10% degradation)
// Cycle 4: Fourth cut (5.6% degradation)
// Cycle 5: Fifth cut (5.9% degradation)
```

### Optimization Engine

#### Plot Consolidation Analysis
- Identifies plots smaller than 5 hectares as consolidation candidates
- Calculates adjacency based on plot numbers and coordinates
- Estimates operational savings from reduced overhead
- Provides implementation planning with phased approach

#### Priority Scoring Algorithm
```typescript
// Priority factors:
// - Plot size (smaller = higher priority)
// - Cycle age (older = higher priority)
// - Reform status (reform = highest priority)
// - Expected ROI (higher = higher priority)
```

## 💾 Database Schema

### SQLite Tables

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

-- Additional tables for safra_planning, cash_flow, 
-- input_applications, atr_payments, cycle_categories
```

## 🎨 UI/UX Design

### Design System
- **Primary Color**: Green (#2E7D32) - Agricultural theme
- **Secondary Color**: Orange (#F57C00) - Harvest/productivity
- **Accent Color**: Blue (#1976D2) - Financial/data elements
- **Background**: Light gray (#F5F5F5)

### Component Architecture
- **Card-based Layout**: Consistent card components for data display
- **Status Indicators**: Color-coded badges for plot status and cycles
- **Brazilian Terminology**: All UI text in Portuguese for local users
- **Responsive Design**: Works on mobile, tablet, and web

## 📱 Platform Support

### Mobile (React Native)
- **iOS**: Requires Xcode and iOS Simulator
- **Android**: Requires Android Studio and emulator

### Web (React Native Web)
- **Browser**: Chrome, Firefox, Safari, Edge
- **Note**: SQLite features are mocked for web compatibility

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/tkoberle/sugar-cane-app.git
cd sugar-cane-app

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start development server
npm run web      # Web development
npm run ios      # iOS simulator
npm run android  # Android emulator
```

### Development Commands

```bash
npm run web      # Start web development server
npm run ios      # Start iOS development
npm run android  # Start Android development
npm start        # Start Expo development server
```

## 📊 Sample Data

The application includes realistic sample data representing a 168.69-hectare sugar cane farm with:

- **19 plots** with varying sizes (0.48 to 32 hectares)
- **Different production cycles** (0-5) representing real farming scenarios
- **Various plot statuses** (active, reform, new, rotation)
- **Brazilian soil types** (Latossolo Vermelho, Argissolo, etc.)
- **Realistic dates** for planting and harvesting

### Farm Statistics
- **Total Area**: 168.69 hectares
- **Largest Plot**: 32.15 hectares (Plot #18)
- **Smallest Plot**: 0.48 hectares (Plot #8)
- **Average Plot Size**: 8.88 hectares
- **Plots in Reform**: 3 plots (27.82 hectares)
- **Active Production**: 13 plots (127.36 hectares)

## 🔧 Future Enhancements

### Planned Features
- **GPS Integration**: Real plot coordinate mapping
- **Weather API**: Integration with Brazilian weather services
- **Export Features**: PDF reports and Excel exports
- **Multi-farm Support**: Manage multiple properties
- **Advanced Analytics**: Machine learning for yield prediction
- **Offline Sync**: Cloud synchronization when online

### Technical Improvements
- **Performance Optimization**: Virtual scrolling for large datasets
- **Real-time Updates**: WebSocket integration for live data
- **Testing Suite**: Unit tests and integration tests
- **CI/CD Pipeline**: Automated testing and deployment
- **Documentation**: Comprehensive API documentation

## 📄 License

This project is proprietary software developed for sugar cane farm management.

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the repository owner.

## 📞 Support

For technical support or questions about the agricultural algorithms, please open an issue in this repository.

---

**Built with ❤️ for Brazilian Sugar Cane Farmers**

*This application incorporates real-world agricultural data and practices specific to Brazilian sugar cane farming operations.*