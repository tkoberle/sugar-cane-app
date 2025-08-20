import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../../types';
import SafraPlanningScreen from '../../screens/Finance/SafraPlanningScreen';
import BudgetManagementScreen from '../../screens/Finance/BudgetManagementScreen';
import CashFlowScreen from '../../screens/Finance/CashFlowScreen';
import ROIAnalysisScreen from '../../screens/Finance/ROIAnalysisScreen';
import CostAnalysisScreen from '../../screens/Finance/CostAnalysisScreen';

const Stack = createNativeStackNavigator<FinanceStackParamList>();

const FinanceStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SafraPlanning" 
        component={SafraPlanningScreen}
        options={{ title: 'Planejamento da Safra' }}
      />
      <Stack.Screen 
        name="BudgetManagement" 
        component={BudgetManagementScreen}
        options={{ title: 'Gestão de Orçamento' }}
      />
      <Stack.Screen 
        name="CashFlow" 
        component={CashFlowScreen}
        options={{ title: 'Fluxo de Caixa' }}
      />
      <Stack.Screen 
        name="ROIAnalysis" 
        component={ROIAnalysisScreen}
        options={{ title: 'Análise de ROI' }}
      />
      <Stack.Screen 
        name="CostAnalysis" 
        component={CostAnalysisScreen}
        options={{ title: 'Análise de Custos' }}
      />
    </Stack.Navigator>
  );
};

export default FinanceStack;