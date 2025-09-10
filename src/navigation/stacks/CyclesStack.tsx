import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CyclesStackParamList } from '../../types';
import CycleOverviewScreen from '../../screens/Cycles/CycleOverviewScreen';
import CycleDetailsScreen from '../../screens/Cycles/CycleDetailsScreen';
import ProductionEntryScreen from '../../screens/Cycles/ProductionEntryScreen';
import ATRTrackingScreen from '../../screens/Cycles/ATRTrackingScreen';
import CyclePlanningScreen from '../../screens/Cycles/CyclePlanningScreen';
import CategoryManagementScreen from '../../screens/Cycles/CategoryManagementScreen';
import CategoryFormScreen from '../../screens/Cycles/CategoryFormScreen';
import ProductListScreen from '../../screens/Products/ProductListScreen';
import ProductFormScreen from '../../screens/Products/ProductFormScreen';
import ProductDetailsScreen from '../../screens/Products/ProductDetailsScreen';

const Stack = createNativeStackNavigator<CyclesStackParamList>();

const CyclesStack: React.FC = () => {
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
        name="CycleOverview" 
        component={CycleOverviewScreen}
        options={{ title: 'Ciclos de Produção' }}
      />
      <Stack.Screen 
        name="CycleDetails" 
        component={CycleDetailsScreen}
        options={{ title: 'Detalhes do Ciclo' }}
      />
      <Stack.Screen 
        name="ProductionEntry" 
        component={ProductionEntryScreen}
        options={{ title: 'Registrar Produção' }}
      />
      <Stack.Screen 
        name="ATRTracking" 
        component={ATRTrackingScreen}
        options={{ title: 'Acompanhar ATR' }}
      />
      <Stack.Screen 
        name="CyclePlanning" 
        component={CyclePlanningScreen}
        options={{ title: 'Planejamento de Ciclos' }}
      />
      <Stack.Screen 
        name="CategoryManagement" 
        component={CategoryManagementScreen}
        options={{ title: 'Gerenciar Categorias' }}
      />
      <Stack.Screen 
        name="CategoryForm" 
        component={CategoryFormScreen}
        options={{ title: 'Categoria' }}
      />
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Produtos Agrícolas' }}
      />
      <Stack.Screen 
        name="ProductForm" 
        component={ProductFormScreen}
        options={{ title: 'Cadastro de Produto' }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={{ title: 'Detalhes do Produto' }}
      />
    </Stack.Navigator>
  );
};

export default CyclesStack;