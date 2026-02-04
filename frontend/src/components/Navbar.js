import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logotemp'; 
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // On récupère l'utilisateur depuis le localStorage (plus fiable que de décoder le token à chaque fois)
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  const isLoggedIn = !!token;
  let username = 'User';
  let isAdmin = false;

  if (isLoggedIn) {
    // 1. On récupère le nom
    username = storedUser?.username || "User";

    // 2. LOGIQUE DE DÉTECTION ADMIN ULTRA-LÉGÈRE
    // On check le champ 'role' dans l'objet user OU on décode le token
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      // On est admin si le role est 'admin' quelque part
      if (storedUser?.role === 'admin' || tokenPayload?.role === 'admin') {
        isAdmin = true;
      }
    } catch (e) {
      // Si le décodage échoue, on se fie à l'objet user
      if (storedUser?.role === 'admin') isAdmin = true;
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
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Accueil
          </Link>
          
          <Link to="/git" className={`nav-link ${location.pathname === '/git' ? 'active' : ''}`}>
            Git Info
          </Link>
          
          <Link to="/admin-docs" className={`nav-link ${location.pathname === '/admin-docs' ? 'active' : ''}`}>
            Admin Docs
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
                Chat
              </Link>
              
              {/* ON FORCE L'AFFICHAGE SI isAdmin EST TRUE */}
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