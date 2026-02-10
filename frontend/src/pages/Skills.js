import React from 'react';
import '../styles/Skills.css';

function Skills() {
	return (
		<div className="skills-page">
			<header className="skills-header">
				<h1>Mes compétences</h1>
				<p>Vue d’ensemble des compétences à valider et de votre progression.</p>
			</header>

			<section className="skills-list">
				<div className="skills-card">
					<div>
						<h2>Manœuvres</h2>
						<p>Validation progressive des manœuvres essentielles.</p>
					</div>
					<span className="skills-status">À venir</span>
				</div>
				<div className="skills-card">
					<div>
						<h2>Circulation</h2>
						<p>Lecture de la route, priorités et anticipation.</p>
					</div>
					<span className="skills-status">À venir</span>
				</div>
				<div className="skills-card">
					<div>
						<h2>Autonomie</h2>
						<p>Conduite autonome et gestion des situations complexes.</p>
					</div>
					<span className="skills-status">À venir</span>
				</div>
			</section>
		</div>
	);
}

export default Skills;
