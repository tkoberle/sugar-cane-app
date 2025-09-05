import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryRepository } from '../../database/models/CategoryRepository';
import { Category, CategoryType } from '../../types/entities';
import { CyclesStackParamList } from '../../types/navigation';
import { Card, LoadingSpinner } from '../../components/ui';
import { formatCurrency, formatNumber } from '../../utils/formatters';

type CategoryManagementScreenNavigationProp = NativeStackNavigationProp<
  CyclesStackParamList,
  'CategoryManagement'
>;

const CategoryManagementScreen: React.FC = () => {
  const navigation = useNavigation<CategoryManagementScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = async () => {
    try {
      const categoriesData = await CategoryRepository.findAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Refresh data when screen comes into focus (e.g., returning from edit screen)
  useFocusEffect(
    React.useCallback(() => {
      console.log('CategoryManagementScreen focused, reloading data...');
      loadCategories();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const handleAddCategory = () => {
    navigation.navigate('CategoryForm', {});
  };

  const handleEditCategory = (categoryId: string) => {
    navigation.navigate('CategoryForm', { categoryId });
  };

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a categoria "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await CategoryRepository.delete(category.id);
              setCategories(prev => prev.filter(c => c.id !== category.id));
              Alert.alert('Sucesso', 'Categoria excluída com sucesso');
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Erro', 'Não foi possível excluir a categoria');
            }
          },
        },
      ]
    );
  };

  const getCycleTypeName = (cycle: CategoryType): string => {
    const cycleNames = {
      [CategoryType.reform]: 'Reforma',
      [CategoryType.first_cut]: 'Primeiro Corte',
      [CategoryType.second_cut]: 'Segundo Corte',
      [CategoryType.third_cut]: 'Terceiro Corte',
      [CategoryType.fourth_cut]: 'Quarto Corte',
      [CategoryType.fifth_cut]: 'Quinto Corte',
      [CategoryType.sixth_cut]: 'Sexto Corte',
      [CategoryType.seventh_cut]: 'Sétimo Corte',
      [CategoryType.eighth_cut]: 'Oitavo Corte',
      [CategoryType.ninth_cut]: 'Nono Corte',
      [CategoryType.tenth_cut]: 'Décimo Corte',
    };
    return cycleNames[cycle] || `Ciclo ${cycle}`;
  };

  const getCycleColor = (cycle: CategoryType): string => {
    const colors = [
      '#9C27B0', // 0 - Purple (Reform)
      '#4CAF50', // 1 - Green (First cut)
      '#8BC34A', // 2 - Light Green (Second cut)
      '#CDDC39', // 3 - Lime (Third cut)
      '#FF9800', // 4 - Orange (Fourth cut)
      '#FF5722', // 5 - Deep Orange (Fifth cut)
      '#795548', // 6 - Brown (Sixth cut)
      '#607D8B', // 7 - Blue Grey (Seventh cut)
      '#9E9E9E', // 8 - Grey (Eighth cut)
      '#F44336', // 9 - Red (Ninth cut)
      '#E91E63', // 10 - Pink (Tenth cut)
    ];
    return colors[cycle] || '#757575';
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddCategory} style={styles.headerButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner message="Carregando categorias..." />;
  }

  const groupedCategories = categories.reduce((acc, category) => {
    const cycle = category.cycle;
    if (!acc[cycle]) acc[cycle] = [];
    acc[cycle].push(category);
    return acc;
  }, {} as Record<CategoryType, Category[]>);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Categorias</Text>
        <Text style={styles.headerSubtitle}>
          Configure categorias por ciclo de produção
        </Text>
      </View>

      {Object.entries(groupedCategories).map(([cycle, categoryList]) => (
        <View key={cycle} style={styles.cycleSection}>
          <View style={[styles.cycleHeader, { backgroundColor: getCycleColor(Number(cycle) as CategoryType) }]}>
            <Text style={styles.cycleTitle}>
              {getCycleTypeName(Number(cycle) as CategoryType)}
            </Text>
            <Text style={styles.cycleCount}>
              {categoryList.length} categoria{categoryList.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {categoryList.map((category) => (
            <Card key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDetails}>
                    {category.plots.length} talhã{category.plots.length !== 1 ? 'os' : 'o'} associado{category.plots.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditCategory(category.id)}
                  >
                    <Ionicons name="create-outline" size={20} color="#2E7D32" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteCategory(category)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Produtividade</Text>
                  <Text style={styles.metricValue}>
                    {formatNumber(category.expectedProductivity, 1)} t/ha
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Receita Padrão</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(category.standardRevenue)}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Custo Padrão</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(category.standardCosts)}
                  </Text>
                </View>
              </View>

              {category.soilPreparations.length > 0 && (
                <View style={styles.soilPrepSection}>
                  <Text style={styles.soilPrepTitle}>Preparos de Solo:</Text>
                  <Text style={styles.soilPrepCount}>
                    {category.soilPreparations.length} preparo{category.soilPreparations.length !== 1 ? 's' : ''} configurado{category.soilPreparations.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </Card>
          ))}
        </View>
      ))}

      {categories.length === 0 && (
        <Card style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Nenhuma categoria encontrada</Text>
          <Text style={styles.emptySubtitle}>
            Toque no botão + para criar sua primeira categoria
          </Text>
        </Card>
      )}
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
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cycleSection: {
    marginTop: 16,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  cycleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cycleCount: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  categoryCard: {
    margin: 16,
    marginTop: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDetails: {
    fontSize: 14,
    color: '#666',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  soilPrepSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  soilPrepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  soilPrepCount: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    margin: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default CategoryManagementScreen;