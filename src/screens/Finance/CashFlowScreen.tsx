import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CashFlowScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fluxo de Caixa - Em desenvolvimento</Text>
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

export default CashFlowScreen;
