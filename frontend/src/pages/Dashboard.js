import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function Dashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [stats, setStats] = useState({ users: {}, hours: {} });

  // Filtres
  const [filterDate, setFilterDate] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Graphiques
  const donutChartRef = useRef(null);
  const barChartRef = useRef(null);
  const timelineChartRef = useRef(null);
  const donutChartInstanceRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const timelineChartInstanceRef = useRef(null);

  const messagesPerPage = 10;

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const fetchMessages = () => {
    // AJOUT DU HEADER NGROK-SKIP POUR ÉVITER LA PAGE VIDE
    fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/messages?limit=200`, {
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "Accept": "application/json"
        }
    })
    .then((res) => {
      if (!res.ok) throw new Error('Erreur lors du chargement des messages');
      return res.json();
    })
    .then((data) => {
      // On récupère le tableau messages depuis l'objet data
      const newMessages = data.messages || [];
      setMessages(newMessages);

      const users = {};
      const hours = {};

      newMessages.forEach((msg) => {
        const user = msg.user || 'Anonyme';
        users[user] = (users[user] || 0) + 1;

        if (msg.createdAt) {
          // Formatage de l'heure pour les stats
          const hourKey = msg.createdAt.substring(0, 13).replace('T', ' ');
          hours[hourKey] = (hours[hourKey] || 0) + 1;
        }
      });

      setStats({ users, hours });

      if (!loading && autoRefresh && newMessages.length > lastMessageCount) {
        addNotification(
          `💬 ${newMessages.length - lastMessageCount} nouveau(x) message(s) reçu(s)`,
          'info'
        );
      }
      setLastMessageCount(newMessages.length);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchMessages();
  }, [navigate]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchMessages, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, lastMessageCount]);

  useEffect(() => {
    let filtered = [...messages];

    if (filterDate) {
      filtered = filtered.filter((msg) => (msg.createdAt || '').startsWith(filterDate));
    }

    if (filterUser) {
      filtered = filtered.filter((msg) =>
        (msg.user || '').toLowerCase().includes(filterUser.toLowerCase())
      );
    }

    if (filterKeyword) {
      filtered = filtered.filter((msg) =>
        (msg.text || '').toLowerCase().includes(filterKeyword.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [messages, filterDate, filterUser, filterKeyword]);

  // Graphique Donut
  useEffect(() => {
    if (!donutChartRef.current || Object.keys(stats.users).length === 0) return;
    const ctx = donutChartRef.current.getContext('2d');
    const entries = Object.entries(stats.users).sort(([, a], [, b]) => b - a).slice(0, 8);
    
    if (donutChartInstanceRef.current) donutChartInstanceRef.current.destroy();

    donutChartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: entries.map(([user]) => user),
        datasets: [{
          data: entries.map(([, count]) => count),
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'],
          borderColor: '#1a1a1a',
          borderWidth: 2
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'right', labels: { color: '#fff' } } } }
    });
  }, [stats.users]);

  // Graphique Barres
  useEffect(() => {
    if (!barChartRef.current || Object.keys(stats.users).length === 0) return;
    const ctx = barChartRef.current.getContext('2d');
    const entries = Object.entries(stats.users).sort(([, a], [, b]) => b - a).slice(0, 10);

    if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();

    barChartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: entries.map(([user]) => user),
        datasets: [{
          label: 'Messages',
          data: entries.map(([, count]) => count),
          backgroundColor: '#45B7D1'
        }]
      },
      options: { indexAxis: 'y', responsive: true, scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }
    });
  }, [stats.users]);

  // Graphique Line (Timeline)
  useEffect(() => {
    if (!timelineChartRef.current || Object.keys(stats.hours).length === 0) return;
    const ctx = timelineChartRef.current.getContext('2d');
    const sortedHours = Object.keys(stats.hours).sort().slice(-24);

    if (timelineChartInstanceRef.current) timelineChartInstanceRef.current.destroy();

    timelineChartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedHours,
        datasets: [{
          label: 'Activité',
          data: sortedHours.map((hour) => stats.hours[hour]),
          borderColor: '#4CAF50',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(76, 175, 80, 0.1)'
        }]
      },
      options: { scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }
    });
  }, [stats.hours]);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage);

  const exportCSV = () => {
    const headers = ['Utilisateur', 'Message', 'Date'];
    const rows = filteredMessages.map(msg => [msg.user, msg.text, msg.createdAt]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export.csv`;
    a.click();
  };

  if (loading) return <div style={{ padding: '50px', color: '#fff', textAlign: 'center' }}>Chargement des données du serveur...</div>;
  if (error) return <div style={{ padding: '50px', color: '#FF6B6B' }}>Erreur : {error}</div>;

  return (
    <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
      {/* Notifications */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {notifications.map((notif) => (
          <div key={notif.id} style={{ padding: '15px', marginBottom: '10px', background: '#4ECDC4', borderRadius: '5px', animation: 'slideIn 0.3s' }}>
            {notif.message}
          </div>
        ))}
      </div>

      <h2>📊 Dashboard d'Administration</h2>

      {/* Barre d'outils */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: '#2a2a2a', padding: '15px', borderRadius: '8px', alignItems: 'center' }}>
        <button onClick={exportCSV} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>📥 Export CSV</button>
        <label><input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} /> Auto-refresh</label>
        <span style={{ marginLeft: 'auto' }}>Total messages: <strong>{messages.length}</strong></span>
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
          <h4>Top Utilisateurs</h4>
          <canvas ref={donutChartRef}></canvas>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
          <h4>Activité Temporelle</h4>
          <canvas ref={timelineChartRef}></canvas>
        </div>
      </div>

      {/* Tableau des messages */}
      <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
        <h4>Détail des messages</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #444' }}>
              <th style={{ padding: '10px' }}>Utilisateur</th>
              <th style={{ padding: '10px' }}>Message</th>
              <th style={{ padding: '10px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map((msg, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px' }}>{msg.user}</td>
                <td style={{ padding: '10px', fontSize: '13px' }}>{msg.text}</td>
                <td style={{ padding: '10px', color: '#888', fontSize: '12px' }}>{msg.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Précédent</button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Suivant</button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        button { cursor: pointer; padding: 5px 10px; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

export default Dashboard;