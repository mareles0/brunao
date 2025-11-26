import React from 'react';
import type { Vehicle } from '../types';
import { ClockIcon } from './icons';

interface RecentEntriesProps {
  vehicles: Vehicle[];
}

const formatDuration = (entryTime: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - entryTime.getTime();
    if (diffMs < 0) return '0m';
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
};

const RecentEntries: React.FC<RecentEntriesProps> = ({ vehicles }) => {
    const recentVehicles = [...vehicles]
        .sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime())
        .slice(0, 5);

    return (
        <div className="bg-park-dark-secondary p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Entradas Recentes</h3>
            {recentVehicles.length > 0 ? (
                <ul className="space-y-2">
                    {recentVehicles.map((vehicle) => (
                        <li key={vehicle.plate} className="flex items-center justify-between bg-park-dark p-3 rounded-md hover:bg-park-gray/20 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-mono font-bold text-lg text-white">{vehicle.plate}</span>
                                <span className="text-sm text-park-gray">Vaga: {vehicle.spaceId}</span>
                            </div>
                            <div className="flex items-center text-park-blue">
                                <ClockIcon className="w-4 h-4 mr-1.5" />
                                <span className="text-sm font-semibold">{formatDuration(vehicle.entryTime)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-park-gray text-center py-4">Nenhum veículo estacionado no momento.</p>
            )}
        </div>
    );
};

export default RecentEntries;