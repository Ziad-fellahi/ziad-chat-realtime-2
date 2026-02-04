import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/messages?limit=100`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await res.json();
      const msgs = data.messages || [];
      
      setMessages(msgs);

      // Déduction des utilisateurs actifs (ceux qui ont parlé récemment)
      const uniqueUsers = [...new Set(msgs.map(m => m.user))];
      setOnlineUsers(uniqueUsers);
      
      setLoading(false);
    } catch (e) { 
      console.error("Erreur Fetch:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchData();
      const interval = setInterval(fetchData, 8080); // Rafraîchissement toutes le 5s
      return () => clearInterval(interval);
    }
  }, [token, user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="dashboard-container">
      <div className="db-header">
        <h1 className="db-title">Console de Supervision <span className="db-badge">Live</span></h1>
        <div className="db-actions">
          <button className="btn-primary-sm" onClick={() => navigate('/chat')}>Accéder au Chat</button>
        </div>
      </div>

      <div className="db-main-grid">
        {/* Colonne de Gauche : Utilisateurs et Stats rapides */}
        <div className="db-sidebar">
          <div className="stat-simple-card">
            <span className="label">Total Messages</span>
            <span className="value">{messages.length}</span>
          </div>

          <div className="online-card">
            <h3>Utilisateurs Actifs ({onlineUsers.length})</h3>
            <div className="user-list">
              {onlineUsers.map((u, i) => (
                <div key={i} className="user-online-item">
                  <span className="status-dot"></span>
                  {u}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne de Droite : Flux des 100 derniers messages */}
        <div className="db-content">
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <span className="terminal-title">logs_messages.txt (100 derniers)</span>
            </div>
            <div className="terminal-body">
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <div key={i} className="log-line">
                    <span className="log-time">[{new Date(m.createdAt).toLocaleTimeString()}]</span>
                    <span className="log-user">@{m.user}:</span>
                    <span className="log-msg">{m.text}</span>
                  </div>
                ))
              ) : (
                <div className="log-line">En attente de données...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;