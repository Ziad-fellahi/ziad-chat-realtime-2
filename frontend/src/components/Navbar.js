import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  let username = '';
  if (isLoggedIn) {
    try {
      const payload = token.split('.')[1];
      username = JSON.parse(atob(payload)).username;
    } catch {
      username = '';
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">Chat en direct</div>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/chat">Chat</Link>
        {!isLoggedIn && <Link to="/register">Inscription</Link>}
        {!isLoggedIn && <Link to="/login">Connexion</Link>}
        {isLoggedIn && <span style={{marginLeft: '1rem', color: '#1976d2'}}><b>{username}</b></span>}
        {isLoggedIn && <button onClick={handleLogout} style={{marginLeft: '1rem'}}>Déconnexion</button>}
      </div>
    </nav>
  );
}

export default Navbar;