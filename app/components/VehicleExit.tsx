import React, { useState } from 'react';
import type { View } from '../App';
import Header from './Header';
import LicensePlate from './LicensePlate';
import { useParking } from '../hooks/useParking';
import type { Vehicle } from '../types';
import { CameraIcon, CheckCircleIcon } from './icons';

interface VehicleExitProps {
  setView: (view: View) => void;
}

interface VehicleInfo {
  vehicle: Vehicle;
  stayDuration: string;
}

const VehicleExit: React.FC<VehicleExitProps> = ({ setView }) => {
    const [plate, setPlate] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { findVehicleInfo, unparkVehicle, getOccupiedPlates } = useParking();

    const handleDetectPlate = () => {
        const occupiedPlates = getOccupiedPlates();
        if (occupiedPlates.length > 0) {
            const randomPlate = occupiedPlates[Math.floor(Math.random() * occupiedPlates.length)];
            setPlate(randomPlate);
        } else {
            setError("Nenhum veículo estacionado para simular a saída.");
        }
        setVehicleInfo(null);
        setError(null);
        setSuccessMessage(null);
    };

    const handleVerifyExit = () => {
        if (!plate) {
            setError("Por favor, detecte ou insira uma placa.");
            return;
        }

        const info = findVehicleInfo(plate);
        if (info) {
            setVehicleInfo(info);
            setError(null);
        } else {
            setError("Veículo não encontrado ou já saiu.");
            setVehicleInfo(null);
        }
        setSuccessMessage(null);
    };
    
    const handleConfirmExit = async () => {
        if (!vehicleInfo) return;
        
        const result = await unparkVehicle(vehicleInfo.vehicle.plate);
        if(result.success) {
            setSuccessMessage(`Saída registrada com sucesso! ${result.message}`);
            setVehicleInfo(null);
            setPlate('');
        } else {
            setError(result.message);
        }
    };

    if (successMessage) {
        return (
            <div className="flex flex-col h-full bg-gray-100 dark:bg-park-dark">
                <Header title="Saída de Veículo" showBackButton onBack={() => setView('dashboard')} />
                <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                    <div className="bg-park-green text-white p-6 rounded-lg shadow-lg w-full">
                        <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">{successMessage}</h2>
                    </div>
                    <button
                        onClick={() => setView('dashboard')}
                        className="mt-8 bg-park-blue text-white py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(59,130,246,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(59,130,246,0.5)] focus:outline-none"
                    >
                        Voltar ao Painel
                    </button>
                </main>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-park-dark dark:text-white">
            <Header title="Saída de Veículo" showBackButton onBack={() => setView('dashboard')} />
            <main className="flex-grow p-6 flex flex-col justify-between">
                <div>
                    <div className="space-y-6 text-center">
                        <LicensePlate plate={plate} />
                        <input
                            type="text"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value.toUpperCase())}
                            placeholder="OU DIGITE A PLACA"
                            maxLength={7}
                            className="w-full text-center p-3 border-2 border-gray-300 rounded-lg text-lg font-mono tracking-widest focus:outline-none focus:border-park-blue dark:bg-park-dark-secondary dark:border-gray-600"
                        />
                        <button 
                            onClick={handleDetectPlate}
                            className="w-full bg-park-orange text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(249,115,22,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(249,115,22,0.5)] focus:outline-none"
                        >
                            <CameraIcon className="w-6 h-6" />
                            <span>Detectar Placa</span>
                        </button>
                        <button 
                            onClick={handleVerifyExit}
                            className="w-full bg-park-blue text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(59,130,246,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(59,130,246,0.5)] focus:outline-none disabled:bg-park-gray disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                            disabled={!plate}
                        >
                            Verificar Saída
                        </button>
                        {error && <p className="text-park-red font-semibold mt-4">{error}</p>}
                    </div>
                </div>
                
                {vehicleInfo && (
                    <div className="bg-white dark:bg-park-dark-secondary border border-gray-200 dark:border-gray-600 p-6 rounded-lg shadow-md mt-4 text-gray-800 dark:text-gray-200">
                        <h3 className="text-2xl font-bold mb-4">Informações do Veículo</h3>
                        <div className="space-y-2 text-lg">
                            <p><strong>Placa:</strong> {vehicleInfo.vehicle.plate}</p>
                            <p><strong>Vaga:</strong> <span className="font-bold text-park-green">{vehicleInfo.vehicle.spaceId}</span></p>
                            <p><strong>Horário de Entrada:</strong> {vehicleInfo.vehicle.entryTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p><strong>Tempo de Permanência:</strong> {vehicleInfo.stayDuration}</p>
                        </div>
                         <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleConfirmExit}
                                className="flex-1 bg-park-green text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(34,197,94,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(34,197,94,0.5)] focus:outline-none"
                            >
                                Confirmar Saída
                            </button>
                            <button 
                                onClick={() => setVehicleInfo(null)}
                                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold dark:bg-park-gray dark:text-white transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_6px_15px_rgba(0,0,0,0.3)] focus:outline-none">
                                Cancelar / Voltar
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default VehicleExit;