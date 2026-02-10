import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
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
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      // Si l'inscription réussit, on redirige vers la page de login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #bfdbfe 0%, #dbeafe 25%, #e0f2fe 50%, #ecfeff 75%, #f0f9ff 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div className="register-container" style={{ 
        boxShadow: '0 10px 30px rgba(15,23,42,0.12)', 
        borderRadius: 16, 
        background: '#ffffff', 
        color: '#0f172a', 
        padding: '2.5rem 2rem', 
        minWidth: 340, 
        position: 'relative', 
        zIndex: 1,
        border: '1px solid rgba(148,163,184,0.25)'
      }}>
        <h2 style={{ 
          color: '#0f172a', 
          marginBottom: 24, 
          fontWeight: 700, 
          letterSpacing: 0.5
        }}>Inscription</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '0.9rem', fontSize: 16, background: '#f8fafc', color: '#0f172a' }} 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '0.9rem', fontSize: 16, background: '#f8fafc', color: '#0f172a' }} 
          />
          <button 
            type="submit" 
            style={{ 
              background: '#2563eb', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.9rem', 
              fontWeight: 700, 
              fontSize: 17, 
              marginTop: 8, 
              boxShadow: '0 6px 16px rgba(37,99,235,0.25)', 
              cursor: 'pointer' 
            }}
          >
            S'inscrire
          </button>
        </form>

        {error && (
          <div className="error" style={{ color: '#dc2626', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: '#64748b' }}>Déjà un compte ? </span>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}