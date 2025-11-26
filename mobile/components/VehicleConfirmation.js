import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function VehicleConfirmation({ setView, spaceId, plate }) {
  const section = spaceId ? spaceId.charAt(0) : 'A';
  const spaceNumber = spaceId ? spaceId.substring(1) : '01';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✓ Reserva Confirmada!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.successCard}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Vaga Reservada com Sucesso!</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{plate}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vaga:</Text>
              <Text style={styles.infoValueHighlight}>{spaceId}</Text>
            </View>
          </View>

          <View style={styles.mapSection}>
            <Text style={styles.mapTitle}>Localização da Vaga</Text>
            <View style={styles.miniMap}>
              <Text style={styles.mapLabel}>Seção {section}</Text>
              <View style={styles.spotIndicator}>
                <Text style={styles.spotNumber}>{spaceNumber}</Text>
              </View>
              <Text style={styles.mapInstruction}>
                Siga para a seção {section}, vaga número {spaceNumber}
              </Text>
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>📌 Instruções:</Text>
            <Text style={styles.instructionItem}>• Dirija-se à seção {section}</Text>
            <Text style={styles.instructionItem}>• Procure pela vaga {spaceId}</Text>
            <Text style={styles.instructionItem}>• Estacione seu veículo</Text>
            <Text style={styles.instructionItem}>• Guarde seu comprovante</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setView('dashboard')}
        >
          <Text style={styles.buttonText}>Voltar ao Painel</Text>
        </TouchableOpacity>
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
    backgroundColor: '#22c55e',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoValueHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 15,
  },
  mapSection: {
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  miniMap: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  mapLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
  },
  spotIndicator: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  spotNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapInstruction: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
  instructions: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
