import React from 'react';
import { ParkEasyLogo } from './icons';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col h-full bg-park-dark text-white items-center justify-center text-center p-8">
      <div className="flex-grow flex flex-col items-center justify-center">
        <ParkEasyLogo className="h-32 w-auto text-white" />
        <h1 className="text-5xl font-bold mt-6 tracking-tight">
          Estacione <span className="text-park-blue">Fácil</span>
        </h1>
        <p className="text-park-gray mt-2">Sua vaga inteligente espera por você.</p>
      </div>
      <button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-[#3A7BD5] to-[#00D2FF] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_5px_15px_rgba(58,123,213,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),_0_8px_20px_rgba(58,123,213,0.5)] focus:outline-none"
      >
        Acessar Vagas
      </button>
    </div>
  );
};

export default SplashScreen;
