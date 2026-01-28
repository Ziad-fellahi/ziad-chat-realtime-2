import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Bienvenue sur le Chat 🚀</h1>
        <p>Messagerie instantanée moderne et rapide.</p>
        <Link to="/chat" className="start-button">Démarrer une discussion</Link>
      </div>
    </div>
  );
}
export default Home;