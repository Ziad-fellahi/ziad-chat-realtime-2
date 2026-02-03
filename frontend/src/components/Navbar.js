import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    // Écoute les changements de storage pour mettre à jour si besoin
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null); // On vide l'état immédiatement !
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">GOVOSTAGE</div>
      
      <div className="nav-right">
        {user ? (
          <>
            <div className="nav-user-info">
              <span>{user.username}</span>
              {user.role === 'admin' && <span className="nav-admin-badge">Admin</span>}
            </div>
            <button onClick={handleLogout} className="logout-btn">Quitter</button>
          </>
        ) : (
          <Link to="/login" style={{color: '#58a6ff', textDecoration: 'none', fontSize: '0.9rem'}}>Connexion</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;