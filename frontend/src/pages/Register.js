import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'inscription');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">S'inscrire</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
