import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, newUsers: 0, avgMsgs: 0 });

  const timelineChartRef = useRef(null);
  const chartInstances = useRef([]);

  // --- SÉCURITÉ ADMIN ---
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Si pas de token ou pas admin : redirection immédiate
    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/messages?limit=500`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await res.json();
      const msgs = data.messages || [];
      
      const users = [...new Set(msgs.map(m => m.user))];
      const last24h = msgs.filter(m => (new Date() - new Date(m.createdAt)) < 86400000);
      const newUsers = [...new Set(last24h.map(m => m.user))].length;

      setMessages(msgs);
      setStats({
        totalUsers: users.length,
        newUsers: newUsers,
        avgMsgs: users.length ? (msgs.length / users.length).toFixed(1) : 0
      });
      setLoading(false);
    } catch (e) { 
      console.error("Erreur Fetch:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  useEffect(() => {
    if (loading || !messages.length || !timelineChartRef.current) return;

    // Nettoyage des anciens graphiques
    chartInstances.current.forEach(c => c.destroy());
    chartInstances.current = [];

    const ctxL = timelineChartRef.current.getContext('2d');
    const newChart = new Chart(ctxL, {
      type: 'line',
      data: {
        labels: ['6h', '9h', '12h', '15h', '18h', '21h', '0h'],
        datasets: [{ 
          label: 'Messages', 
          data: [12, 19, 30, 25, 45, 60, 20], 
          borderColor: '#6366f1', 
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4 
        }]
      },
      options: { 
        responsive: true, 
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } },
          x: { grid: { display: false }, ticks: { color: '#8b949e' } }
        }
      }
    });
    
    chartInstances.current.push(newChart);
  }, [loading, messages]);

  // Si pas admin pendant le rendu, on ne retourne rien (sécurité visuelle)
  if (!user || user.role !== 'admin') return null;

  if (loading) return <div className="dashboard-container">Chargement des données...</div>;

  return (
    <div className="dashboard-container">
      <div className="db-header">
        <h1 className="db-title">Govo Analytics <span className="db-badge">Live Admin</span></h1>
        <div className="db-actions">
          <button className="btn-secondary-sm" onClick={() => fetchData()}>Actualiser</button>
          <button className="btn-primary-sm" onClick={() => navigate('/chat')}>Ouvrir le Chat</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✉️</div>
          <div className="stat-info">
            <div className="stat-label">Messages</div>
            <div className="stat-value">{messages.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-label">Total Utilisateurs</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-info">
            <div className="stat-label">Nouveaux (24h)</div>
            <div className="stat-value">{stats.newUsers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-label">Engagement</div>
            <div className="stat-value">{stats.avgMsgs} <span className="unit">msg/u</span></div>
          </div>
        </div>
      </div>

      <div className="db-content-grid">
        <div className="chart-card">
          <h3>Flux d'activité (Simulation)</h3>
          <div className="canvas-holder">
            <canvas ref={timelineChartRef}></canvas>
          </div>
        </div>
        <div className="table-card">
          <h3>Derniers messages stockés</h3>
          <div className="msg-list">
            {messages.slice(0, 8).map((m, i) => (
              <div key={i} className="msg-item-db">
                <span className="msg-user">@{m.user}</span>
                <span className="msg-text">{m.text}</span>
                <span className="msg-date">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;