import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { ParkingSpace, Vehicle, ParkingStats } from '../types';
import apiService from '../services/apiService';

const TOTAL_SPACES = 300;

interface ParkingContextType {
  spaces: ParkingSpace[];
  vehicles: Vehicle[];
  stats: ParkingStats;
  parkVehicle: (plate: string, spaceId: string) => Promise<{ success: boolean; message: string }>;
  unparkVehicle: (plate: string) => Promise<{ success: boolean; message: string }>;
  findVehicleInfo: (plate: string) => { vehicle: Vehicle; stayDuration: string } | null;
  getOccupiedPlates: () => string[];
  findNextFreeSpot: (excludeId?: string) => ParkingSpace | undefined;
  refreshData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [spacesData, vehiclesData] = await Promise.all([
        apiService.getAllSpaces(),
        apiService.getAllVehicles()
      ]);
      
      setSpaces(spacesData as ParkingSpace[]);
      setVehicles(vehiclesData.map((v: any) => ({
        ...v,
        entryTime: new Date(v.entryTime)
      })) as Vehicle[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    const interval = setInterval(refreshData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo<ParkingStats>(() => {
    const occupiedSpaces = vehicles.length;
    const freeSpaces = TOTAL_SPACES - occupiedSpaces;
    const occupancyRate = (occupiedSpaces / TOTAL_SPACES) * 100;
    
    let totalStayMillis = 0;
    vehicles.forEach(v => {
      totalStayMillis += Date.now() - v.entryTime.getTime();
    });
    
    const avgMillis = vehicles.length > 0 ? totalStayMillis / vehicles.length : 0;
    const avgHours = Math.floor(avgMillis / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgMillis % (1000 * 60 * 60)) / (1000 * 60));
    const averageStayTime = `${avgHours}h ${avgMinutes}min`;

    return {
      totalSpaces: TOTAL_SPACES,
      occupiedSpaces,
      freeSpaces,
      occupancyRate: Math.round(occupancyRate),
      averageStayTime
    };
  }, [vehicles]);

  const findNextFreeSpot = (excludeId?: string): ParkingSpace | undefined => {
    return spaces.find(s => s.status === 'free' && s.id !== excludeId);
  };

  const parkVehicle = async (plate: string, spaceId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.parkVehicle(plate, spaceId);
      await refreshData();
      return { success: true, message: 'Entrada registrada com sucesso!' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao estacionar veículo';
      return { success: false, message: errorMessage };
    }
  };

  const unparkVehicle = async (plate: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response: any = await apiService.unparkVehicle(plate);
      await refreshData();
      return { success: true, message: response.message || 'Veículo removido com sucesso!' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover veículo';
      return { success: false, message: errorMessage };
    }
  };

  const findVehicleInfo = (plate: string): { vehicle: Vehicle; stayDuration: string } | null => {
    const vehicle = vehicles.find(v => v.plate.toUpperCase() === plate.toUpperCase());
    if (!vehicle) return null;

    const stayMillis = Date.now() - vehicle.entryTime.getTime();
    const hours = Math.floor(stayMillis / (1000 * 60 * 60));
    const minutes = Math.floor((stayMillis % (1000 * 60 * 60)) / (1000 * 60));
    const stayDuration = `${hours}h ${minutes}min`;

    return { vehicle, stayDuration };
  };

  const getOccupiedPlates = (): string[] => {
    return vehicles.map(v => v.plate);
  };

  return (
    <ParkingContext.Provider 
      value={{ 
        spaces, 
        vehicles, 
        stats, 
        parkVehicle, 
        unparkVehicle, 
        findVehicleInfo, 
        getOccupiedPlates, 
        findNextFreeSpot,
        refreshData,
        loading,
        error
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = (): ParkingContextType => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
