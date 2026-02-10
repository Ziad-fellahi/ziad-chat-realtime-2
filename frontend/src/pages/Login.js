import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../api/config';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ 
        username: username.trim(), 
        password: password.trim() 
      }),
    });

    if (!res.ok) throw new Error('Identifiants invalides');
    
    const data = await res.json();
    
    // Utiliser la fonction login du contexte
    login(data.access_token, {
      username: data.username,
      role: data.role,
    });
    
    // Redirection automatique selon le rôle (avec replace pour éviter retour arrière)
    const rolePages = {
      admin: '/dashboard',
      moniteur: '/moniteur',
      secretaire: '/secretaire',
      eleve: '/eleve',
      user: '/eleve', // Alias pour élève
    };
    
    const targetPage = rolePages[data.role] || '/';
    navigate(targetPage, { replace: true });
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
      <div className="login-container" style={{ boxShadow: '0 10px 30px rgba(15,23,42,0.12)', borderRadius: 16, background: '#ffffff', color: '#0f172a', padding: '2.5rem 2rem', minWidth: 340, position: 'relative', zIndex: 1, border: '1px solid rgba(148,163,184,0.25)' }}>
        <h2 style={{ color: '#0f172a', marginBottom: 24, fontWeight: 700, letterSpacing: 0.5 }}>Connexion</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '0.9rem', fontSize: 16, background: '#f8fafc', color: '#0f172a' }} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '0.9rem', fontSize: 16, background: '#f8fafc', color: '#0f172a' }} />
          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem', fontWeight: 700, fontSize: 17, marginTop: 8, boxShadow: '0 6px 16px rgba(37,99,235,0.25)', cursor: 'pointer', transition: 'background 0.2s' }}>Se connecter</button>
        </form>
        {error && <div className="error" style={{ color: '#dc2626', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: '#64748b' }}>Pas de compte ? </span>
          <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
    );
  }
