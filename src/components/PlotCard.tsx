import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plot } from '../types';
import { Card, StatusBadge } from './ui';
import { formatArea, getCycleColor } from '../utils';
import { cycleCategoriesData } from '../constants/cycleCategoriesData';

interface PlotCardProps {
  plot: Plot;
  onPress?: (plot: Plot) => void;
}

const PlotCard: React.FC<PlotCardProps> = ({ plot, onPress }) => {
  const cycleCategory = cycleCategoriesData.find(cat => cat.cycle === plot.currentCycle);
  const cycleColor = getCycleColor(plot.currentCycle);

  return (
    <TouchableOpacity onPress={() => onPress?.(plot)} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.plotNumber}>Talhão {plot.number}</Text>
            <View style={[styles.cycleBadge, { backgroundColor: cycleColor }]}>
              <Text style={styles.cycleText}>{plot.currentCycle}</Text>
            </View>
          </View>
          <StatusBadge status={plot.status} size="small" />
        </View>
        
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Área:</Text>
            <Text style={styles.value}>{formatArea(plot.area)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Ciclo:</Text>
            <Text style={styles.value}>
              {cycleCategory ? cycleCategory.name : `Ciclo ${plot.currentCycle}`}
            </Text>
          </View>
          
          {plot.soilType && (
            <View style={styles.row}>
              <Text style={styles.label}>Solo:</Text>
              <Text style={styles.value}>{plot.soilType}</Text>
            </View>
          )}
        </View>
        
        {plot.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {plot.notes}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 8,
  },
  cycleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  notes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});

export default PlotCard;