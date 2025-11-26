import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useParking } from '../hooks/useParking';

export default function VehicleEntry({ setView, setConfirmationData }) {
  const [plate, setPlate] = useState('');
  const [suggestedSpot, setSuggestedSpot] = useState(null);
  const { parkVehicle, findNextFreeSpot, getOccupiedPlates } = useParking();

  const generateRandomPlate = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const randomChar = (source) => source.charAt(Math.floor(Math.random() * source.length));
    
    let newPlate = '';
    const occupiedPlates = getOccupiedPlates();
    do {
      newPlate = `${randomChar(letters)}${randomChar(letters)}${randomChar(letters)}${randomChar(digits)}${randomChar(letters)}${randomChar(digits)}${randomChar(digits)}`;
    } while (occupiedPlates.includes(newPlate));
    
    return newPlate;
  };

  const handleFindSpace = () => {
    if (!plate) {
      Alert.alert('Atenção', 'Por favor, insira ou detecte uma placa.');
      return;
    }

    if (getOccupiedPlates().includes(plate)) {
      Alert.alert('Erro', 'Veículo com esta placa já está estacionado.');
      return;
    }

    const spot = findNextFreeSpot();
    if (spot) {
      setSuggestedSpot(spot);
    } else {
      Alert.alert('Lotado', 'Estacionamento sem vagas disponíveis!');
    }
  };

  const handleConfirm = async () => {
    if (!suggestedSpot || !plate) return;
    
    const result = await parkVehicle(plate, suggestedSpot.id);
    if (result.success) {
      setConfirmationData({ spaceId: suggestedSpot.id, plate });
      setView('confirmation');
    } else {
      Alert.alert('Erro', result.message);
      setSuggestedSpot(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setView('dashboard')}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Entrada de Veículo</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.plateDisplay}>
          <Text style={styles.plateText}>{plate || '-------'}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="DIGITE A PLACA"
          value={plate}
          onChangeText={(text) => setPlate(text.toUpperCase())}
          maxLength={7}
          autoCapitalize="characters"
        />

        <TouchableOpacity 
          style={[styles.button, !plate && styles.buttonDisabled]} 
          onPress={handleFindSpace}
          disabled={!plate}
        >
          <Text style={styles.buttonText}>Buscar Vaga</Text>
        </TouchableOpacity>

        {suggestedSpot && (
          <View style={styles.spotCard}>
            <Text style={styles.spotTitle}>Vaga Sugerida</Text>
            <Text style={styles.spotId}>{suggestedSpot.id}</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>✓ Confirmar Vaga</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  plateDisplay: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 3,
    borderColor: '#111827',
  },
  plateText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#111827',
  },
  detectButton: {
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    elevation: 2,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spotCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  spotTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 10,
  },
  spotId: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
