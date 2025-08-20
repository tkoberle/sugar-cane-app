import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';

// Import stack navigators
import DashboardStack from './stacks/DashboardStack';
import PlotsStack from './stacks/PlotsStack';
import CyclesStack from './stacks/CyclesStack';
import FinanceStack from './stacks/FinanceStack';
import OptimizeStack from './stacks/OptimizeStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Plots':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Cycles':
              iconName = focused ? 'refresh-circle' : 'refresh-circle-outline';
              break;
            case 'Finance':
              iconName = focused ? 'cash' : 'cash-outline';
              break;
            case 'Optimize':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Plots" 
        component={PlotsStack}
        options={{ title: 'Talhões' }}
      />
      <Tab.Screen 
        name="Cycles" 
        component={CyclesStack}
        options={{ title: 'Ciclos' }}
      />
      <Tab.Screen 
        name="Finance" 
        component={FinanceStack}
        options={{ title: 'Finanças' }}
      />
      <Tab.Screen 
        name="Optimize" 
        component={OptimizeStack}
        options={{ title: 'Otimizar' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;