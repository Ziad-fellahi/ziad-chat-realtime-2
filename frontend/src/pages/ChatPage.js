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
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setUserName(decoded.username);

    if (!socket) {
      socket = io(process.env.REACT_APP_BACKEND_URL, {
        transports: ['websocket'],
        extraHeaders: { "ngrok-skip-browser-warning": "true" }
      });
    }

    socket.on('message_history', (h) => setChat(h));
    socket.on('msg_to_client', (p) => setChat(prev => [...prev, p]));

    return () => { socket.off('msg_to_client'); };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      socket.emit('msg_to_server', { user: userName, text: message, time: time });
      setMessage('');
    }
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-main-container">
        <div className="chat-messages-area">
          {chat.map((m, i) => {
            const isMine = m.user === userName;
            return (
              <div key={i} className={`msg-group ${isMine ? 'mine' : 'theirs'}`}>
                <div className="user-avatar-circle">{m.user?.charAt(0).toUpperCase()}</div>
                <div className="bubble-container">
                  <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>{m.user}</span>
                    {m.role === 'admin' && <span className="admin-badge">Admin</span>}
                  </div>
                  <div className="bubble">
                    {m.text}
                    <span className="msg-time">{m.time || '--:--'}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={send} className="chat-footer-form">
          <input className="chat-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message..." />
          <button type="submit" style={{background: '#238636', color: 'white', border: 'none', padding: '0 15px', borderRadius: '4px', cursor: 'pointer'}}>Envoyer</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;