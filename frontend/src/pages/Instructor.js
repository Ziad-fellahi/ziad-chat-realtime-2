import React from 'react';
import '../styles/Instructor.css';

function Instructor() {
  return (
    <div className="instructor-page">
      <header className="instructor-header">
        <h1>Espace moniteur</h1>
        <p>Suivi des élèves, séances à venir et informations pédagogiques.</p>
      </header>

      <section className="instructor-grid">
        <div className="instructor-card">
          <h2>Élèves du jour</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Planning bientôt connecté</span>
        </div>
        <div className="instructor-card">
          <h2>Évaluations</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Données à venir</span>
        </div>
        <div className="instructor-card">
          <h2>Notes pédagogiques</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Bientôt disponible</span>
        </div>
      </section>
    </div>
  );
}

export default Instructor;
