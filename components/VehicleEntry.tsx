import React, { useState } from 'react';
import type { View } from '../App';
import Header from './Header';
import LicensePlate from './LicensePlate';
import { useParking } from '../hooks/useParking';
import { CameraIcon, CheckCircleIcon } from './icons';
import type { ParkingSpace } from '../types';

interface VehicleEntryProps {
  setView: (view: View) => void;
}

const VehicleEntry: React.FC<VehicleEntryProps> = ({ setView }) => {
    const [plate, setPlate] = useState('');
    const [suggestedSpot, setSuggestedSpot] = useState<ParkingSpace | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmationData, setConfirmationData] = useState<{ plate: string; spotId: string } | null>(null);
    const { parkVehicle, findNextFreeSpot, getOccupiedPlates } = useParking();

    const generateMercosurPlate = (): string => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const randomChar = (source: string) => source.charAt(Math.floor(Math.random() * source.length));
        
        let newPlate = '';
        const occupiedPlates = getOccupiedPlates();
        do {
          newPlate = `${randomChar(letters)}${randomChar(letters)}${randomChar(letters)}${randomChar(digits)}${randomChar(letters)}${randomChar(digits)}${randomChar(digits)}`;
        } while (occupiedPlates.includes(newPlate));
        
        return newPlate;
    };

    const handleDetectPlate = () => {
        setPlate(generateMercosurPlate());
        setError(null);
        setSuggestedSpot(null);
    };

    const handleVerifyPlate = () => {
        if (!plate) {
            setError('Por favor, detecte ou insira uma placa.');
            return;
        }
        if (getOccupiedPlates().includes(plate)) {
            setError('Veículo com esta placa já está estacionado.');
            setSuggestedSpot(null);
            return;
        }

        const spot = findNextFreeSpot();
        if (spot) {
            setSuggestedSpot(spot);
            setError(null);
        } else {
            setError('Estacionamento Lotado!');
            setSuggestedSpot(null);
        }
    };
    
    const handleSelectAnother = () => {
        if (!suggestedSpot) return;
        const anotherSpot = findNextFreeSpot(suggestedSpot.id);
        if (anotherSpot) {
            setSuggestedSpot(anotherSpot);
        } else {
            setError('Nenhuma outra vaga livre encontrada.');
        }
    };

    const handleConfirmVaga = async () => {
        if (!suggestedSpot || !plate) return;
        const result = await parkVehicle(plate, suggestedSpot.id);
        if (result.success) {
            setConfirmationData({ plate, spotId: suggestedSpot.id });
        } else {
            setError(result.message);
            const newSpot = findNextFreeSpot();
            setSuggestedSpot(newSpot);
            if (!newSpot) {
                setError('Estacionamento Lotado!');
            }
        }
    };

    if (confirmationData) {
        return (
            <div className="flex flex-col h-full bg-gray-100 dark:bg-park-dark dark:text-white">
                <Header title="Vaga Confirmada" showBackButton onBack={() => setView('dashboard')} />
                <main className="flex-grow p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <CheckCircleIcon className="w-20 h-20 text-park-green" />
                    <h2 className="text-2xl font-bold">
                        Vaga <span className="text-park-blue font-mono">{confirmationData.spotId}</span> reservada!
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Dirija-se à vaga indicada no mapa abaixo.</p>
                    
                    <div className="w-full max-w-xs p-2 bg-park-dark-secondary rounded-lg border-2 border-park-gray shadow-lg">
                        <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                            <text x="10" y="140" fill="#a0aec0" fontSize="10" fontFamily="sans-serif">ENTRADA</text>
                            <path d="M25 130 L25 120" stroke="#a0aec0" strokeWidth="2"/>
                            
                            <g transform="translate(20, 100) scale(0.8)">
                                <path d="M5,1 L15,1 L17,6 L3,6 Z" fill="#3b82f6"/>
                                <rect x="3" y="6" width="14" height="5" fill="#3b82f6"/>
                                <circle cx="6" cy="11" r="2" fill="black"/>
                                <circle cx="14" cy="11" r="2" fill="black"/>
                            </g>

                            <path d="M25 95 Q 80 95, 80 50 T 150 25" stroke="#eab308" strokeWidth="2" strokeDasharray="4" fill="none"/>
                            
                            <path d="M150 25 L145 23 L145 27 Z" fill="#eab308"/>

                            <rect x="160" y="15" width="30" height="20" fill="#22c55e" rx="2"/>
                            <text x="175" y="30" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{confirmationData.spotId}</text>
                        </svg>
                    </div>

                    <button
                        onClick={() => setView('dashboard')}
                        className="w-full bg-park-blue text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(59,130,246,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(59,130,246,0.5)] focus:outline-none mt-4"
                    >
                        Voltar ao Painel Principal
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-park-dark dark:text-white">
            <Header title="Entrada de Veículo" showBackButton onBack={() => setView('dashboard')} />
            <main className="flex-grow p-6 flex flex-col justify-between">
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
                        onClick={handleVerifyPlate}
                        className="w-full bg-park-blue text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(59,130,246,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(59,130,246,0.5)] focus:outline-none disabled:bg-park-gray disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                        disabled={!plate}
                    >
                        Verificar Placa
                    </button>
                    {error && <p className="text-park-red font-semibold">{error}</p>}
                </div>
                
                {suggestedSpot && (
                    <div className="bg-blue-100 dark:bg-park-dark-secondary border border-blue-300 dark:border-park-blue p-4 rounded-lg mt-4 text-center">
                        <p className="text-gray-700 dark:text-gray-300">Vaga Sugerida:</p>
                        <div className="flex justify-center items-center my-2">
                          <div className="bg-white dark:bg-park-dark border-4 border-park-green rounded-md w-40 h-20 flex items-center justify-center">
                              <p className="text-4xl font-bold text-park-blue font-mono">{suggestedSpot.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleConfirmVaga}
                                className="flex-1 bg-park-green text-white py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_5px_15px_rgba(34,197,94,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(34,197,94,0.5)] focus:outline-none"
                            >
                                Confirmar Vaga
                            </button>
                            <button 
                                onClick={handleSelectAnother}
                                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold dark:bg-park-gray dark:text-white transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_6px_15px_rgba(0,0,0,0.3)] focus:outline-none">
                                Selecionar Outra
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default VehicleEntry;