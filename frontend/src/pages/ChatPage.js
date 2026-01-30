import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

let socket;

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Décoder le username du token (optionnel, sinon requête API)
    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      setUserName(decoded.username);
    } catch {
      setUserName('Utilisateur');
    }
    // Connexion socket
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!backendUrl) return;
    if (!socket) {
      socket = io(backendUrl, { 
        transports: ['websocket'],
        upgrade: false,
        extraHeaders: {
          "ngrok-skip-browser-warning": "true",
          "bypass-tunnel-reminder": "true"
        }
      });
    }
    socket.on('connect', () => {
      // ...
    });
    socket.on('connect_error', (err) => {
      // ...
    });
    socket.on('message_history', (history) => {
      setChat(history);
    });
    socket.on('msg_to_client', (payload) => {
      setChat(prev => [...prev, payload]);
    });
    return () => { 
      socket.off('message_history'); 
      socket.off('msg_to_client');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [navigate]);

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('msg_to_server', { user: userName, text: message });
      setMessage('');
    }
  };

  // --- RENDU UI ---
  return (
    <div className="chat-app">
      <header className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <span>Utilisateur : <strong>{userName}</strong></span>
        <button onClick={handleLogout} style={{ fontSize: '10px', cursor: 'pointer', background: '#eee', border: '1px solid #ccc' }}>Changer de nom</button>
      </header>
      <div className="chat-box">
        {chat.map((m, i) => (
          <div key={i} className={`msg ${m.user === userName ? 'my-msg' : 'other-msg'}`}>
            <small><b>{m.user}</b></small><br/>{m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input-area">
        <input 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Ecrivez ici..." 
        />
        <button type="submit" className="send-btn">➤</button>
      </form>
    </div>
  );
}

export default ChatPage;