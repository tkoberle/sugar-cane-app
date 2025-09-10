import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductRegistrationForm } from '../../components/forms';
import { Product } from '../../types/entities';
import { ProductRepository } from '../../database/models/ProductRepository';

interface ProductFormScreenProps {
  navigation: any;
  route: {
    params?: {
      productId?: string;
    };
  };
}

const ProductFormScreen: React.FC<ProductFormScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params || {};
  const isEditing = !!productId;

  const handleSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isEditing) {
        await ProductRepository.update(productId, data);
      } else {
        await ProductRepository.create(data);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const loadProduct = async (id: string): Promise<Product | null> => {
    return await ProductRepository.findById(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProductRegistrationForm
            onSubmit={handleSubmit}
            productId={productId}
            loadProduct={loadProduct}
            isEditing={isEditing}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});

export default ProductFormScreen;