// src/components/Navbar.js
import React from 'react';

function Navbar() {
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      // On décode le milieu du JWT (le payload)
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Token invalide");
    }
  }

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#161b22', borderBottom: '1px solid #30363d', color: 'white', position: 'fixed', width: '100%', top: 0, zIndex: 1000 }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>GovoStage</div>
      
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>{user.username}</span>
            
            {/* BADGE ADMIN NAVBAR */}
            {user.role === 'admin' && (
              <span style={{ 
                color: '#f85149', 
                border: '1px solid #f85149', 
                padding: '2px 8px', 
                borderRadius: '10px', 
                fontSize: '0.7rem', 
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                Admin
              </span>
            )}
            
            <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} style={{ background: 'transparent', border: '1px solid #30363d', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
              Quitter
            </button>
          </div>
        ) : (
          <a href="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>Connexion</a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;