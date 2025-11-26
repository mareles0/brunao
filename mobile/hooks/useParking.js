import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ParkingContext = createContext();

export const ParkingProvider = ({ children, session }) => {
  const [spaces, setSpaces] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [stats, setStats] = useState({
    totalSpaces: 300,
    occupiedSpaces: 0,
    freeSpaces: 300,
    occupancyRate: 0,
    averageStayTime: '0h 0min',
    myStayTime: '0h 0min'
  });
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Configurar token de autenticação
  useEffect(() => {
    if (session?.access_token) {
      apiService.setAuthToken(session.access_token);
    }
  }, [session]);

  const refreshData = async () => {
    try {
      // Só mostra loading na primeira carga
      if (isFirstLoad) {
        setLoading(true);
      }
      const [spacesData, statsData, sessionsData] = await Promise.all([
        apiService.getAllSpaces(),
        apiService.getStatistics(),
        apiService.getMySessions().catch(() => [])
      ]);
      
      setSpaces(spacesData);
      setStats(statsData);
      setMySessions(sessionsData);

      // Calcular tempo de permanência do usuário
      if (sessionsData && sessionsData.length > 0) {
        const activeSession = sessionsData[0];
        const entryTime = new Date(activeSession.entry_time);
        const now = new Date();
        const durationMinutes = Math.floor((now - entryTime) / (1000 * 60));
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        setStats(prev => ({
          ...prev,
          myStayTime: `${hours}h ${minutes}min`
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      if (isFirstLoad) {
        setLoading(false);
        setIsFirstLoad(false);
      }
    }
  };

  useEffect(() => {
    refreshData();
    
    // Atualizar a cada 5 segundos
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const parkVehicle = async (plate, spaceId) => {
    try {
      await apiService.parkVehicle(plate, spaceId);
      await refreshData();
      return { success: true, message: 'Entrada registrada com sucesso!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const unparkVehicle = async (plate) => {
    try {
      console.log('Tentando remover veículo:', plate);
      const response = await apiService.unparkVehicle(plate);
      console.log('Resposta da API:', response);
      await refreshData();
      return { success: true, message: response.message || 'Veículo removido com sucesso!' };
    } catch (err) {
      console.error('Erro ao remover veículo:', err);
      return { success: false, message: err.message || 'Erro ao processar saída' };
    }
  };

  const findNextFreeSpot = () => {
    return spaces.find(s => s.status === 'free');
  };

  const getOccupiedPlates = () => {
    return vehicles.map(v => v.plate);
  };

  const findVehicleInfo = (plate) => {
    const vehicle = vehicles.find(v => v.plate.toUpperCase() === plate.toUpperCase());
    if (!vehicle) return null;

    const stayMillis = Date.now() - vehicle.entryTime.getTime();
    const hours = Math.floor(stayMillis / (1000 * 60 * 60));
    const minutes = Math.floor((stayMillis % (1000 * 60 * 60)) / (1000 * 60));
    const stayDuration = `${hours}h ${minutes}min`;

    return { vehicle, stayDuration };
  };

  return (
    <ParkingContext.Provider value={{
      spaces,
      vehicles,
      stats,
      mySessions,
      loading,
      parkVehicle,
      unparkVehicle,
      findNextFreeSpot,
      getOccupiedPlates,
      findVehicleInfo,
      refreshData
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
