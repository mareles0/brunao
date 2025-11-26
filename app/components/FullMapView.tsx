import React from 'react';
import type { View } from '../App';
import Header from './Header';
import ParkingMap from './ParkingMap';
import { useParking } from '../hooks/useParking';

interface FullMapViewProps {
  setView: (view: View) => void;
}

const FullMapView: React.FC<FullMapViewProps> = ({ setView }) => {
  const { spaces, vehicles } = useParking();

  return (
    <div className="flex flex-col h-full bg-park-dark text-white">
      <Header title="Mapa Completo do Estacionamento" showBackButton onBack={() => setView('dashboard')} />
      <main className="flex-grow p-4 overflow-y-auto">
        <ParkingMap spaces={spaces} vehicles={vehicles} showIds={true} />
      </main>
    </div>
  );
};

export default FullMapView;
