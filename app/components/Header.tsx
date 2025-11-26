import React from 'react';
import { ArrowLeftIcon } from './icons';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, onBack }) => {
  return (
    <header className="bg-park-dark-secondary text-white p-4 flex items-center justify-center shadow-md sticky top-0">
      {showBackButton && (
        <button onClick={onBack} className="text-white absolute left-4">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
};

export default Header;
