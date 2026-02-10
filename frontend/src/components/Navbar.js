import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logotemp'; 
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const username = user?.username || 'Invité';
  const role = user?.role;
  const isAdmin = role === 'admin';
  const isMoniteur = role === 'moniteur';
  const isSecretaire = role === 'secretaire';
  const isEleve = role === 'eleve' || role === 'user'; // Support des deux rôles pour élève

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Logo size={48} />
        </Link>

        <div className="navbar-links">
          {/* Accueil visible uniquement pour les non-connectés */}
          {!isAuthenticated && (
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Accueil</Link>
          )}
          
          {/* Admin voit tout */}
          {isAdmin && (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                Mon Espace Admin
              </Link>
              <Link to="/moniteur" className={`nav-link ${location.pathname === '/moniteur' ? 'active' : ''}`}>
                Gestion Moniteurs
              </Link>
              <Link to="/secretaire" className={`nav-link ${location.pathname === '/secretaire' ? 'active' : ''}`}>
                Gestion Secrétariat
              </Link>
              <Link to="/eleve" className={`nav-link ${location.pathname === '/eleve' ? 'active' : ''}`}>
                Gestion Élèves
              </Link>
              <Link to="/git" className={`nav-link ${location.pathname === '/git' ? 'active' : ''}`}>Git Info</Link>
              <Link to="/admin-docs" className={`nav-link ${location.pathname === '/admin-docs' ? 'active' : ''}`}>Admin Docs</Link>
            </>
          )}

          {/* Moniteur voit uniquement son espace personnel */}
          {isMoniteur && !isAdmin && (
            <Link to="/moniteur" className={`nav-link ${location.pathname === '/moniteur' ? 'active' : ''}`}>
              Mon Espace
            </Link>
          )}

          {/* Secrétaire voit uniquement son espace personnel */}
          {isSecretaire && !isAdmin && (
            <Link to="/secretaire" className={`nav-link ${location.pathname === '/secretaire' ? 'active' : ''}`}>
              Mon espace
            </Link>
          )}

          {/* Élève voit uniquement son espace */}
          {isEleve && !isAdmin && (
            <Link to="/eleve" className={`nav-link ${location.pathname === '/eleve' ? 'active' : ''}`}>
              Mon espace
            </Link>
          )}

          {/* Fonctionnalités communes à tous les utilisateurs connectés */}
          {isAuthenticated && (
            <>
              <Link to="/hours" className={`nav-link ${location.pathname === '/hours' ? 'active' : ''}`}>
                Planning
              </Link>
              <Link to="/skills" className={`nav-link ${location.pathname === '/skills' ? 'active' : ''}`}>
                Compétences
              </Link>
              <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>Chat</Link>
            </>
          )}

          <div className="nav-divider"></div>

          {!isAuthenticated ? (
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