import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logotemp'; 
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  let username = 'Invité';
  let isAdmin = false;
  let isMoniteur = false;
  let isSecretaire = false;
  let isLoggedIn = !!token;

  if (isLoggedIn) {
    try {
      // ÉTAPE 1 : Décodage sécurisé pour Vercel/Navigateur
      // On utilise window.atob pour s'assurer qu'on est côté client
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      
      // ÉTAPE 2 : Récupération
      username = payload.username || 'User';
      isAdmin = payload.role === 'admin';
      isMoniteur = payload.role === 'moniteur';
      isSecretaire = payload.role === 'secretaire';

      // ÉTAPE 3 : Réparation automatique du localStorage
      if (!storedUser) {
        localStorage.setItem('user', JSON.stringify({ 
          username: username, 
          role: payload.role 
        }));
      }
    } catch (e) {
      console.error("Session error:", e);
      // Ne pas déconnecter l'utilisateur ici pour éviter les boucles infinies
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
          <Logo size={48} />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Accueil</Link>
          {isAdmin && (
            <>
              <Link to="/git" className={`nav-link ${location.pathname === '/git' ? 'active' : ''}`}>Git Info</Link>
              <Link to="/admin-docs" className={`nav-link ${location.pathname === '/admin-docs' ? 'active' : ''}`}>Admin Docs</Link>
            </>
          )}

          {isLoggedIn && (
            <>
              {(isAdmin || isMoniteur) && (
                <Link to="/moniteur" className={`nav-link ${location.pathname === '/moniteur' ? 'active' : ''}`}>
                  Espace moniteur
                </Link>
              )}
              {(isAdmin || isSecretaire) && (
                <Link to="/secretaire" className={`nav-link ${location.pathname === '/secretaire' ? 'active' : ''}`}>
                  Secrétariat
                </Link>
              )}
              <Link to="/hours" className={`nav-link ${location.pathname === '/hours' ? 'active' : ''}`}>
                Planning de conduite
              </Link>
              <Link to="/skills" className={`nav-link ${location.pathname === '/skills' ? 'active' : ''}`}>
                Mes compétences
              </Link>
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
                {isMoniteur && <span className="role-tag-nav">MONITEUR</span>}
                {isSecretaire && <span className="role-tag-nav">SECRÉTARIAT</span>}
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

export default Navbar; // Très important pour Vercel