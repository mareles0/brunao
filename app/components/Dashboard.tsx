import React from 'react';
import type { View } from '../App';
import Header from './Header';
import StatCard from './StatCard';
import ParkingMap from './ParkingMap';
import { useParking } from '../hooks/useParking';
import { CarIcon, ClockIcon } from './icons';
import OccupancyGauge from './OccupancyGauge';

interface DashboardProps {
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const { stats, spaces, vehicles } = useParking();

  return (
    <div className="flex flex-col h-full bg-park-dark text-white">
      <Header title="Painel Principal" />
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total de Vagas" value={stats.totalSpaces} color="blue" icon={<CarIcon />} />
            <StatCard label="Vagas Ocupadas" value={stats.occupiedSpaces} color="red" />
        </div>
        <div className="grid grid-cols-3 gap-4">
            <StatCard label="Vagas Livres" value={stats.freeSpaces} color="green" small />
            <StatCard label="Tempo Médio" value={stats.averageStayTime} color="orange" small icon={<ClockIcon className="w-4 h-4" />} />
            <OccupancyGauge percentage={stats.occupancyRate} />
        </div>
        
        <ParkingMap spaces={spaces} vehicles={vehicles} maxVisible={50} showIds={true}/>

        <button 
            onClick={() => setView('fullmap')}
            className="w-full bg-park-blue text-white py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(59,130,246,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(59,130,246,0.5)] focus:outline-none"
        >
            Ver Mapa Completo
        </button>
      </main>
      <footer className="p-4 grid grid-cols-2 gap-4">
          <button 
              onClick={() => setView('entry')}
              className="bg-park-green text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(34,197,94,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(34,197,94,0.5)] focus:outline-none"
          >
              ENTRADA
          </button>
          <button 
              onClick={() => setView('exit')}
              className="bg-park-red text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(239,68,68,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(239,68,68,0.5)] focus:outline-none"
          >
              SAÍDA
          </button>
      </footer>
    </div>
  );
};

export default Dashboard;