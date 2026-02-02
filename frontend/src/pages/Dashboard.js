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
    fetch('http://46.224.42.239:5000/chat/messages?limit=200')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des messages');
        return res.json();
      })
      .then((data) => {
        const newMessages = data.messages || [];
        setMessages(newMessages);

        const users = {};
        const hours = {};

        newMessages.forEach((msg) => {
          const user = msg.user || 'Anonyme';
          users[user] = (users[user] || 0) + 1;

          if (msg.createdAt) {
            const hourKey = msg.createdAt.substring(0, 13);
            hours[hourKey] = (hours[hourKey] || 0) + 1;
          }
        });

        setStats({ users, hours });

        if (autoRefresh && newMessages.length > lastMessageCount) {
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
  }, [autoRefresh, refreshInterval]);

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

  useEffect(() => {
    if (!donutChartRef.current || Object.keys(stats.users).length === 0) return;

    const ctx = donutChartRef.current.getContext('2d');
    const entries = Object.entries(stats.users)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
    const labels = entries.map(([user]) => user);
    const data = entries.map(([, count]) => count);

    if (donutChartInstanceRef.current) {
      donutChartInstanceRef.current.destroy();
    }

    donutChartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
              '#F7DC6F', '#BB8FCE', '#85C1E9'
            ],
            borderColor: '#1a1a1a',
            borderWidth: 2
          }
        ]
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#fff', font: { size: 12 } }
          }
        }
      }
    });

    return () => {
      if (donutChartInstanceRef.current) {
        donutChartInstanceRef.current.destroy();
      }
    };
  }, [stats.users]);

  useEffect(() => {
    if (!barChartRef.current || Object.keys(stats.users).length === 0) return;

    const ctx = barChartRef.current.getContext('2d');
    const entries = Object.entries(stats.users)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
    const labels = entries.map(([user]) => user);
    const data = entries.map(([, count]) => count);

    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
    }

    barChartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Messages par utilisateur',
            data,
            backgroundColor: '#45B7D1',
            borderColor: '#2196F3',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#fff' } }
        },
        scales: {
          x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
          y: { ticks: { color: '#fff' }, grid: { color: '#444' } }
        }
      }
    });

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
    };
  }, [stats.users]);

  useEffect(() => {
    if (!timelineChartRef.current || Object.keys(stats.hours).length === 0) return;

    const sortedHours = Object.keys(stats.hours).sort().slice(-24);
    const data = sortedHours.map((hour) => stats.hours[hour]);

    const ctx = timelineChartRef.current.getContext('2d');

    if (timelineChartInstanceRef.current) {
      timelineChartInstanceRef.current.destroy();
    }

    timelineChartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedHours,
        datasets: [
          {
            label: 'Messages par heure',
            data,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { labels: { color: '#fff' } } },
        scales: {
          x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
          y: { ticks: { color: '#fff' }, grid: { color: '#444' }, beginAtZero: true }
        }
      }
    });

    return () => {
      if (timelineChartInstanceRef.current) {
        timelineChartInstanceRef.current.destroy();
      }
    };
  }, [stats.hours]);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIdx = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIdx, startIdx + messagesPerPage);

  const exportCSV = () => {
    if (filteredMessages.length === 0) {
      alert('Aucun message à exporter');
      return;
    }

    const headers = ['Utilisateur', 'Message', 'Date'];
    const rows = filteredMessages.map((msg) => [
      msg.user || 'Anonyme',
      msg.text || '',
      msg.createdAt || ''
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>Chargement...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Erreur: {error}</div>;

  return (
    <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              padding: '15px 20px',
              marginBottom: '10px',
              background: notif.type === 'error' ? '#FF6B6B' : '#4ECDC4',
              color: '#fff',
              borderRadius: '5px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {notif.message}
          </div>
        ))}
      </div>

      <h2>💬 Tableau de bord - Chat</h2>

      <div style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#2a2a2a',
        borderRadius: '5px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={exportCSV}
          style={{
            padding: '10px 15px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📥 Exporter CSV
        </button>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh
        </label>

        {autoRefresh && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Intervalle (s) :
            <input
              type="number"
              min="1"
              max="60"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              style={{
                width: '60px',
                padding: '5px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '3px'
              }}
            />
          </label>
        )}

        <span style={{ marginLeft: 'auto' }}>
          Total: <strong>{messages.length}</strong> | Filtrés: <strong>{filteredMessages.length}</strong>
        </span>
      </div>

      <div style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#2a2a2a',
        borderRadius: '5px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>📅 Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '3px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>👤 Utilisateur</label>
          <input
            type="text"
            placeholder="ex: ziad"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '3px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>🔎 Mot-clé</label>
          <input
            type="text"
            placeholder="contenu du message"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '3px'
            }}
          />
        </div>

        <button
          onClick={() => {
            setFilterDate('');
            setFilterUser('');
            setFilterKeyword('');
          }}
          style={{
            padding: '8px 15px',
            background: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px',
            alignSelf: 'flex-end'
          }}
        >
          🔄 Réinitialiser
        </button>
      </div>

      {messages.length > 0 && (
        <>
          <div style={{
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '5px' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Messages par utilisateur (Donut)</h4>
              <canvas ref={donutChartRef} style={{ maxHeight: '300px' }}></canvas>
            </div>

            <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '5px' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Messages par heure</h4>
              <canvas ref={timelineChartRef} style={{ maxHeight: '300px' }}></canvas>
            </div>
          </div>

          <div style={{
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '5px' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Top utilisateurs (Barres)</h4>
              <canvas ref={barChartRef} style={{ maxHeight: '300px' }}></canvas>
            </div>

            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '15px' }}>
              <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #FF9800' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>🏆 Top utilisateurs</h4>
                {Object.entries(stats.users)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([user, count]) => (
                    <div key={user} style={{ fontSize: '12px', marginBottom: '5px' }}>
                      {user}: <strong>{count}</strong>
                    </div>
                  ))}
              </div>

              <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #4CAF50' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>🧾 Derniers messages</h4>
                {messages.slice(0, 5).map((msg) => (
                  <div key={msg._id} style={{ fontSize: '12px', marginBottom: '5px' }}>
                    <strong>{msg.user || 'Anonyme'}:</strong> {(msg.text || '').substring(0, 35)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {filteredMessages.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', background: '#2a2a2a', borderRadius: '5px' }}>
          Aucun message à afficher.
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{
              width: '100%',
              color: '#fff',
              background: '#2a2a2a',
              borderCollapse: 'collapse',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #444' }}>Utilisateur</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #444' }}>Message</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #444' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((msg, idx) => (
                  <tr key={msg._id || idx} style={{ borderBottom: '1px solid #444', background: idx % 2 === 0 ? '#2a2a2a' : '#1a1a1a' }}>
                    <td style={{ padding: '12px' }}>{msg.user || 'Anonyme'}</td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>{(msg.text || '').substring(0, 120)}</td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>{msg.createdAt || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  background: currentPage === 1 ? '#555' : '#2196F3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Précédent
              </button>

              <span>
                Page <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  background: currentPage === totalPages ? '#555' : '#2196F3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
