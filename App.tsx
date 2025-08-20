import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { openDatabase } from './src/database';
import { DataSeeder } from './src/services/DataSeeder';
import RootNavigator from './src/navigation';

export default function App() {
  useEffect(() => {
    // Initialize database when app starts
    const initDB = async () => {
      try {
        await openDatabase();
        console.log('Database initialized successfully');
        
        // Seed database with sample data
        await DataSeeder.seedDatabase();
        console.log('Database seeding completed');
        
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initDB();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}