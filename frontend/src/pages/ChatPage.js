import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

let socket;

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserName(decoded.username);
      setUserRole(decoded.role || 'user');
    } catch (e) { navigate('/login'); }

    if (!socket) {
      socket = io(process.env.REACT_APP_BACKEND_URL, {
        transports: ['websocket']
      });
    }

    socket.on('message_history', (h) => setChat(h));
    socket.on('msg_to_client', (msg) => setChat(prev => [...prev, msg]));

    return () => { socket.off('msg_to_client'); };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      user: userName,
      text: message,
      role: userRole,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit('msg_to_server', payload);
    setMessage('');
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <span className="channel-hash">#</span>
            <h2>général</h2>
          </div>
          <div className="header-right">
            <span className="current-user">@{userName}</span>
          </div>
        </div>

        <div className="chat-messages-area">
          {chat.map((m, i) => (
            <div key={i} className={`message-item ${m.user === userName ? 'is-me' : ''}`}>
              <div className="message-avatar">
                {m.user?.charAt(0).toUpperCase()}
              </div>
              <div className="message-content">
                <div className="message-info">
                  <span className="message-user">{m.user}</span>
                  {m.role === 'admin' && <span className="admin-badge">ADMIN</span>}
                </div>
                <div className="message-bubble">
                  <span className="message-text">{m.text}</span>
                  {/* L'heure est maintenant ici, dans la bulle */}
                  <span className="message-time-inside">{m.time}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSend} className="input-box">
            <textarea 
              placeholder="Envoyer un message dans #général"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button type="submit" className="send-button" disabled={!message.trim()}>
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;