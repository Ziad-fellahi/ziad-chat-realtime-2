import React from 'react';

const Logo = ({ size = 35 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5865F2" />
            <stop offset="100%" stopColor="#A29BFE" />
          </linearGradient>
        </defs>
        <path 
          d="M20 25C20 22.2386 22.2386 20 25 20H75C77.7614 20 80 22.2386 80 25V65C80 67.7614 77.7614 70 75 70H35L20 85V25Z" 
          fill="url(#logo-gradient)" 
        />
        <circle cx="40" cy="45" r="5" fill="white" fillOpacity="0.9" />
        <circle cx="50" cy="45" r="5" fill="white" fillOpacity="0.9" />
        <circle cx="60" cy="45" r="5" fill="white" fillOpacity="0.9" />
      </svg>
      <span style={{ 
        fontWeight: 800, 
        fontSize: '1.2rem', 
        color: '#fff',
        letterSpacing: '-0.5px'
      }}>
        Govo<span style={{ color: '#5865f2' }}>Chat</span>
      </span>
    </div>
  );
};

export default Logo;