import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScenarioModelingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Modelagem de Cenários - Em desenvolvimento</Text>
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

export default ScenarioModelingScreen;
