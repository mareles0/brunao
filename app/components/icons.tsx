import React from 'react';

export const CarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm4.25-4.58l-1.41 1.41L16.36 9.36l1.41-1.41zM11 6.05V3h2v3.05zM4.93 7.94l1.41-1.41L7.76 5.11 6.34 6.53zm12.73 0l1.41 1.41-1.41 1.41-1.41-1.41z"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3.2"/>
    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

export const ParkEasyLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        {/* The container for the E, open to the right */}
        <path d="M52,70H12C5.373,70,0,64.627,0,58V12C0,5.373,5.373,0,12,0H52c6.627,0,12,5.373,12,12V28" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* The Car */}
        <g transform="translate(12, 38)">
            <path d="M1,7 C1,4.23858,3.23858,2,6,2 H24 C26.7614,2,29,4.23858,29,7 V12 H1 Z" />
            <circle cx="7" cy="15" r="4" />
            <circle cx="23" cy="15" r="4" />
        </g>

        {/* The E lines */}
        <line x1="0" y1="20" x2="45" y2="20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <line x1="0" y1="40" x2="20" y2="40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
);