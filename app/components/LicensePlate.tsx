
import React from 'react';

interface LicensePlateProps {
    plate: string;
}

const LicensePlate: React.FC<LicensePlateProps> = ({ plate }) => {
    const formattedPlate = plate || '       ';
    return (
        <div className="bg-white border-4 border-black rounded-lg w-full max-w-sm mx-auto font-mono shadow-lg">
            <div className="bg-blue-800 text-white flex items-center justify-between px-3 py-1 rounded-t-md">
                <span className="text-xs font-bold">BRASIL</span>
                <svg width="24" height="18" viewBox="0 0 720 510" className="ml-2">
                    <rect width="720" height="510" fill="#009c3b" />
                    <path d="M360 85L80 255l280 170 280-170z" fill="#ffdf00" />
                    <circle cx="360" cy="255" r="105" fill="#002776" />
                </svg>
            </div>
            <div className="text-black text-6xl md:text-7xl font-bold tracking-widest text-center py-4">
                {formattedPlate}
            </div>
        </div>
    );
};

export default LicensePlate;
