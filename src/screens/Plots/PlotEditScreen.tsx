import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPlot, updatePlot, fetchPlotById, getNextPlotNumber } from '../../store/slices/plotsSlice';
import PlotForm from '../../components/forms/PlotForm';
import { PlotsStackParamList } from '../../types/navigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

type PlotEditScreenRouteProp = RouteProp<PlotsStackParamList, 'PlotEdit'>;
type PlotEditScreenNavigationProp = NativeStackNavigationProp<PlotsStackParamList, 'PlotEdit'>;

const PlotEditScreen: React.FC = () => {
  const route = useRoute<PlotEditScreenRouteProp>();
  const navigation = useNavigation<PlotEditScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const { selectedPlot, nextPlotNumber, loading, error } = useAppSelector((state) => state.plots);
  
  const isEditing = Boolean(route.params?.plotId);
  const plotId = route.params?.plotId;

  useEffect(() => {
    if (isEditing && plotId) {
      dispatch(fetchPlotById(plotId));
    } else {
      // Fetch next plot number for new plots
      dispatch(getNextPlotNumber());
    }
  }, [dispatch, isEditing, plotId]);

  const handleSubmit = async (formData: any) => {
    try {
      const plotData = {
        ...formData,
        plantingDate: formData.plantingDate ? new Date(formData.plantingDate) : undefined,
      };

      if (isEditing && plotId) {
        await dispatch(updatePlot({ id: plotId, plotData })).unwrap();
        Alert.alert('Sucesso', 'Talhão atualizado com sucesso!');
      } else {
        await dispatch(createPlot(plotData)).unwrap();
        Alert.alert('Sucesso', 'Talhão criado com sucesso!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving plot:', error);
      Alert.alert('Erro', `Erro ao salvar talhão: ${error}`);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (isEditing && loading && !selectedPlot) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PlotForm
        initialData={isEditing ? selectedPlot || undefined : undefined}
        nextPlotNumber={nextPlotNumber}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={isEditing}
        loading={loading}
      />
    </View>
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
});

export default PlotEditScreen;