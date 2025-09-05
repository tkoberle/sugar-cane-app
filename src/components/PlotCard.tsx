import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plot, Category } from '../types';
import { Card, StatusBadge } from './ui';
import { formatArea, getCycleColor } from '../utils';
import { cycleCategoriesData } from '../constants/cycleCategoriesData';

interface PlotCardProps {
  plot: Plot;
  onPress?: (plot: Plot) => void;
  categoryInfo?: {
    isAssigned: boolean;
    categoryName?: string;
    categoryId?: string;
    cycle?: number;
  };
}

const PlotCard: React.FC<PlotCardProps> = ({ plot, onPress, categoryInfo }) => {
  const currentCycle = categoryInfo?.cycle;
  const cycleCategory = currentCycle !== undefined ? cycleCategoriesData.find(cat => cat.cycle === currentCycle) : undefined;
  const cycleColor = currentCycle !== undefined ? getCycleColor(currentCycle) : '#9E9E9E';

  return (
    <TouchableOpacity onPress={() => onPress?.(plot)} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.plotNumber} numberOfLines={1} ellipsizeMode="tail">
              {plot.name ? `${plot.number} - ${plot.name}` : `${plot.number}`}
            </Text>
            {currentCycle !== undefined && (
              <View style={[styles.cycleBadge, { backgroundColor: cycleColor }]}>
                <Text style={styles.cycleText}>{currentCycle}</Text>
              </View>
            )}
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
              {cycleCategory ? cycleCategory.name : currentCycle !== undefined ? `Ciclo ${currentCycle}` : 'Não atribuído'}
            </Text>
          </View>
          
          {plot.soilType && (
            <View style={styles.row}>
              <Text style={styles.label}>Solo:</Text>
              <Text style={styles.value}>{plot.soilType}</Text>
            </View>
          )}
          
          {/* Category Assignment Info */}
          <View style={styles.row}>
            <Text style={styles.label}>Categoria:</Text>
            <View style={styles.categoryInfo}>
              {categoryInfo?.isAssigned ? (
                <>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color="#4CAF50" 
                    style={styles.categoryIcon}
                  />
                  <Text style={[styles.value, styles.assignedCategory]} numberOfLines={1}>
                    {categoryInfo.categoryName}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons 
                    name="remove-circle-outline" 
                    size={16} 
                    color="#FF9800" 
                    style={styles.categoryIcon}
                  />
                  <Text style={[styles.value, styles.unassignedCategory]}>
                    Não atribuído
                  </Text>
                </>
              )}
            </View>
          </View>
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
    flex: 1,
  },
  plotNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 8,
    flex: 1,
    flexShrink: 1,
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryIcon: {
    marginRight: 4,
  },
  assignedCategory: {
    color: '#4CAF50',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  unassignedCategory: {
    color: '#FF9800',
    fontWeight: '500',
    fontStyle: 'italic',
  },
});

export default PlotCard;