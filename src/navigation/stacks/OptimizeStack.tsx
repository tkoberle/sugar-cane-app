import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptimizeStackParamList } from '../../types';
import PlotAnalysisScreen from '../../screens/Optimize/PlotAnalysisScreen';
import ConsolidationRecommendationsScreen from '../../screens/Optimize/ConsolidationRecommendationsScreen';
import ScenarioModelingScreen from '../../screens/Optimize/ScenarioModelingScreen';
import ImplementationPlanScreen from '../../screens/Optimize/ImplementationPlanScreen';

const Stack = createNativeStackNavigator<OptimizeStackParamList>();

const OptimizeStack: React.FC = () => {
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
        name="PlotAnalysis" 
        component={PlotAnalysisScreen}
        options={{ title: 'Análise de Talhões' }}
      />
      <Stack.Screen 
        name="ConsolidationRecommendations" 
        component={ConsolidationRecommendationsScreen}
        options={{ title: 'Recomendações de Consolidação' }}
      />
      <Stack.Screen 
        name="ScenarioModeling" 
        component={ScenarioModelingScreen}
        options={{ title: 'Modelagem de Cenários' }}
      />
      <Stack.Screen 
        name="ImplementationPlan" 
        component={ImplementationPlanScreen}
        options={{ title: 'Plano de Implementação' }}
      />
    </Stack.Navigator>
  );
};

export default OptimizeStack;