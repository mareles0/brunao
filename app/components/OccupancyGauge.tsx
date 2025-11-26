import React from 'react';

interface OccupancyGaugeProps {
  percentage: number;
}

const OccupancyGauge: React.FC<OccupancyGaugeProps> = ({ percentage }) => {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(percentage, 100));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="bg-park-dark-secondary text-white p-3 rounded-lg shadow-lg flex flex-col items-center justify-center h-full">
      <span className="text-sm font-medium opacity-90 -mt-1 mb-1">Ocupação</span>
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <circle
            stroke="#4b5563"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#gaugeGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.3s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-lg font-bold">{`${clampedPercentage}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default OccupancyGauge;
