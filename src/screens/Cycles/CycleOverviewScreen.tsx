import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CyclesStackParamList } from '../../types/navigation';
import { Card } from '../../components/ui';

type CycleOverviewScreenNavigationProp = NativeStackNavigationProp<CyclesStackParamList, 'CycleOverview'>;

const CycleOverviewScreen: React.FC = () => {
  const navigation = useNavigation<CycleOverviewScreenNavigationProp>();

  const menuItems = [
    {
      id: 'category-management',
      title: 'Gerenciar Categorias',
      description: 'Configure categorias por ciclo de produção',
      icon: 'layers-outline',
      color: '#2E7D32',
      onPress: () => navigation.navigate('CategoryManagement'),
    },
    {
      id: 'cycle-planning',
      title: 'Planejamento de Ciclos',
      description: 'Planeje e organize os ciclos de produção',
      icon: 'calendar-outline',
      color: '#FF9800',
      onPress: () => navigation.navigate('CyclePlanning'),
    },
    {
      id: 'product-management',
      title: 'Produtos Agrícolas',
      description: 'Gerencie produtos para preparação do solo',
      icon: 'leaf-outline',
      color: '#4CAF50',
      onPress: () => navigation.navigate('ProductList'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Ciclos</Text>
        <Text style={styles.headerSubtitle}>
          Gerencie categorias e planejamento dos ciclos de produção
        </Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} onPress={item.onPress}>
            <Card style={styles.menuCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={32} color="#FFFFFF" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#2196F3" />
          <Text style={styles.infoTitle}>Como funciona</Text>
        </View>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Categorias:</Text> Definem parâmetros padrão por ciclo (produtividade, custos, receita)
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Associação:</Text> Vincule talhões às categorias apropriadas
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Planejamento:</Text> Use as categorias para planejar safras futuras
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuGrid: {
    padding: 16,
    gap: 12,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    margin: 16,
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CycleOverviewScreen;