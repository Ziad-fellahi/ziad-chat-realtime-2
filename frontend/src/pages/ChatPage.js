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
      {/* Cercles de couleurs pour le fond vibrant */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="chat-main-container">
        <div className="chat-header">
          <div className="header-left">
            <div className="online-dot"></div>
            <h2># salon-général</h2>
          </div>
          <div className="header-right">
            <span className="user-tag">@{userName}</span>
          </div>
        </div>

        <div className="chat-messages-area">
          {chat.map((m, i) => (
            <div key={i} className={`msg-row ${m.user === userName ? 'own-msg' : ''}`}>
              <div className="avatar">
                {m.user?.charAt(0).toUpperCase()}
              </div>
              <div className="msg-details">
                <div className="msg-info">
                  <span className="msg-author">{m.user}</span>
                  {m.role === 'admin' && <span className="staff-tag">STAFF</span>}
                </div>
                <div className="bubble-container">
                  <div className="bubble">
                    <p className="text">{m.text}</p>
                    <span className="time-stamp">{m.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-section">
          <form onSubmit={handleSend} className="glass-input-box">
            <textarea 
              rows="1"
              placeholder="Écrire un message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button type="submit" className="send-circle" disabled={!message.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;