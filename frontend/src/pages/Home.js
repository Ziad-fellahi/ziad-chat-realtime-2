import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Redirection automatique vers l'espace de l'utilisateur si connecté
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role) {
      const rolePages = {
        admin: '/dashboard',
        moniteur: '/moniteur',
        secretaire: '/secretaire',
        eleve: '/eleve',
        user: '/eleve', // Alias pour élève
      };
      
      const targetPage = rolePages[user.role];
      if (targetPage) {
        navigate(targetPage, { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Afficher un spinner pendant la vérification
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Arrière-plan animé */}
      <div className="home-bg-glow"></div>

      <section className="hero-section">
        <div className="home-shell">
          <div className="welcome-panel">
            <div className="status-strip">
              <span className="status-pill subtle">Visiteur</span>
            </div>
            <h1 className="hero-title">
              <span className="hero-line">Bienvenue.</span>
              <span className="hero-line text-gradient">Connectez-vous pour accéder à votre espace.</span>
            </h1>
            <p className="hero-subtitle">
              Accédez à votre espace personnalisé selon votre rôle.
            </p>
            <div className="quick-actions">
              <Link to="/login" className="btn-primary-lg">
                Se connecter
              </Link>
              <Link to="/register" className="btn-secondary-lg">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
