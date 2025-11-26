
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  color: 'blue' | 'red' | 'green' | 'orange' | 'gray';
  icon?: React.ReactNode;
  small?: boolean;
}

const colorClasses = {
  blue: 'bg-park-blue',
  red: 'bg-park-red',
  green: 'bg-park-green',
  orange: 'bg-park-orange',
  gray: 'bg-park-dark-secondary',
};

const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon, small = false }) => {
  const cardColor = colorClasses[color] || colorClasses.gray;

  if(small) {
    return (
      <div className={`${cardColor} text-white p-3 rounded-lg shadow-lg flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
              <span className="text-sm font-medium opacity-90">{label}</span>
              {icon && <div className="text-xl opacity-70">{icon}</div>}
          </div>
          <span className="text-2xl font-bold mt-1">{value}</span>
      </div>
    );
  }

  return (
    <div className={`${cardColor} text-white p-4 rounded-lg shadow-lg flex flex-col justify-between h-24`}>
        <div className="flex items-center justify-between">
            <span className="text-base font-semibold">{label}</span>
            {icon && <div className="text-3xl opacity-80">{icon}</div>}
        </div>
        <span className="text-4xl font-bold">{value}</span>
    </div>
  );
};

export default StatCard;
