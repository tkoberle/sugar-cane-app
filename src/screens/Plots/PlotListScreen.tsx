import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPlots } from '../../store';
import { LoadingSpinner } from '../../components/ui';
import PlotCard from '../../components/PlotCard';
import { Plot, Category } from '../../types';
import { PlotsStackScreenProps } from '../../types';
import { CategoryRepository } from '../../database/models/CategoryRepository';
import { getPlotsWithCategoryInfo } from '../../utils';

type PlotListScreenNavigationProp = PlotsStackScreenProps<'PlotList'>['navigation'];

const PlotListScreen: React.FC = () => {
  const navigation = useNavigation<PlotListScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { plots, loading, error } = useAppSelector(state => state.plots);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchPlots());
      const loadedCategories = await CategoryRepository.findAll();
      setCategories(loadedCategories);
    };
    loadData();
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchPlots());
    const loadedCategories = await CategoryRepository.findAll();
    setCategories(loadedCategories);
    setRefreshing(false);
  };

  const handlePlotPress = (plot: Plot) => {
    navigation.navigate('PlotDetails', { plotId: plot.id });
  };

  const handleAddPlot = () => {
    navigation.navigate('PlotEdit', {});
  };

  const handleMapView = () => {
    navigation.navigate('MapView');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={handleMapView}
            style={styles.headerButton}
          >
            <Ionicons name="map-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleAddPlot}
            style={styles.headerButton}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  if (loading && plots.length === 0) {
    return <LoadingSpinner message="Carregando talhões..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar talhões: {error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPlotItem = ({ item }: { item: Plot }) => {
    const plotsWithCategoryInfo = getPlotsWithCategoryInfo([item], categories);
    const categoryInfo = plotsWithCategoryInfo[0]?.categoryInfo;
    
    return (
      <PlotCard 
        plot={item} 
        onPress={handlePlotPress} 
        categoryInfo={categoryInfo}
      />
    );
  };

  return (
    <View style={styles.container}>
      {plots.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Nenhum talhão encontrado</Text>
          <Text style={styles.emptyText}>
            Adicione seu primeiro talhão para começar
          </Text>
          <TouchableOpacity onPress={handleAddPlot} style={styles.addButton}>
            <Text style={styles.addButtonText}>Adicionar Talhão</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plots}
          renderItem={renderPlotItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#2E7D32']}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    marginLeft: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlotListScreen;