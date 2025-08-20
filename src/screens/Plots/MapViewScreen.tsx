import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapViewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map View Screen - Em desenvolvimento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});

export default MapViewScreen;