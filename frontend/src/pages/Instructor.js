import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import QuickUserCreate from '../components/QuickUserCreate';
import '../styles/Instructor.css';
import '../styles/QuickUserCreate.css';

function Instructor() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // SÉCURITÉ : Vue Admin uniquement - Gestion des moniteurs
  if (isAdmin) {
    return (
      <div className="instructor-page">
        <PageHeader
          title="Gestion des Moniteurs"
          subtitle="Administration et création de comptes moniteurs"
        />

        {/* ADMIN UNIQUEMENT - Création de comptes moniteurs */}
        <QuickUserCreate allowedRoles={['moniteur']} />

        <section className="instructor-grid">
          <div className="instructor-card">
            <h2>Moniteurs actifs</h2>
            <p className="instructor-value">—</p>
            <span className="instructor-hint">Liste bientôt disponible</span>
          </div>
          <div className="instructor-card">
            <h2>Statistiques</h2>
            <p className="instructor-value">—</p>
            <span className="instructor-hint">Données à venir</span>
          </div>
          <div className="instructor-card">
            <h2>Configuration</h2>
            <p className="instructor-value">—</p>
            <span className="instructor-hint">Paramètres en préparation</span>
          </div>
        </section>
      </div>
    );
  }

  // Vue Moniteur - Espace personnel (PAS de gestion des comptes)
  return (
    <div className="instructor-page">
      <PageHeader
        title="Mon Espace Moniteur"
        subtitle="Suivi de mes élèves et planning"
      />

      <section className="instructor-grid">
        <div className="instructor-card">
          <h2>Mes élèves du jour</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Planning bientôt connecté</span>
        </div>
        <div className="instructor-card">
          <h2>Mes évaluations</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Suivi en cours</span>
        </div>
        <div className="instructor-card">
          <h2>Mes notes pédagogiques</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Carnet de bord à venir</span>
        </div>
        <div className="instructor-card">
          <h2>Mon planning de la semaine</h2>
          <p className="instructor-value">—</p>
          <span className="instructor-hint">Calendrier en préparation</span>
        </div>
      </section>
    </div>
  );
}

export default Instructor;
