import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState([]);
  const [onlineUsernames, setOnlineUsernames] = useState([]);
  const [msgPerSec, setMsgPerSec] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const socketRef = useRef(null);
  const terminalRef = useRef(null);
  const counterRef = useRef(0);

  // Récupération sécurisée du localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // 1. Protection des routes
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    // 2. Chargement des utilisateurs inscrits
    const fetchUsers = async () => {
      try {
        // Convertir wss:// en https:// ou ws:// en http://
        const backendUrl = process.env.REACT_APP_BACKEND_URL.replace(/^wss?:/, 'https:');
        const response = await fetch(`${backendUrl}/auth/users`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 Utilisateurs inscrits reçus:', data);
        setAllRegisteredUsers(Array.isArray(data) ? data : []);
        setTotalUsers(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("❌ Erreur récupération utilisateurs:", err);
        setAllRegisteredUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // 3. Socket.io pour le temps réel
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket'],
      query: { username: user.username, token: token }
    });

    // Écouter l'historique des messages
    socketRef.current.on('message_history', (history) => {
      console.log('📜 Historique reçu:', history);
      if (Array.isArray(history)) {
        setMessages(history.slice(-100));
      }
    });

    // Écouter les nouveaux messages
    socketRef.current.on('msg_to_client', (newMsg) => {
      console.log('💬 Nouveau message:', newMsg);
      counterRef.current += 1;
      setMessages(prev => [...prev, newMsg].slice(-100));
    });

    // Écouter la liste des utilisateurs connectés
    socketRef.current.on('update_user_list', (usernames) => {
      console.log('👥 Utilisateurs en ligne:', usernames);
      setOnlineUsernames(Array.isArray(usernames) ? usernames : []);
    });

    // Écouter les erreurs de connexion
    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.io:', error);
    });

    socketRef.current.on('disconnect', () => {
      console.log('⚠️ Déconnecté du serveur');
    });

    const metricsInterval = setInterval(() => {
      setMsgPerSec(counterRef.current);
      counterRef.current = 0;
    }, 1000);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      clearInterval(metricsInterval);
    };
  }, [token, navigate, user.username, user.role]);

  // Scroll automatique
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  if (!token || user?.role !== 'admin') return null;

  const onlineCount = onlineUsernames.length;
  const offlineCount = totalUsers - onlineCount;

  return (
    <div className="dashboard-container">
      <div className="db-main-grid">
        <div className="db-sidebar">
          <div className="user-management-card">
            <h3>👥 Utilisateurs ({totalUsers})</h3>
            <div style={{ fontSize: '0.85rem', color: '#b0b0b0', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: '#10b981', fontWeight: '600' }}>🟢 {onlineCount}</span> en ligne • 
              <span style={{ color: '#9ca3af', fontWeight: '600', marginLeft: '8px' }}>⚫ {offlineCount}</span> hors ligne
            </div>
            <div className="user-list-scroll">
              {loading ? (
                <div className="log-line" style={{ color: '#b0b0b0' }}>
                  ⏳ Chargement des utilisateurs...
                </div>
              ) : allRegisteredUsers.length > 0 ? (
                allRegisteredUsers.map((u, idx) => {
                  const isOnline = onlineUsernames.includes(u.username);
                  return (
                    <div key={u._id || idx} className={`user-item ${isOnline ? 'is-online' : 'is-offline'}`}>
                      <span className="status-indicator"></span>
                      <div className="user-info">
                        <span className="username">{u.username}</span>
                        <span className="user-role">{u.role}</span>
                      </div>
                      {isOnline && <span className="online-label">LIVE</span>}
                    </div>
                  );
                })
              ) : (
                <div className="log-line" style={{ color: '#b0b0b0' }}>
                  Aucun utilisateur enregistré
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT : TERMINAL LOGS */}
        <div className="db-content">
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <span className="terminal-title">monitor.log</span>
            </div>
            <div className="terminal-body" ref={terminalRef}>
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <div key={i} className="log-line">
                    <span className="log-time">[{new Date(m.createdAt).toLocaleTimeString()}]</span>
                    <span className="log-user">@{m.user}:</span>
                    <span className="log-msg">{m.text}</span>
                  </div>
                ))
              ) : (
                <div className="log-line" style={{ justifyContent: 'center', color: '#6b7280', marginTop: '20px' }}>
                  ⏸️ En attente de messages...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;