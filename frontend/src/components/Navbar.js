import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUserName("");
        return;
      }

      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          // Décodage sécurisé de la partie Payload (index 1)
          const payload = JSON.parse(window.atob(parts[1]));
          setUserName(payload.username || "Utilisateur");
        } else {
          throw new Error("Format token invalide");
        }
      } catch (e) {
        console.error("Erreur décodage Navbar:", e.message);
        localStorage.removeItem('token'); // Nettoyage automatique
        setUserName("");
      }
    };

    checkToken();
    // On écoute aussi les changements de localStorage pour mettre à jour en direct
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserName("");
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">GovoStage</Link>
      </div>
      <div className="navbar-links">
        {userName ? (
          <>
            <span className="user-welcome">Salut, <strong>{userName}</strong></span>
            <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
          </>
        ) : (
          <Link to="/login" className="login-link">Connexion</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;