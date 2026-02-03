import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, newUsers: 0, avgMsgs: 0 });

  const donutChartRef = useRef(null);
  const timelineChartRef = useRef(null);
  const chartInstances = useRef([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/messages?limit=500`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await res.json();
      const msgs = data.messages || [];
      
      // Calculs
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
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading || !messages.length) return;

    chartInstances.current.forEach(c => c.destroy());
    chartInstances.current = [];

    // Chart Line
    const ctxL = timelineChartRef.current.getContext('2d');
    chartInstances.current.push(new Chart(ctxL, {
      type: 'line',
      data: {
        labels: ['6h', '9h', '12h', '15h', '18h', '21h', '0h'],
        datasets: [{ label: 'Messages', data: [12, 19, 30, 25, 45, 60, 20], borderColor: '#6366f1', tension: 0.4 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    }));
    
    setLoading(false);
  }, [loading, messages]);

  if (loading) return <div className="dashboard-container">Chargement...</div>;

  return (
    <div className="dashboard-container">
      <div className="db-header">
        <h1 className="db-title">Govo Analytics <span className="db-badge">Live</span></h1>
        <button className="btn-primary-sm" onClick={() => navigate('/chat')}>Chat App</button>
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
            <div className="stat-value">{stats.avgMsgs} msg/u</div>
          </div>
        </div>
      </div>

      <div className="db-content-grid">
        <div className="chart-card">
          <h3>Activité du Serveur</h3>
          <canvas ref={timelineChartRef}></canvas>
        </div>
        <div className="table-card">
          <h3>Dernières activités</h3>
          <div className="msg-list">
            {messages.slice(0, 6).map((m, i) => (
              <div key={i} className="msg-item">
                <span className="msg-user">@{m.user}</span>
                <span className="msg-text">{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;