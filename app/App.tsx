import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import VehicleEntry from './components/VehicleEntry';
import VehicleExit from './components/VehicleExit';
import SplashScreen from './components/SplashScreen';
import FullMapView from './components/FullMapView';
import { ParkingProvider } from './hooks/useParking';

export type View = 'dashboard' | 'entry' | 'exit' | 'fullmap';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'entry':
        return <VehicleEntry setView={setCurrentView} />;
      case 'exit':
        return <VehicleExit setView={setCurrentView} />;
      case 'fullmap':
        return <FullMapView setView={setCurrentView} />;
      case 'dashboard':
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <ParkingProvider>
      <div className="bg-white dark:bg-park-dark min-h-screen font-sans">
        <div className="max-w-md mx-auto h-screen flex flex-col">
          {showSplash ? (
            <SplashScreen onStart={() => setShowSplash(false)} />
          ) : (
            renderView()
          )}
        </div>
      </div>
    </ParkingProvider>
  );
};

export default App;