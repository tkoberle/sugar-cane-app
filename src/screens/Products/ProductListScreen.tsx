import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types/entities';
import { ProductRepository } from '../../database/models/ProductRepository';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProductListScreenProps {
  navigation: any;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Product['category']>('all');

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let result: Product[];
      
      if (filter === 'all') {
        result = await ProductRepository.findAll();
      } else {
        result = await ProductRepository.findByCategory(filter);
      }
      
      setProducts(result);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Erro', 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o produto "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ProductRepository.delete(product.id);
              loadProducts();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir produto');
            }
          }
        }
      ]
    );
  };

  const getCategoryIcon = (category: Product['category']) => {
    const iconMap = {
      inoculant: 'leaf',
      fertilizer: 'nutrition',
      pesticide: 'bug',
      herbicide: 'flower',
      fungicide: 'medical',
      insecticide: 'skull',
      soil_corrector: 'earth',
      biostimulant: 'water',
      adjuvant: 'add-circle'
    };
    return iconMap[category] || 'help-circle';
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Ionicons 
            name={getCategoryIcon(item.category)} 
            size={24} 
            color="#2E7D32" 
            style={styles.categoryIcon}
          />
          <View style={styles.productText}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productBrand}>{item.brand}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.productActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductForm', { productId: item.id })}
            style={styles.actionButton}
          >
            <Ionicons name="create" size={20} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteProduct(item)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.productDetails}>
        {item.registrationNumber && (
          <Text style={styles.detailText}>MAPA: {item.registrationNumber}</Text>
        )}
        {item.guarantee && (
          <Text style={styles.detailText}>Garantia: {item.guarantee}</Text>
        )}
        <Text style={styles.priceText}>
          R$ {item.costPerUnit.toFixed(2)} / {item.unitOfMeasure}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ category, label }: { category: typeof filter; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === category && styles.filterButtonActive]}
      onPress={() => setFilter(category)}
    >
      <Text style={[styles.filterButtonText, filter === category && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produtos Agrícolas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductForm')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { category: 'all', label: 'Todos' },
            { category: 'inoculant', label: 'Inoculantes' },
            { category: 'fertilizer', label: 'Fertilizantes' },
            { category: 'pesticide', label: 'Pesticidas' }
          ]}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <FilterButton category={item.category} label={item.label} />
          )}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('ProductForm')}
            >
              <Text style={styles.emptyButtonText}>Adicionar Produto</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  productText: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 14,
    color: '#2E7D32',
    textTransform: 'capitalize',
  },
  productActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
    padding: 8,
  },
  productDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductListScreen;