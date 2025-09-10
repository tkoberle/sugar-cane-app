import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../../types/entities';
import { ProductRepository } from '../../database/models/ProductRepository';

interface ProductDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      productId: string;
    };
  };
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const result = await ProductRepository.findById(productId);
      setProduct(result);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Erro', 'Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o produto "${product?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ProductRepository.delete(productId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir produto');
            }
          }
        }
      ]
    );
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value?: string | number }) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Produto não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProductForm', { productId })}
          >
            <Ionicons name="create" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <InfoCard title="Informações Básicas">
          <InfoRow label="Categoria" value={product.category} />
          <InfoRow label="Tipo" value={product.type} />
          <InfoRow label="Unidade" value={product.unitOfMeasure} />
          <InfoRow label="Preço por unidade" value={`R$ ${product.costPerUnit.toFixed(2)}`} />
          {product.packageSize && (
            <InfoRow label="Tamanho da embalagem" value={product.packageSize} />
          )}
        </InfoCard>

        {(product.registrationNumber || product.mapaClassification || product.activeIngredient) && (
          <InfoCard title="Informações Regulatórias MAPA">
            <InfoRow label="Registro MAPA" value={product.registrationNumber} />
            <InfoRow label="Classificação MAPA" value={product.mapaClassification} />
            <InfoRow label="Ingrediente ativo" value={product.activeIngredient} />
            <InfoRow label="Concentração" value={product.concentration} />
            <InfoRow label="Tipo de formulação" value={product.formulationType} />
          </InfoCard>
        )}

        {(product.activity || product.species || product.guarantee || product.physicalNature) && (
          <InfoCard title="Informações EMBRAPA Bioinsumo">
            <InfoRow label="Atividade" value={product.activity} />
            <InfoRow label="Tipo de fertilizante" value={product.fertilizerType} />
            <InfoRow label="Espécie" value={product.species} />
            <InfoRow label="Garantia" value={product.guarantee} />
            <InfoRow label="Natureza física" value={product.physicalNature} />
          </InfoCard>
        )}

        {(product.supplier || product.manufacturer) && (
          <InfoCard title="Informações Comerciais">
            <InfoRow label="Fornecedor" value={product.supplier} />
            <InfoRow label="Fabricante" value={product.manufacturer} />
          </InfoCard>
        )}

        {(product.recommendedDosage || product.applicationMethod?.length) && (
          <InfoCard title="Informações Técnicas">
            {product.recommendedDosage && (
              <>
                <InfoRow 
                  label="Dosagem mínima" 
                  value={`${product.recommendedDosage.min} ${product.recommendedDosage.unit}`} 
                />
                <InfoRow 
                  label="Dosagem máxima" 
                  value={`${product.recommendedDosage.max} ${product.recommendedDosage.unit}`} 
                />
              </>
            )}
            {product.applicationMethod?.length && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Método de aplicação:</Text>
                <Text style={styles.infoValue}>{product.applicationMethod.join(', ')}</Text>
              </View>
            )}
            {product.targetCrops?.length && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Culturas alvo:</Text>
                <Text style={styles.infoValue}>{product.targetCrops.join(', ')}</Text>
              </View>
            )}
          </InfoCard>
        )}

        {(product.toxicClass || product.environmentalClass || product.withdrawalPeriod) && (
          <InfoCard title="Informações de Segurança">
            <InfoRow label="Classe toxicológica" value={product.toxicClass} />
            <InfoRow label="Classe ambiental" value={product.environmentalClass} />
            <InfoRow label="Período de carência" value={product.withdrawalPeriod ? `${product.withdrawalPeriod} dias` : undefined} />
            <InfoRow label="Período de reentrada" value={product.reentryPeriod ? `${product.reentryPeriod} horas` : undefined} />
          </InfoCard>
        )}

        {product.description && (
          <InfoCard title="Descrição">
            <Text style={styles.descriptionText}>{product.description}</Text>
          </InfoCard>
        )}

        {product.notes && (
          <InfoCard title="Observações">
            <Text style={styles.notesText}>{product.notes}</Text>
          </InfoCard>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Criado em: {new Date(product.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          {product.updatedAt && (
            <Text style={styles.footerText}>
              Atualizado em: {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
            </Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 18,
    color: '#666666',
  },
  headerActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#666666',
    flex: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  notesText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ProductDetailsScreen;