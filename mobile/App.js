import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { ParkingProvider } from './hooks/useParking';
import Dashboard from './components/Dashboard';
import VehicleEntry from './components/VehicleEntry';
import VehicleExit from './components/VehicleExit';
import SplashScreen from './components/SplashScreen';
import FullMapView from './components/FullMapView';
import VehicleConfirmation from './components/VehicleConfirmation';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import PaymentScreen from './components/PaymentScreen';

export default function App() {
  const [currentView, setCurrentView] = useState('splash');
  const [authView, setAuthView] = useState('login');
  const [showSplash, setShowSplash] = useState(true);
  const [confirmationData, setConfirmationData] = useState({ spaceId: '', plate: '' });
  const [paymentData, setPaymentData] = useState(null);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (sessionData, userData) => {
    setSession(sessionData);
    setUser(userData);
    setCurrentView('splash');
  };

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    setCurrentView('splash');
    setShowSplash(true);
    setAuthView('login');
  };

  // Se não estiver logado, mostrar telas de autenticação
  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {authView === 'login' ? (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterScreen 
            onRegisterSuccess={() => setAuthView('login')}
            onNavigateToLogin={() => setAuthView('login')}
          />
        )}
      </SafeAreaView>
    );
  }

  const handleSetView = (view, data) => {
    if (view === 'payment') {
      setPaymentData(data);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'entry':
        return <VehicleEntry setView={handleSetView} setConfirmationData={setConfirmationData} />;
      case 'exit':
        return <VehicleExit setView={handleSetView} />;
      case 'payment':
        return <PaymentScreen setView={handleSetView} route={{ params: paymentData }} />;
      case 'fullmap':
        return <FullMapView setView={handleSetView} />;
      case 'confirmation':
        return <VehicleConfirmation setView={handleSetView} spaceId={confirmationData.spaceId} plate={confirmationData.plate} />;
      case 'dashboard':
      default:
        return <Dashboard setView={handleSetView} user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <ParkingProvider session={session}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {showSplash ? (
          <SplashScreen onStart={() => setShowSplash(false)} />
        ) : (
          renderView()
        )}
      </SafeAreaView>
    </ParkingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
