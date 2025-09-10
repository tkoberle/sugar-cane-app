import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Dashboard: undefined;
  Plots: undefined;
  Cycles: undefined;
  Finance: undefined;
  Optimize: undefined;
};

export type PlotsStackParamList = {
  PlotList: undefined;
  PlotDetails: { plotId: string };
  PlotEdit: { plotId?: string };
  MapView: undefined;
};

export type CyclesStackParamList = {
  CycleOverview: undefined;
  CycleDetails: { cycle: number };
  ProductionEntry: { plotId: string };
  ATRTracking: { productionId: string };
  CyclePlanning: undefined;
  CategoryManagement: undefined;
  CategoryForm: { categoryId?: string };
  ProductList: undefined;
  ProductForm: { productId?: string };
  ProductDetails: { productId: string };
};

export type FinanceStackParamList = {
  SafraPlanning: undefined;
  BudgetManagement: undefined;
  CashFlow: { safraId?: string };
  ROIAnalysis: undefined;
  CostAnalysis: undefined;
};

export type OptimizeStackParamList = {
  PlotAnalysis: undefined;
  ConsolidationRecommendations: undefined;
  ScenarioModeling: undefined;
  ImplementationPlan: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

export type PlotsStackScreenProps<T extends keyof PlotsStackParamList> = NativeStackScreenProps<
  PlotsStackParamList,
  T
>;

export type CyclesStackScreenProps<T extends keyof CyclesStackParamList> = NativeStackScreenProps<
  CyclesStackParamList,
  T
>;

export type FinanceStackScreenProps<T extends keyof FinanceStackParamList> = NativeStackScreenProps<
  FinanceStackParamList,
  T
>;

export type OptimizeStackScreenProps<T extends keyof OptimizeStackParamList> = NativeStackScreenProps<
  OptimizeStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}