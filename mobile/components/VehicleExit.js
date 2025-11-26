import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useParking } from '../hooks/useParking';

export default function VehicleExit({ setView }) {
  const [plate, setPlate] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const { mySessions, unparkVehicle } = useParking();

  const handleSearch = (searchPlate) => {
    const plateToSearch = searchPlate || plate;
    
    if (!plateToSearch || typeof plateToSearch !== 'string' || plateToSearch.trim() === '') {
      Alert.alert('Atenção', 'Por favor, insira ou detecte uma placa.');
      return;
    }

    const session = mySessions?.find(s => s.plate && s.plate.toUpperCase() === plateToSearch.toUpperCase());
    if (session) {
      const entryTime = new Date(session.entry_time);
      const now = new Date();
      const durationMinutes = Math.floor((now - entryTime) / (1000 * 60));
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const stayDuration = `${hours}h ${minutes}min`;

      // Calcular custo (R$ 5,00 por hora, mínimo 1 hora)
      const hoursForCost = Math.max(1, Math.ceil(durationMinutes / 60));
      const cost = hoursForCost * 5.0;

      setVehicleInfo({
        plate: session.plate,
        spaceId: session.space_id,
        stayDuration,
        cost: `R$ ${cost.toFixed(2)}`
      });
    } else {
      Alert.alert('Erro', 'Veículo não encontrado ou você não tem permissão para removê-lo.');
      setVehicleInfo(null);
    }
  };

  const handleConfirm = () => {
    if (!vehicleInfo) return;
    
    // Redirecionar para tela de pagamento
    setView('payment', { vehicleInfo });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setView('dashboard')}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saída de Veículo</Text>
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
          onPress={() => handleSearch()}
          disabled={!plate}
        >
          <Text style={styles.buttonText}>Buscar Veículo</Text>
        </TouchableOpacity>

        {vehicleInfo && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informações do Veículo</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{vehicleInfo.plate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vaga:</Text>
              <Text style={styles.infoValue}>{vehicleInfo.spaceId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tempo:</Text>
              <Text style={styles.infoValue}>{vehicleInfo.stayDuration}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor a Pagar:</Text>
              <Text style={styles.infoValueHighlight}>{vehicleInfo.cost}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>💰 Ir para Pagamento</Text>
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
    backgroundColor: '#ef4444',
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: '#ef4444',
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
  infoCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  infoValueHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
