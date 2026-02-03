import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logotemp';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  let user = null;

  if (token) {
    try {
      const payload = token.split('.')[1];
      user = JSON.parse(atob(payload)); // Contient username et role
    } catch (e) {
      console.error("Erreur décodage token");
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Logo size={32} />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Accueil
          </Link>

          {/* Lien Dashboard réservé à l'Admin */}
          {user?.role === 'admin' && (
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}

          <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
            Chat
          </Link>
          
          <Link to="/git" className="nav-link">Git Info</Link>

          <div className="nav-divider"></div>

          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn-text">Connexion</Link>
              <Link to="/register" className="btn-primary-sm">S'inscrire</Link>
            </div>
          ) : (
            <div className="user-profile">
              <div className="user-info-pill">
                <div className="avatar-circle">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="username-text">{user.username}</span>
                {user.role === 'admin' && <span className="nav-admin-badge">Admin</span>}
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