import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlotsStackParamList } from '../../types';
import PlotListScreen from '../../screens/Plots/PlotListScreen';
import PlotDetailsScreen from '../../screens/Plots/PlotDetailsScreen';
import PlotEditScreen from '../../screens/Plots/PlotEditScreen';
import MapViewScreen from '../../screens/Plots/MapViewScreen';

const Stack = createNativeStackNavigator<PlotsStackParamList>();

const PlotsStack: React.FC = () => {
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
        name="PlotList" 
        component={PlotListScreen}
        options={{ title: 'Talhões' }}
      />
      <Stack.Screen 
        name="PlotDetails" 
        component={PlotDetailsScreen}
        options={{ title: 'Detalhes do Talhão' }}
      />
      <Stack.Screen 
        name="PlotEdit" 
        component={PlotEditScreen}
        options={({ route }) => ({ 
          title: route.params?.plotId ? 'Editar Talhão' : 'Novo Talhão'
        })}
      />
      <Stack.Screen 
        name="MapView" 
        component={MapViewScreen}
        options={{ title: 'Mapa dos Talhões' }}
      />
    </Stack.Navigator>
  );
};

export default PlotsStack;