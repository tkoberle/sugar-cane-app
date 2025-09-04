import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoryRepository } from '../../database/models/CategoryRepository';
import { PlotRepository } from '../../database/models/PlotRepository';
import { Category, CategoryType, Plot } from '../../types/entities';
import { CyclesStackParamList } from '../../types/navigation';
import { LoadingSpinner } from '../../components/ui';

type CategoryFormScreenProps = NativeStackScreenProps<CyclesStackParamList, 'CategoryForm'>;
type CategoryFormScreenNavigationProp = NativeStackNavigationProp<CyclesStackParamList, 'CategoryForm'>;

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cycle: z.number().min(0).max(10),
  expectedProductivity: z.number().min(0, 'Produtividade deve ser maior que 0'),
  standardRevenue: z.number().min(0, 'Receita deve ser maior que 0'),
  standardCosts: z.number().min(0, 'Custo deve ser maior que 0'),
  parentCategoryId: z.string().optional().nullable(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

const CategoryFormScreen: React.FC = () => {
  const route = useRoute<CategoryFormScreenProps['route']>();
  const navigation = useNavigation<CategoryFormScreenNavigationProp>();
  
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlotIds, setSelectedPlotIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAddPlotsModal, setShowAddPlotsModal] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const isEditing = Boolean(route.params?.categoryId);
  const categoryId = route.params?.categoryId;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      cycle: 0,
      expectedProductivity: 0,
      standardRevenue: 0,
      standardCosts: 0,
      parentCategoryId: undefined,
    },
  });

  const watchedCycle = watch('cycle');
  const formValues = watch();
  
  // Debug form state
  React.useEffect(() => {
    console.log('Form values changed:', formValues);
    console.log('Form errors:', errors);
  }, [formValues, errors]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all plots and categories
        const plotsData = await PlotRepository.getAllPlots();
        const categoriesData = await CategoryRepository.findAll();
        setPlots(plotsData);
        setAllCategories(categoriesData);

        // Load category if editing
        if (isEditing && categoryId) {
          const categoryData = await CategoryRepository.findById(categoryId);
          if (categoryData) {
            console.log('Loading category data for edit:', categoryData);
            setValue('name', categoryData.name);
            setValue('cycle', categoryData.cycle);
            setValue('expectedProductivity', categoryData.expectedProductivity);
            setValue('standardRevenue', categoryData.standardRevenue);
            setValue('standardCosts', categoryData.standardCosts);
            setValue('parentCategoryId', categoryData.parentCategoryId || undefined);
            setSelectedPlotIds(categoryData.plots.map(p => p.id));
            console.log('Selected plot IDs set to:', categoryData.plots.map(p => p.id));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [isEditing, categoryId, setValue]);

  const handleSave = async (formData: CategoryFormData) => {
    try {
      console.log('=== SAVE FUNCTION CALLED ===');
      console.log('Form data received:', formData);
      console.log('Form errors:', errors);
      console.log('Is editing:', isEditing);
      console.log('Category ID:', categoryId);
      console.log('Selected plots:', selectedPlotIds);
      
      setLoading(true);

      // Clean up form data - convert null to undefined for TypeScript compatibility
      const cleanFormData = {
        ...formData,
        parentCategoryId: formData.parentCategoryId || undefined,
      };

      if (isEditing && categoryId) {
        // Update existing category
        console.log('Updating category:', categoryId, cleanFormData);
        await CategoryRepository.update(categoryId, cleanFormData);
        console.log('Category updated, now assigning plots:', selectedPlotIds);
        await CategoryRepository.assignPlots(categoryId, selectedPlotIds);
        console.log('Plots assigned successfully');
        Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
      } else {
        // Create new category
        console.log('Creating new category:', cleanFormData);
        const newCategoryId = await CategoryRepository.create(cleanFormData);
        console.log('Category created with ID:', newCategoryId);
        await CategoryRepository.assignPlots(newCategoryId, selectedPlotIds);
        console.log('Plots assigned to new category');
        Alert.alert('Sucesso', 'Categoria criada com sucesso!');
      }

      console.log('Navigating back after successful save');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Erro', `Erro ao salvar categoria: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const removePlotFromCategory = (plotId: string) => {
    const plot = plots.find(p => p.id === plotId);
    Alert.alert(
      'Remover Talhão',
      `Remover Talhão ${plot?.number} desta categoria?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setSelectedPlotIds(prev => prev.filter(id => id !== plotId));
          },
        },
      ]
    );
  };

  const addPlotToCategory = async (plotId: string) => {
    // Check if plot is already in another category for this cycle
    const existingCategory = allCategories.find(cat => 
      cat.cycle === watchedCycle && 
      cat.plots.some(p => p.id === plotId) &&
      cat.id !== categoryId // Exclude current category if editing
    );

    if (existingCategory) {
      const plot = plots.find(p => p.id === plotId);
      Alert.alert(
        'Talhão já Associado',
        `O Talhão ${plot?.number} já está associado à categoria "${existingCategory.name}". Deseja movê-lo para esta categoria?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Mover',
            onPress: () => {
              setSelectedPlotIds(prev => [...prev.filter(id => id !== plotId), plotId]);
              setShowAddPlotsModal(false);
            },
          },
        ]
      );
    } else {
      setSelectedPlotIds(prev => [...prev, plotId]);
      setShowAddPlotsModal(false);
    }
  };

  const getAvailablePlotsForCycle = () => {
    return plots.filter(plot => 
      plot.currentCycle === watchedCycle && 
      !selectedPlotIds.includes(plot.id)
    );
  };

  const getSelectedPlots = () => {
    return plots.filter(plot => selectedPlotIds.includes(plot.id));
  };

  const getCycleTypeName = (cycle: CategoryType): string => {
    const cycleNames = {
      [CategoryType.reform]: 'Reforma (0)',
      [CategoryType.first_cut]: 'Primeiro Corte (1)',
      [CategoryType.second_cut]: 'Segundo Corte (2)',
      [CategoryType.third_cut]: 'Terceiro Corte (3)',
      [CategoryType.fourth_cut]: 'Quarto Corte (4)',
      [CategoryType.fifth_cut]: 'Quinto Corte (5)',
      [CategoryType.sixth_cut]: 'Sexto Corte (6)',
      [CategoryType.seventh_cut]: 'Sétimo Corte (7)',
      [CategoryType.eighth_cut]: 'Oitavo Corte (8)',
      [CategoryType.ninth_cut]: 'Nono Corte (9)',
      [CategoryType.tenth_cut]: 'Décimo Corte (10)',
    };
    return cycleNames[cycle] || `Ciclo ${cycle}`;
  };

  const cycleOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: getCycleTypeName(i as CategoryType),
  }));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Categoria' : 'Nova Categoria',
    });
  }, [navigation, isEditing]);

  if (initialLoading) {
    return <LoadingSpinner message="Carregando dados..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Category Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome da Categoria *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: Primeiro Corte Alto Rendimento"
                editable={!loading}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Cycle Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ciclo *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cycleContainer}>
              {cycleOptions.map((option) => (
                <Controller
                  key={option.value}
                  control={control}
                  name="cycle"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      style={[
                        styles.cycleOption,
                        value === option.value && styles.cycleOptionSelected,
                      ]}
                      onPress={() => onChange(option.value)}
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.cycleOptionText,
                          value === option.value && styles.cycleOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Expected Productivity */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Produtividade Esperada (t/ha) *</Text>
          <Controller
            control={control}
            name="expectedProductivity"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.expectedProductivity && styles.inputError]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseFloat(text);
                  onChange(isNaN(num) ? 0 : num);
                }}
                placeholder="Ex: 110"
                keyboardType="decimal-pad"
                editable={!loading}
              />
            )}
          />
          {errors.expectedProductivity && (
            <Text style={styles.errorText}>{errors.expectedProductivity.message}</Text>
          )}
        </View>

        {/* Standard Revenue */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Receita Padrão (R$) *</Text>
          <Controller
            control={control}
            name="standardRevenue"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.standardRevenue && styles.inputError]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseFloat(text);
                  onChange(isNaN(num) ? 0 : num);
                }}
                placeholder="Ex: 19774.02"
                keyboardType="decimal-pad"
                editable={!loading}
              />
            )}
          />
          {errors.standardRevenue && (
            <Text style={styles.errorText}>{errors.standardRevenue.message}</Text>
          )}
        </View>

        {/* Standard Costs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Custo Padrão (R$) *</Text>
          <Controller
            control={control}
            name="standardCosts"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.standardCosts && styles.inputError]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseFloat(text);
                  onChange(isNaN(num) ? 0 : num);
                }}
                placeholder="Ex: 1984.43"
                keyboardType="decimal-pad"
                editable={!loading}
              />
            )}
          />
          {errors.standardCosts && (
            <Text style={styles.errorText}>{errors.standardCosts.message}</Text>
          )}
        </View>

        {/* Selected Plots Display */}
        <View style={styles.inputGroup}>
          <View style={styles.plotsHeader}>
            <Text style={styles.label}>
              Talhões Associados ({selectedPlotIds.length})
            </Text>
            <TouchableOpacity 
              style={styles.addPlotsButton}
              onPress={() => setShowAddPlotsModal(true)}
              disabled={loading}
            >
              <Ionicons name="add" size={20} color="#2E7D32" />
              <Text style={styles.addPlotsButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          
          {selectedPlotIds.length > 0 ? (
            <View style={styles.plotsContainer}>
              {getSelectedPlots().map((plot) => (
                <View key={plot.id} style={styles.selectedPlotCard}>
                  <TouchableOpacity
                    style={styles.removePlotButton}
                    onPress={() => removePlotFromCategory(plot.id)}
                    disabled={loading}
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.plotCardTitle}>Talhão {plot.number}</Text>
                  <Text style={styles.plotCardSubtext}>
                    {plot.area} ha • {plot.status}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noPlots}>
              Nenhum talhão associado. Toque em "Adicionar" para associar talhões.
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={() => {
              console.log('Save button pressed!');
              console.log('Current form errors before submission:', errors);
              handleSubmit(
                handleSave, 
                (errors) => {
                  console.log('Form validation failed:', errors);
                  Alert.alert('Erro de Validação', 'Por favor, corrija os campos obrigatórios.');
                }
              )();
            }}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Plots Modal */}
      <Modal
        visible={showAddPlotsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Adicionar Talhões - Ciclo {watchedCycle}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowAddPlotsModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {getAvailablePlotsForCycle().length > 0 ? (
              <View style={styles.availablePlotsContainer}>
                {getAvailablePlotsForCycle().map((plot) => {
                  const conflictCategory = allCategories.find(cat => 
                    cat.cycle === watchedCycle && 
                    cat.plots.some(p => p.id === plot.id) &&
                    cat.id !== categoryId
                  );
                  
                  return (
                    <TouchableOpacity
                      key={plot.id}
                      style={[
                        styles.availablePlotCard,
                        conflictCategory && styles.conflictPlotCard
                      ]}
                      onPress={() => addPlotToCategory(plot.id)}
                    >
                      <View style={styles.availablePlotInfo}>
                        <Text style={styles.availablePlotTitle}>Talhão {plot.number}</Text>
                        <Text style={styles.availablePlotSubtext}>
                          {plot.area} ha • {plot.status}
                        </Text>
                        {conflictCategory && (
                          <Text style={styles.conflictText}>
                            📍 Em: {conflictCategory.name}
                          </Text>
                        )}
                      </View>
                      <Ionicons name="add-circle" size={24} color="#2E7D32" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.noAvailablePlots}>
                Todos os talhões do ciclo {watchedCycle} já estão associados a esta categoria.
              </Text>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  cycleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  cycleOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    minWidth: 120,
    alignItems: 'center',
  },
  cycleOptionSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  cycleOptionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  cycleOptionTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  plotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addPlotsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  addPlotsButtonText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 4,
  },
  plotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedPlotCard: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#2E7D32',
    minWidth: 100,
  },
  removePlotButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  plotCardTitle: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  plotCardSubtext: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 2,
    opacity: 0.8,
  },
  noPlots: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  availablePlotsContainer: {
    gap: 8,
  },
  availablePlotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  conflictPlotCard: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF8E1',
  },
  availablePlotInfo: {
    flex: 1,
  },
  availablePlotTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  availablePlotSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  conflictText: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 4,
    fontWeight: '500',
  },
  noAvailablePlots: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 32,
  },
});

export default CategoryFormScreen;