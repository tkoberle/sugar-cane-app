import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plot } from '../../types';

const plotFormSchema = z.object({
  number: z
    .number()
    .min(1, 'Número do talhão deve ser maior que 0')
    .max(999, 'Número do talhão deve ser menor que 999'),
  area: z
    .number()
    .min(0.1, 'Área deve ser maior que 0.1 hectares')
    .max(100, 'Área deve ser menor que 100 hectares'),
  currentCycle: z
    .number()
    .min(0, 'Ciclo deve ser entre 0 e 5')
    .max(5, 'Ciclo deve ser entre 0 e 5'),
  plantingDate: z.string().optional(),
  status: z.enum(['active', 'reform', 'rotation', 'new']),
  soilType: z.string().optional(),
  notes: z.string().optional(),
});

type PlotFormData = z.infer<typeof plotFormSchema>;

interface PlotFormProps {
  initialData?: Partial<Plot>;
  onSubmit: (data: PlotFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

const PlotForm: React.FC<PlotFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PlotFormData>({
    resolver: zodResolver(plotFormSchema),
    defaultValues: {
      number: initialData?.number || undefined,
      area: initialData?.area || undefined,
      currentCycle: initialData?.currentCycle || 0,
      plantingDate: initialData?.plantingDate ? 
        new Date(initialData.plantingDate).toISOString().split('T')[0] : '',
      status: initialData?.status || 'new',
      soilType: initialData?.soilType || '',
      notes: initialData?.notes || '',
    },
  });

  const watchedArea = watch('area');
  const watchedCycle = watch('currentCycle');

  const statusOptions = [
    { value: 'new', label: 'Novo' },
    { value: 'active', label: 'Ativo' },
    { value: 'reform', label: 'Reforma' },
    { value: 'rotation', label: 'Rotação' },
  ];

  const cycleOptions = [
    { value: 0, label: 'Plantio Novo' },
    { value: 1, label: 'Primeiro Corte' },
    { value: 2, label: 'Segundo Corte' },
    { value: 3, label: 'Terceiro Corte' },
    { value: 4, label: 'Quarto Corte' },
    { value: 5, label: 'Quinto Corte' },
  ];

  const handleFormSubmit = async (data: PlotFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      Alert.alert(
        'Erro',
        `Erro ao ${isEditing ? 'atualizar' : 'criar'} talhão: ${error}`
      );
    }
  };

  const getExpectedProductivity = (cycle: number): number => {
    const productivityMap: { [key: number]: number } = {
      0: 0, // Plantio
      1: 110,
      2: 100,
      3: 90,
      4: 85,
      5: 80,
    };
    return productivityMap[cycle] || 0;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Talhão' : 'Novo Talhão'}
        </Text>

        {/* Plot Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número do Talhão *</Text>
          <Controller
            control={control}
            name="number"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.number && styles.inputError]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  onChange(isNaN(num) ? undefined : num);
                }}
                placeholder="Ex: 1"
                keyboardType="numeric"
                editable={!loading}
              />
            )}
          />
          {errors.number && (
            <Text style={styles.errorText}>{errors.number.message}</Text>
          )}
        </View>

        {/* Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área (hectares) *</Text>
          <Controller
            control={control}
            name="area"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.area && styles.inputError]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseFloat(text);
                  onChange(isNaN(num) ? undefined : num);
                }}
                placeholder="Ex: 15.28"
                keyboardType="decimal-pad"
                editable={!loading}
              />
            )}
          />
          {errors.area && (
            <Text style={styles.errorText}>{errors.area.message}</Text>
          )}
        </View>

        {/* Current Cycle */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ciclo Atual *</Text>
          <View style={styles.cycleContainer}>
            {cycleOptions.map((option) => (
              <Controller
                key={option.value}
                control={control}
                name="currentCycle"
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
          {watchedCycle !== undefined && (
            <Text style={styles.infoText}>
              Produtividade esperada: {getExpectedProductivity(watchedCycle)} ton/ha
            </Text>
          )}
        </View>

        {/* Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status *</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map((option) => (
              <Controller
                key={option.value}
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      value === option.value && styles.statusOptionSelected,
                    ]}
                    onPress={() => onChange(option.value as Plot['status'])}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        value === option.value && styles.statusOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ))}
          </View>
        </View>

        {/* Planting Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Plantio</Text>
          <Controller
            control={control}
            name="plantingDate"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value || ''}
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Soil Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Solo</Text>
          <Controller
            control={control}
            name="soilType"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value || ''}
                onChangeText={onChange}
                placeholder="Ex: Latossolo Vermelho"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observações</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={value || ''}
                onChangeText={onChange}
                placeholder="Observações sobre o talhão..."
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Summary Card */}
        {watchedArea && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo</Text>
            <Text style={styles.summaryText}>
              Área: {watchedArea} hectares
            </Text>
            {watchedCycle !== undefined && (
              <>
                <Text style={styles.summaryText}>
                  Produtividade esperada: {getExpectedProductivity(watchedCycle) * watchedArea} toneladas
                </Text>
                <Text style={styles.summaryText}>
                  Receita estimada: R$ {((getExpectedProductivity(watchedCycle) * watchedArea * 179.76).toLocaleString('pt-BR'))}
                </Text>
              </>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit(handleFormSubmit)}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Talhão'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 24,
    textAlign: 'center',
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
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  infoText: {
    color: '#2E7D32',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  cycleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cycleOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  cycleOptionSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  cycleOptionText: {
    fontSize: 12,
    color: '#666',
  },
  cycleOptionTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  statusOptionSelected: {
    backgroundColor: '#F57C00',
    borderColor: '#F57C00',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#666',
  },
  statusOptionTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  submitButton: {
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
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default PlotForm;