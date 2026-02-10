import React from 'react';
import '../styles/Hours.css';

function Hours() {
	return (
		<div className="hours-page">
			<header className="hours-header">
				<h1>Planning de conduite</h1>
				<p>Suivi de vos heures de conduite et de vos prochaines sessions.</p>
			</header>

			<section className="hours-grid">
				<div className="hours-card">
					<h2>Heures effectuées</h2>
					<p className="hours-value">—</p>
					<span className="hours-hint">Données bientôt disponibles</span>
				</div>
				<div className="hours-card">
					<h2>Heures restantes</h2>
					<p className="hours-value">—</p>
					<span className="hours-hint">Calcul automatique à venir</span>
				</div>
				<div className="hours-card">
					<h2>Prochaine séance</h2>
					<p className="hours-value">—</p>
					<span className="hours-hint">Planning en cours de connexion</span>
				</div>
			</section>
		</div>
	);
}

export default Hours;
