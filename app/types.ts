
export type SpaceStatus = 'free' | 'occupied' | 'reserved';

export interface ParkingSpace {
  id: string;
  status: SpaceStatus;
  vehiclePlate?: string | null;
}

export interface Vehicle {
  plate: string;
  entryTime: Date;
  spaceId: string;
}

export interface ParkingStats {
  totalSpaces: number;
  occupiedSpaces: number;
  freeSpaces: number;
  occupancyRate: number;
  averageStayTime: string;
}
