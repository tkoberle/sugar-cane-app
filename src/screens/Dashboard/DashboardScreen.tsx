import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPlots } from '../../store';
import { Card, LoadingSpinner } from '../../components/ui';
import { formatCurrency, formatArea, formatNumber } from '../../utils';
import { FinancialCalculations } from '../../services';

const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { plots, loading } = useAppSelector(state => state.plots);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPlots());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchPlots());
    setRefreshing(false);
  };

  if (loading && plots.length === 0) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  // Calculate summary metrics
  const totalArea = plots.reduce((sum, plot) => sum + plot.area, 0);
  const plotsByCycle = plots.reduce((acc, plot) => {
    acc[plot.currentCycle] = (acc[plot.currentCycle] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const plotsByStatus = plots.reduce((acc, plot) => {
    acc[plot.status] = (acc[plot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const estimatedRevenue = plots.reduce((sum, plot) => {
    // Simplified revenue calculation based on expected productivity
    const expectedProductivity = FinancialCalculations.calculateExpectedProductivity(110, plot.currentCycle);
    return sum + (expectedProductivity * plot.area * 1.212); // Price per ton
  }, 0);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Dashboard</Text>
      
      {/* Summary Cards */}
      <View style={styles.cardsGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Total de Talhões</Text>
          <Text style={styles.cardValue}>{plots.length}</Text>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Área Total</Text>
          <Text style={styles.cardValue}>{formatArea(totalArea)}</Text>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Receita Estimada</Text>
          <Text style={styles.cardValue}>{formatCurrency(estimatedRevenue)}</Text>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Área Média</Text>
          <Text style={styles.cardValue}>
            {formatArea(plots.length > 0 ? totalArea / plots.length : 0)}
          </Text>
        </Card>
      </View>

      {/* Cycle Distribution */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Distribuição por Ciclo</Text>
        {Object.entries(plotsByCycle).map(([cycle, count]) => (
          <View key={cycle} style={styles.distributionRow}>
            <Text style={styles.distributionLabel}>Ciclo {cycle}:</Text>
            <Text style={styles.distributionValue}>{count} talhões</Text>
          </View>
        ))}
      </Card>

      {/* Status Distribution */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Distribuição por Status</Text>
        {Object.entries(plotsByStatus).map(([status, count]) => (
          <View key={status} style={styles.distributionRow}>
            <Text style={styles.distributionLabel}>
              {status === 'active' ? 'Ativos' : 
               status === 'reform' ? 'Em reforma' : 
               status === 'new' ? 'Novos' : 
               status === 'rotation' ? 'Rotação' : status}:
            </Text>
            <Text style={styles.distributionValue}>{count} talhões</Text>
          </View>
        ))}
      </Card>

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <Text style={styles.quickAction}>• Registrar nova produção</Text>
        <Text style={styles.quickAction}>• Adicionar novo talhão</Text>
        <Text style={styles.quickAction}>• Planejar próxima safra</Text>
        <Text style={styles.quickAction}>• Analisar otimizações</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    margin: 16,
    marginBottom: 8,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 8,
  },
  summaryCard: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  distributionLabel: {
    fontSize: 14,
    color: '#666',
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  quickAction: {
    fontSize: 14,
    color: '#2E7D32',
    paddingVertical: 4,
  },
});

export default DashboardScreen;