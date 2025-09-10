import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Picker } from '@react-native-picker/picker';
import { TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { Card } from '../ui';

// Validation schema for Brazilian agricultural products
const productRegistrationSchema = z.object({
  name: z.string()
    .min(1, 'Nome do produto é obrigatório')
    .max(200, 'Nome muito longo'),
  brand: z.string()
    .min(1, 'Marca é obrigatória')
    .max(100, 'Nome da marca muito longo'),
  category: z.enum(['inoculant', 'fertilizer', 'pesticide', 'herbicide', 'fungicide', 'insecticide', 'soil_corrector', 'biostimulant', 'adjuvant'], {
    message: 'Selecione uma categoria válida'
  }),
  type: z.enum(['biological', 'chemical', 'organic', 'mineral'], {
    message: 'Selecione um tipo válido'
  }),
  registrationNumber: z.string().optional(),
  mapaClassification: z.string().optional(),
  activeIngredient: z.string().optional(),
  concentration: z.string().optional(),
  formulationType: z.enum(['liquid', 'solid', 'powder', 'granular', 'emulsion', 'suspension']).optional(),
  activity: z.enum(['producer', 'retailer', 'both']).optional(),
  fertilizerType: z.string().optional(),
  species: z.string().optional(),
  guarantee: z.string().optional(),
  physicalNature: z.enum(['fluid', 'solid']).optional(),
  unitOfMeasure: z.string()
    .min(1, 'Unidade de medida é obrigatória')
    .max(10, 'Unidade muito longa'),
  costPerUnit: z.number()
    .min(0, 'Preço deve ser positivo'),
  packageSize: z.number().optional(),
  supplier: z.string().optional(),
  manufacturer: z.string().optional(),
  applicationMethod: z.array(z.string()).optional(),
  minDosage: z.number().optional(),
  maxDosage: z.number().optional(),
  dosageUnit: z.string().optional(),
  targetCrops: z.array(z.string()).optional(),
  targetPests: z.array(z.string()).optional(),
  toxicClass: z.enum(['1', '2', '3', '4', 'NT']).optional(),
  environmentalClass: z.enum(['I', 'II', 'III', 'IV']).optional(),
  withdrawalPeriod: z.number().optional(),
  reentryPeriod: z.number().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productRegistrationSchema>;

interface ProductRegistrationFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}) => {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid } 
  } = useForm<ProductFormData>({
    resolver: zodResolver(productRegistrationSchema),
    defaultValues: {
      name: initialData?.name || '',
      brand: initialData?.brand || '',
      category: initialData?.category || 'fertilizer',
      type: initialData?.type || 'chemical',
      registrationNumber: initialData?.registrationNumber || '',
      mapaClassification: initialData?.mapaClassification || '',
      activeIngredient: initialData?.activeIngredient || '',
      concentration: initialData?.concentration || '',
      formulationType: initialData?.formulationType,
      activity: initialData?.activity,
      fertilizerType: initialData?.fertilizerType || '',
      species: initialData?.species || '',
      guarantee: initialData?.guarantee || '',
      physicalNature: initialData?.physicalNature,
      unitOfMeasure: initialData?.unitOfMeasure || 'kg',
      costPerUnit: initialData?.costPerUnit || 0,
      packageSize: initialData?.packageSize,
      supplier: initialData?.supplier || '',
      manufacturer: initialData?.manufacturer || '',
      minDosage: initialData?.recommendedDosage?.min,
      maxDosage: initialData?.recommendedDosage?.max,
      dosageUnit: initialData?.recommendedDosage?.unit || '',
      toxicClass: initialData?.toxicClass,
      environmentalClass: initialData?.environmentalClass,
      withdrawalPeriod: initialData?.withdrawalPeriod,
      reentryPeriod: initialData?.reentryPeriod,
      description: initialData?.description || '',
      notes: initialData?.notes || '',
      isActive: initialData?.isActive !== false,
    },
  });

  const watchedCategory = watch('category');
  const watchedType = watch('type');

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar produto. Tente novamente.');
    }
  };

  const categoryOptions = [
    { value: 'inoculant', label: 'Inoculante' },
    { value: 'fertilizer', label: 'Fertilizante' },
    { value: 'pesticide', label: 'Pesticida' },
    { value: 'herbicide', label: 'Herbicida' },
    { value: 'fungicide', label: 'Fungicida' },
    { value: 'insecticide', label: 'Inseticida' },
    { value: 'soil_corrector', label: 'Corretor de Solo' },
    { value: 'biostimulant', label: 'Bioestimulante' },
    { value: 'adjuvant', label: 'Adjuvante' },
  ];

  const typeOptions = [
    { value: 'biological', label: 'Biológico' },
    { value: 'chemical', label: 'Químico' },
    { value: 'organic', label: 'Orgânico' },
    { value: 'mineral', label: 'Mineral' },
  ];

  const formulationOptions = [
    { value: 'liquid', label: 'Líquido' },
    { value: 'solid', label: 'Sólido' },
    { value: 'powder', label: 'Pó' },
    { value: 'granular', label: 'Granular' },
    { value: 'emulsion', label: 'Emulsão' },
    { value: 'suspension', label: 'Suspensão' },
  ];

  const toxicClassOptions = [
    { value: 'NT', label: 'NT - Não Tóxico' },
    { value: '4', label: 'Classe IV - Pouco Tóxico' },
    { value: '3', label: 'Classe III - Medianamente Tóxico' },
    { value: '2', label: 'Classe II - Altamente Tóxico' },
    { value: '1', label: 'Classe I - Extremamente Tóxico' },
  ];

  const environmentalClassOptions = [
    { value: 'IV', label: 'Classe IV - Pouco Perigoso' },
    { value: 'III', label: 'Classe III - Perigoso' },
    { value: 'II', label: 'Classe II - Muito Perigoso' },
    { value: 'I', label: 'Classe I - Altamente Perigoso' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        {/* Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Produto *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: Fertilizante NPK 20-10-20"
                editable={!loading}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Brand */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marca *</Text>
          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.brand && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: Yara, Bayer, Syngenta"
                editable={!loading}
              />
            )}
          />
          {errors.brand && (
            <Text style={styles.errorText}>{errors.brand.message}</Text>
          )}
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria *</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  enabled={!loading}
                >
                  {categoryOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category.message}</Text>
          )}
        </View>

        {/* Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo *</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  enabled={!loading}
                >
                  {typeOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.type && (
            <Text style={styles.errorText}>{errors.type.message}</Text>
          )}
        </View>
      </Card>

      {/* Brazilian Regulatory Information */}
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Informações Regulamentares (MAPA)</Text>
        
        {/* Registration Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Registro MAPA</Text>
          <Controller
            control={control}
            name="registrationNumber"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: 1234567890123"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* MAPA Classification */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Classificação MAPA</Text>
          <Controller
            control={control}
            name="mapaClassification"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: Fertilizante Organomineral"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Active Ingredient */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ingrediente Ativo</Text>
          <Controller
            control={control}
            name="activeIngredient"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: Glifosato, Atrazina"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Concentration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Concentração</Text>
          <Controller
            control={control}
            name="concentration"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: 480 g/L, 20-10-20"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Formulation Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Formulação</Text>
          <Controller
            control={control}
            name="formulationType"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={value || ''}
                  onValueChange={onChange}
                  enabled={!loading}
                >
                  <Picker.Item label="Selecionar..." value="" />
                  {formulationOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
        </View>
      </Card>

      {/* EMBRAPA Bioinsumo Fields (for biological products) */}
      {(watchedCategory === 'inoculant' || watchedType === 'biological') && (
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Informações EMBRAPA Bioinsumo</Text>
          
          {/* Activity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Atividade</Text>
            <Controller
              control={control}
              name="activity"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.input, styles.pickerContainer]}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    enabled={!loading}
                  >
                    <Picker.Item label="Selecionar..." value="" />
                    <Picker.Item label="Produtor" value="producer" />
                    <Picker.Item label="Revendedor" value="retailer" />
                    <Picker.Item label="Produtor e Revendedor" value="both" />
                  </Picker>
                </View>
              )}
            />
          </View>

          {/* Species (for biological products) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Espécie</Text>
            <Controller
              control={control}
              name="species"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: Azospirillum brasilense, Bacillus subtilis"
                  editable={!loading}
                />
              )}
            />
          </View>

          {/* Guarantee */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Garantia</Text>
            <Controller
              control={control}
              name="guarantee"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: 2x10⁸ UFC/ml, 1x10⁹ UFC/g"
                  editable={!loading}
                />
              )}
            />
          </View>

          {/* Physical Nature */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Natureza Física</Text>
            <Controller
              control={control}
              name="physicalNature"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.input, styles.pickerContainer]}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    enabled={!loading}
                  >
                    <Picker.Item label="Selecionar..." value="" />
                    <Picker.Item label="Fluido" value="fluid" />
                    <Picker.Item label="Sólido" value="solid" />
                  </Picker>
                </View>
              )}
            />
          </View>
        </Card>
      )}

      {/* Commercial Information */}
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Informações Comerciais</Text>
        
        {/* Unit of Measure */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Unidade de Medida *</Text>
          <Controller
            control={control}
            name="unitOfMeasure"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.unitOfMeasure && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder="Ex: kg, L, ml, g"
                editable={!loading}
              />
            )}
          />
          {errors.unitOfMeasure && (
            <Text style={styles.errorText}>{errors.unitOfMeasure.message}</Text>
          )}
        </View>

        {/* Cost Per Unit */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço por Unidade (R$) *</Text>
          <Controller
            control={control}
            name="costPerUnit"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.costPerUnit && styles.inputError]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseFloat(text.replace(',', '.'));
                  onChange(isNaN(num) ? 0 : num);
                }}
                placeholder="Ex: 25.50"
                keyboardType="decimal-pad"
                editable={!loading}
              />
            )}
          />
          {errors.costPerUnit && (
            <Text style={styles.errorText}>{errors.costPerUnit.message}</Text>
          )}
        </View>

        {/* Package Size */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tamanho da Embalagem</Text>
          <Controller
            control={control}
            name="packageSize"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseFloat(text.replace(',', '.'));
                  onChange(isNaN(num) ? undefined : num);
                }}
                placeholder="Ex: 20, 500, 1000"
                keyboardType="decimal-pad"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Supplier */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fornecedor</Text>
          <Controller
            control={control}
            name="supplier"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Nome do fornecedor"
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Manufacturer */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fabricante</Text>
          <Controller
            control={control}
            name="manufacturer"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Nome do fabricante"
                editable={!loading}
              />
            )}
          />
        </View>
      </Card>

      {/* Advanced Fields Toggle */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowAdvancedFields(!showAdvancedFields)}
      >
        <Text style={styles.toggleButtonText}>
          {showAdvancedFields ? 'Ocultar Campos Avançados' : 'Mostrar Campos Avançados'}
        </Text>
        <Ionicons
          name={showAdvancedFields ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#2E7D32"
        />
      </TouchableOpacity>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <>
          {/* Technical Specifications */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
            
            {/* Recommended Dosage */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosagem Recomendada</Text>
              <View style={styles.dosageRow}>
                <Controller
                  control={control}
                  name="minDosage"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, styles.dosageInput]}
                      value={value?.toString() || ''}
                      onChangeText={(text) => {
                        const num = parseFloat(text.replace(',', '.'));
                        onChange(isNaN(num) ? undefined : num);
                      }}
                      placeholder="Min."
                      keyboardType="decimal-pad"
                      editable={!loading}
                    />
                  )}
                />
                <Text style={styles.dosageSeparator}>até</Text>
                <Controller
                  control={control}
                  name="maxDosage"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, styles.dosageInput]}
                      value={value?.toString() || ''}
                      onChangeText={(text) => {
                        const num = parseFloat(text.replace(',', '.'));
                        onChange(isNaN(num) ? undefined : num);
                      }}
                      placeholder="Max."
                      keyboardType="decimal-pad"
                      editable={!loading}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="dosageUnit"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, styles.dosageUnit]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Unidade"
                      editable={!loading}
                    />
                  )}
                />
              </View>
            </View>
          </Card>

          {/* Safety Information */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Informações de Segurança</Text>
            
            {/* Toxic Class */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Classe Toxicológica</Text>
              <Controller
                control={control}
                name="toxicClass"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.input, styles.pickerContainer]}>
                    <Picker
                      selectedValue={value || ''}
                      onValueChange={onChange}
                      enabled={!loading}
                    >
                      <Picker.Item label="Selecionar..." value="" />
                      {toxicClassOptions.map((option) => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
            </View>

            {/* Environmental Class */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Classe Ambiental</Text>
              <Controller
                control={control}
                name="environmentalClass"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.input, styles.pickerContainer]}>
                    <Picker
                      selectedValue={value || ''}
                      onValueChange={onChange}
                      enabled={!loading}
                    >
                      <Picker.Item label="Selecionar..." value="" />
                      {environmentalClassOptions.map((option) => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
            </View>

            {/* Withdrawal Period */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Período de Carência (dias)</Text>
              <Controller
                control={control}
                name="withdrawalPeriod"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    placeholder="Ex: 7, 14, 21"
                    keyboardType="numeric"
                    editable={!loading}
                  />
                )}
              />
            </View>

            {/* Reentry Period */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Período de Reentrada (horas)</Text>
              <Controller
                control={control}
                name="reentryPeriod"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    placeholder="Ex: 12, 24, 48"
                    keyboardType="numeric"
                    editable={!loading}
                  />
                )}
              />
            </View>
          </Card>
        </>
      )}

      {/* Additional Information */}
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        
        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                placeholder="Descrição detalhada do produto..."
                multiline
                numberOfLines={3}
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
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                placeholder="Observações específicas..."
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            )}
          />
        </View>

        {/* Active Status */}
        <View style={styles.inputGroup}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Produto Ativo</Text>
            <Controller
              control={control}
              name="isActive"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={value ? '#2E7D32' : '#f4f3f4'}
                  disabled={loading}
                />
              )}
            />
          </View>
        </View>
      </Card>

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
          style={[styles.button, styles.submitButton, !isValid && styles.disabledButton]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={loading || !isValid}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Salvando...</Text>
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  formCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
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
  pickerContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dosageInput: {
    flex: 1,
  },
  dosageSeparator: {
    fontSize: 14,
    color: '#666',
  },
  dosageUnit: {
    flex: 0.7,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 8,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    borderColor: '#999',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ProductRegistrationForm;