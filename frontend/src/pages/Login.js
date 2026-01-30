import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Identifiants invalides');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
