import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logotemp'; 
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
  let username = '';
  let isAdmin = false;

  if (isLoggedIn) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      username = decoded.username;
      
      // Récupération sécurisée du rôle (depuis le token ou le storage)
      const storedUser = JSON.parse(localStorage.getItem('user'));
      isAdmin = decoded.role === 'admin' || (storedUser && storedUser.role === 'admin');
    } catch (e) {
      username = 'User';
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          <Logo size={32} />
        </Link>

        <div className="navbar-links">
          {/* LIENS PUBLICS (Visibles par tous pour ton rapport) */}
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Accueil
          </Link>
          
          <Link to="/git" className={`nav-link ${location.pathname === '/git' ? 'active' : ''}`}>
            Git Info
          </Link>
          
          <Link to="/admin-docs" className={`nav-link ${location.pathname === '/admin-docs' ? 'active' : ''}`}>
            Admin Docs
          </Link>

          {/* LIENS PRIVÉS (Nécessitent une connexion) */}
          {isLoggedIn && (
            <>
              <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
                Chat
              </Link>
              
              {/* TABLEAU DE BORD : SEULEMENT POUR L'ADMIN */}
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
                <div className="avatar-circle">
                  {username.charAt(0).toUpperCase()}
                </div>
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