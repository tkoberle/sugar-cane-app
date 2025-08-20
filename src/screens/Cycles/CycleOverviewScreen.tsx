import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CycleOverviewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cycle Overview Screen - Em desenvolvimento</Text>
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

export default CycleOverviewScreen;