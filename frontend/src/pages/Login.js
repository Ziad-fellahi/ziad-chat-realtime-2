import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // On utilise ton fichier CSS ici

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://uncolourable-frederic-domesticative.ngrok-free.dev';

      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Identifiants invalides');
      
      const data = await res.json();

      // CORRECTION : On utilise data.token (envoyé par ton serveur Ubuntu)
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.role) localStorage.setItem('role', data.role);
        navigate('/'); 
      } else {
        throw new Error('Jeton manquant dans la réponse du serveur');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-overlay" />
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Se connecter</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}