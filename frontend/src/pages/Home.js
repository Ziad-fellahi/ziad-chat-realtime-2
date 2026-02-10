import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const token = localStorage.getItem('token');
  let username = '';

  if (token) {
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      username = payload?.username || '';
    } catch (e) {
      username = '';
    }
  }

  return (
    <div className="home-container">
      {/* Arrière-plan animé */}
      <div className="home-bg-glow"></div>

      <section className="hero-section">
        {token ? (
          <div className="home-shell">
            <div className="welcome-panel">
              <div className="status-strip">
                <span className="status-pill">Compte actif</span>
                <span className="status-pill subtle">Suivi personnalisé</span>
              </div>
              <h1 className="hero-title">
                <span className="hero-line">Bonjour{username ? `, ${username}` : ''}.</span>
                <span className="hero-line text-gradient">Votre espace d&apos;accueil est prêt.</span>
              </h1>
              <p className="hero-subtitle">
                Retrouvez ici vos informations clés et les prochains ajouts du tableau de bord client.
              </p>
              <div className="quick-actions">
                <Link to="/chat" className="btn-primary-lg">
                  Ouvrir le chat
                </Link>
                <Link to="/git" className="btn-secondary-lg">
                  Ressources utiles
                </Link>
              </div>
            </div>

            <div className="insights-panel">
              <div className="insight-card">
                <p className="insight-label">Leçons planifiées</p>
                <p className="insight-value">—</p>
                <p className="insight-note">Synchronisation en cours</p>
              </div>
              <div className="insight-card">
                <p className="insight-label">Progression</p>
                <p className="insight-value">—</p>
                <p className="insight-note">Statistiques bientôt visibles</p>
              </div>
              <div className="insight-card">
                <p className="insight-label">Suivi des messages</p>
                <p className="insight-value">—</p>
                <p className="insight-note">Historique à venir</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-line">Le BUS, c’est bien.</span>
              <span className="hero-line text-gradient">Le VOLANT, c’est mieux.</span>
            </h1>
            <p className="hero-subtitle">
              Autoecole Govostage vous accompagne pour le permis B, la conduite
              accompagnée et la boîte automatique, avec une pédagogie moderne,
              un suivi personnalisé et un planning adapté à votre vie.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary-lg">
                S&apos;inscrire en ligne
              </Link>
              <Link to="/chat" className="btn-secondary-lg">
                Poser une question
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🚗</div>
          <h3>Accompagnement complet</h3>
          <p>
            De l&apos;inscription jusqu&apos;à l&apos;obtention du permis,
            notre équipe vous guide à chaque étape avec des conseils clairs.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏰</div>
          <h3>Horaires adaptés</h3>
          <p>
            Cours de conduite du lundi au samedi, tôt le matin, en journée ou
            en soirée pour s&apos;adapter à votre emploi du temps.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Réussite au rendez-vous</h3>
          <p>
            Une pédagogie structurée et des évaluations régulières pour vous
            présenter à l&apos;examen au meilleur moment.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;