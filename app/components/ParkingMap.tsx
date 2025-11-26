import React from 'react';
import type { ParkingSpace, SpaceStatus, Vehicle } from '../types';

interface ParkingMapProps {
  spaces: ParkingSpace[];
  vehicles: Vehicle[];
  maxVisible?: number;
  showIds?: boolean;
}

const statusColors: Record<SpaceStatus, string> = {
  free: 'bg-park-green/80',
  occupied: 'bg-park-red/80',
  reserved: 'bg-park-yellow/80',
};

const formatDuration = (entryTime: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - entryTime.getTime();
    if (diffMs < 0) return '0h 0m';
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
};

const ParkingMap: React.FC<ParkingMapProps> = ({ spaces, vehicles, maxVisible, showIds = false }) => {
    const visibleSpaces = maxVisible ? spaces.slice(0, maxVisible) : spaces;

    return (
        <div className="bg-park-dark-secondary p-4 rounded-lg">
            <div className={`grid gap-2 ${showIds ? 'grid-cols-5' : 'grid-cols-5'}`}>
                {visibleSpaces.map((space) => {
                    const isOccupied = space.status === 'occupied';
                    let vehicle: Vehicle | undefined;
                    if (isOccupied && space.vehiclePlate) {
                        vehicle = vehicles.find(v => v.plate === space.vehiclePlate);
                    }

                    return (
                        <div
                            key={space.id}
                            className={`relative group w-full h-8 rounded ${statusColors[space.status]} flex items-center justify-center text-white font-mono transition-colors duration-300`}
                        >
                           {showIds && <span className="text-sm font-bold select-none">{space.id}</span>}
                           {isOccupied && vehicle && (
                                <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                    <p className="font-bold">Placa: {vehicle.plate}</p>
                                    <p>Tempo: {formatDuration(vehicle.entryTime)}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center space-x-4 mt-4 text-white text-xs">
                <div className="flex items-center"><span className="w-3 h-3 bg-park-green rounded-sm mr-2"></span> Livre</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-park-red rounded-sm mr-2"></span> Ocupada</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-park-yellow rounded-sm mr-2"></span> Reservada</div>
            </div>
        </div>
    );
};


export default ParkingMap;