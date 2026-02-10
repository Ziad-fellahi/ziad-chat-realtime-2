import React from 'react';

const Logo = ({ size = 44 }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
      }}
    >
      {/* Image de logo depuis /public */}
      <img
        src="/GOVO-logo.png"
        alt="Logo Autoecole Govostage"
        style={{
          height: size,
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default Logo;