import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import QuickUserCreate from '../components/QuickUserCreate';
import '../styles/Eleve.css';
import '../styles/QuickUserCreate.css';

function Eleve() {
  const { user } = useAuth();
  const userRole = user?.role || 'eleve';

  // Vue pour Admin/Secrétaire : Gestion des élèves
  if (userRole === 'admin' || userRole === 'secretaire') {
    return (
      <div className="eleve-page">
        <PageHeader 
          title="Espace Élève" 
          subtitle={userRole === 'admin' ? "Vue administrateur" : "Gestion des élèves"}
        />

        {/* Section de création rapide d'élève */}
        <QuickUserCreate allowedRoles={['eleve']} />

        <section className="eleve-grid">
          <div className="eleve-card">
            <h2>Liste des élèves</h2>
            <p className="eleve-value">—</p>
            <span className="eleve-hint">Base de données en cours de connexion</span>
          </div>
          <div className="eleve-card">
            <h2>Élèves actifs</h2>
            <p className="eleve-value">—</p>
            <span className="eleve-hint">Statistiques à venir</span>
          </div>
          <div className="eleve-card">
            <h2>Recherche d'élève</h2>
            <p className="eleve-value">—</p>
            <span className="eleve-hint">Fonction bientôt disponible</span>
          </div>
        </section>
      </div>
    );
  }

  // Vue pour Élève : Espace personnel
  return (
    <div className="eleve-page">
      <PageHeader 
        title="Mon Espace Élève" 
        subtitle="Suivi de ma formation"
      />

      <section className="eleve-grid">
        <div className="eleve-card">
          <h2>Mes prochaines séances</h2>
          <p className="eleve-value">—</p>
          <span className="eleve-hint">Planning bientôt disponible</span>
        </div>
        <div className="eleve-card">
          <h2>Heures effectuées</h2>
          <p className="eleve-value">—</p>
          <span className="eleve-hint">Suivi en cours</span>
        </div>
        <div className="eleve-card">
          <h2>Compétences validées</h2>
          <p className="eleve-value">—</p>
          <span className="eleve-hint">Évaluation à venir</span>
        </div>
      </section>
    </div>
  );
}

export default Eleve;
