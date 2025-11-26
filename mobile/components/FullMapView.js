import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useParking } from '../hooks/useParking';

export default function FullMapView({ setView }) {
  const { spaces } = useParking();

  const getSpaceColor = (status) => {
    switch (status) {
      case 'occupied':
        return '#ef4444';
      case 'free':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const sections = {};
  spaces.forEach(space => {
    const section = space.id.charAt(0);
    if (!sections[section]) {
      sections[section] = [];
    }
    sections[section].push(space);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setView('dashboard')}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mapa de Vagas</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>Livre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Ocupada</Text>
        </View>
      </View>

      <ScrollView style={styles.mapContainer}>
        {Object.keys(sections).sort().map(section => (
          <View key={section} style={styles.section}>
            <Text style={styles.sectionTitle}>Seção {section}</Text>
            <View style={styles.spacesGrid}>
              {sections[section].map(space => (
                <View
                  key={space.id}
                  style={[
                    styles.spaceBox,
                    { backgroundColor: getSpaceColor(space.status) }
                  ]}
                >
                  <Text style={styles.spaceText}>{space.id}</Text>
                  {space.vehiclePlate && (
                    <Text style={styles.plateText}>{space.vehiclePlate}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  mapContainer: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  spacesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  spaceBox: {
    width: 70,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    elevation: 2,
  },
  spaceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  plateText: {
    color: '#fff',
    fontSize: 9,
    marginTop: 2,
  },
});
