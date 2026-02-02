import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Arrière-plan animé */}
      <div className="home-bg-glow"></div>
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Communiquez en <span className="text-gradient">temps réel</span> sans frontières.
          </h1>
          <p className="hero-subtitle">
            Une expérience de messagerie instantanée fluide, sécurisée et élégante. 
            Rejoignez la discussion en quelques secondes.
          </p>
          <div className="hero-actions">
            <Link to="/chat" className="btn-primary-lg">Démarrer une discussion</Link>
            <Link to="/register" className="btn-secondary-lg">En savoir plus</Link>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Ultra Rapide</h3>
          <p>Technologie WebSocket pour des messages instantanés sans latence.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Sécurisé</h3>
          <p>Authentification JWT robuste pour protéger vos conversations.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Design Moderne</h3>
          <p>Une interface sombre pensée pour le confort de vos yeux.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;