import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import QuickUserCreate from '../components/QuickUserCreate';
import '../styles/Secretary.css';
import '../styles/QuickUserCreate.css';

function Secretary() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // SÉCURITÉ : Vue Admin uniquement - Gestion des secrétaires
  if (isAdmin) {
    return (
      <div className="secretary-page">
        <PageHeader
          title="Gestion du Secrétariat"
          subtitle="Administration et création de comptes secrétaires"
        />

        {/* ADMIN UNIQUEMENT - Création de comptes secrétaires */}
        <QuickUserCreate allowedRoles={['secretaire']} />

        <section className="secretary-grid">
          <div className="secretary-card">
            <h2>Secrétaires actifs</h2>
            <p className="secretary-value">—</p>
            <span className="secretary-hint">Liste en préparation</span>
          </div>
          <div className="secretary-card">
            <h2>Statistiques</h2>
            <p className="secretary-value">—</p>
            <span className="secretary-hint">Données à venir</span>
          </div>
          <div className="secretary-card">
            <h2>Configuration</h2>
            <p className="secretary-value">—</p>
            <span className="secretary-hint">Paramètres en cours</span>
          </div>
        </section>
      </div>
    );
  }

  // Vue Secrétaire - Espace personnel (PAS de gestion des comptes)
  return (
    <div className="secretary-page">
      <PageHeader
        title="Mon Espace Secrétaire"
        subtitle="Gestion administrative quotidienne"
      />

      <section className="secretary-grid">
        <div className="secretary-card">
          <h2>Mes dossiers à traiter</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Synchronisation en cours</span>
        </div>
        <div className="secretary-card">
          <h2>Mes rendez-vous du jour</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Planning bientôt disponible</span>
        </div>
        <div className="secretary-card">
          <h2>Mes documents en cours</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Suivi en préparation</span>
        </div>
        <div className="secretary-card">
          <h2>Mes tâches prioritaires</h2>
          <p className="secretary-value">—</p>
          <span className="secretary-hint">Liste à venir</span>
        </div>
      </section>
    </div>
  );
}

export default Secretary;