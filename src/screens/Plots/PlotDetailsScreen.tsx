import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPlotById } from '../../store';
import { Card, StatusBadge, LoadingSpinner } from '../../components/ui';
import { formatArea, formatDate, getCycleColor } from '../../utils';
import { cycleCategoriesData } from '../../constants/cycleCategoriesData';
import { PlotsStackScreenProps } from '../../types';

type PlotDetailsScreenNavigationProp = PlotsStackScreenProps<'PlotDetails'>['navigation'];
type PlotDetailsScreenRouteProp = PlotsStackScreenProps<'PlotDetails'>['route'];

const PlotDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PlotDetailsScreenNavigationProp>();
  const route = useRoute<PlotDetailsScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { selectedPlot: plot, loading } = useAppSelector(state => state.plots);

  const { plotId } = route.params;

  useEffect(() => {
    dispatch(fetchPlotById(plotId));
  }, [dispatch, plotId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('PlotEdit', { plotId })}
          style={styles.headerButton}
        >
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, plotId]);

  if (loading || !plot) {
    return <LoadingSpinner message="Carregando detalhes do talhão..." />;
  }

  const cycleCategory = cycleCategoriesData.find(cat => cat.cycle === plot.currentCycle);
  const cycleColor = getCycleColor(plot.currentCycle);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.plotNumber}>Talhão {plot.number}</Text>
            <View style={[styles.cycleBadge, { backgroundColor: cycleColor }]}>
              <Text style={styles.cycleText}>{plot.currentCycle}</Text>
            </View>
          </View>
          <StatusBadge status={plot.status} />
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Área:</Text>
          <Text style={styles.value}>{formatArea(plot.area)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ciclo Atual:</Text>
          <Text style={styles.value}>
            {cycleCategory ? cycleCategory.name : `Ciclo ${plot.currentCycle}`}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Plantio:</Text>
          <Text style={styles.value}>{formatDate(plot.plantingDate)}</Text>
        </View>
        
        {plot.lastHarvestDate && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Última Colheita:</Text>
            <Text style={styles.value}>{formatDate(plot.lastHarvestDate)}</Text>
          </View>
        )}
        
        {plot.soilType && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo de Solo:</Text>
            <Text style={styles.value}>{plot.soilType}</Text>
          </View>
        )}
      </Card>

      {plot.notes && (
        <Card style={styles.notesCard}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.notes}>{plot.notes}</Text>
        </Card>
      )}

      <Card style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Ações</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bar-chart-outline" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Ver Histórico de Produção</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle-outline" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Registrar Produção</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cash-outline" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Ver Custos</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerButton: {
    marginRight: 8,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plotNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 12,
  },
  cycleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  notesCard: {
    margin: 16,
    marginTop: 8,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  actionText: {
    fontSize: 16,
    color: '#2E7D32',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default PlotDetailsScreen;