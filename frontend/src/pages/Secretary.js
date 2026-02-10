import React from 'react';
import '../styles/Secretary.css';

function Secretary() {
  return (
    <div className="secretary-page">
      <header className="secretary-header">
        <h1>Secrétariat</h1>
        <p>Gestion des dossiers, rendez-vous et suivi administratif.</p>
      </header>

      <section className="secretary-grid">
        <div className="secretary-card">
          <h2>Dossiers à traiter</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Synchronisation en cours</span>
        </div>
        <div className="secretary-card">
          <h2>Rendez-vous</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Planning bientôt disponible</span>
        </div>
        <div className="secretary-card">
          <h2>Documents</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Suivi en préparation</span>
        </div>
      </section>
    </div>
  );
}

export default Secretary;
