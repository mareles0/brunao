import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useParking } from '../hooks/useParking';

export default function Dashboard({ setView, user, onLogout }) {
  const { stats, spaces, mySessions, loading, refreshData } = useParking();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setLastUpdate(new Date());
    setRefreshing(false);
  };

  const getTimeAgo = () => {
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    if (seconds < 5) return 'agora';
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min atrás`;
  };

  const renderParkingSpaces = () => {
    const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    return sections.map(section => (
      <View key={section} style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Seção {section}</Text>
        <View style={styles.sectionRow}>
          {Array.from({ length: 20 }, (_, i) => {
            const spaceId = `${section}${String(i + 1).padStart(2, '0')}`;
            const space = spaces.find(s => s.id === spaceId);
            const isOccupied = space?.status === 'occupied';
            
            return (
              <View 
                key={spaceId} 
                style={[
                  styles.parkingSpace,
                  isOccupied ? styles.parkingSpaceOccupied : styles.parkingSpaceFree
                ]}
              >
                <Text style={[styles.spaceText, isOccupied && styles.spaceTextOccupied]}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Painel Principal</Text>
          {user && <Text style={styles.userName}>Olá, {user.fullName || user.email}</Text>}
          <View style={styles.updateInfo}>
            <Text style={styles.updateText}>🔄 Atualizado {getTimeAgo()}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.refreshButton, refreshing && styles.refreshButtonDisabled]} 
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? '⟳' : '↻'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.statLabel}>Total de Vagas</Text>
            <Text style={styles.statValue}>{stats.totalSpaces}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#22c55e' }]}>
            <Text style={styles.statLabel}>Vagas Livres</Text>
            <Text style={styles.statValue}>{stats.freeSpaces}</Text>
          </View>
          {mySessions && mySessions.length > 0 && (
            <View style={[styles.statCard, { backgroundColor: '#f97316' }]}>
              <Text style={styles.statLabel}>Meu Tempo</Text>
              <Text style={styles.statValue}>{stats.myStayTime}</Text>
            </View>
          )}
          {user?.role === 'admin' && (
            <>
              <View style={[styles.statCard, { backgroundColor: '#ef4444' }]}>
                <Text style={styles.statLabel}>Vagas Ocupadas</Text>
                <Text style={styles.statValue}>{stats.occupiedSpaces}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
                <Text style={styles.statLabel}>Receita do Dia</Text>
                <Text style={styles.statValue}>R$ {stats.dailyRevenue?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
                <Text style={styles.statLabel}>Receita Total</Text>
                <Text style={styles.statValue}>R$ {stats.totalRevenue?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={[styles.statCard, styles.occupancyCard]}>
                <Text style={styles.occupancyLabel}>Ocupação</Text>
                <Text style={styles.occupancyValue}>{stats.occupancyRate}%</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.mapSectionTitle}>Mapa de Vagas</Text>
          <ScrollView 
            style={styles.mapContainer}
            nestedScrollEnabled={true}
          >
            {renderParkingSpaces()}
          </ScrollView>
        </View>

        {user?.role !== 'admin' && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonEntry} onPress={() => setView('entry')}>
              <Text style={styles.buttonText}>ENTRADA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonExit} onPress={() => setView('exit')}>
              <Text style={styles.buttonText}>SAÍDA</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#1f2937',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  updateInfo: {
    marginTop: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  occupancyCard: {
    width: '100%',
    backgroundColor: '#1f2937',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  occupancyLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 5,
  },
  occupancyValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  mapSection: {
    margin: 15,
    marginBottom: 0,
  },
  mapSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  mapContainer: {
    backgroundColor: '#1f2937',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    maxHeight: 400,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  parkingSpace: {
    width: 40,
    height: 40,
    margin: 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  parkingSpaceFree: {
    backgroundColor: '#064e3b',
    borderColor: '#22c55e',
  },
  parkingSpaceOccupied: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444',
  },
  spaceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  spaceTextOccupied: {
    color: '#ef4444',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  buttonEntry: {
    flex: 1,
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonExit: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
