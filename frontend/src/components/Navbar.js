import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">Chat en direct</div>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/chat">Chat</Link>
      </div>
    </nav>
  );
}

export default Navbar;