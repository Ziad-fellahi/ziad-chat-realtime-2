import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logotemp'; 
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // On récupère les données brutes
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  let isLoggedIn = false;
  let username = 'User';
  let isAdmin = false;

  // VERIFICATION DE SECURITÉ
  if (token && storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      isLoggedIn = true;
      username = userObj.username || 'User';
      
      // On vérifie le rôle dans l'objet user ET on décode le token pour être sûr
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (userObj.role === 'admin' || payload.role === 'admin') {
        isAdmin = true;
      }
    } catch (e) {
      console.error("Session corrompue, nettoyage...");
      // Si les données sont bizarres, on ne bloque pas l'utilisateur, on le déconnecte proprement
      // localStorage.clear(); 
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Logo size={32} />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Accueil</Link>
          <Link to="/git" className={`nav-link ${location.pathname === '/git' ? 'active' : ''}`}>Git Info</Link>
          <Link to="/admin-docs" className={`nav-link ${location.pathname === '/admin-docs' ? 'active' : ''}`}>Admin Docs</Link>

          {isLoggedIn && (
            <>
              <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>Chat</Link>
              {isAdmin && (
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  Tableau de bord
                </Link>
              )}
            </>
          )}

          <div className="nav-divider"></div>

          {!isLoggedIn ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn-text">Connexion</Link>
              <Link to="/register" className="btn-primary-sm">S'inscrire</Link>
            </div>
          ) : (
            <div className="user-profile">
              <div className="user-info-pill">
                <div className="avatar-circle">{username.charAt(0).toUpperCase()}</div>
                <span className="username-text">{username}</span>
                {isAdmin && <span className="admin-tag-nav">ADMIN</span>}
              </div>
              <button onClick={handleLogout} className="btn-logout-icon" title="Déconnexion">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;