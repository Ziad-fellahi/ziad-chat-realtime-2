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
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      setUserName(decoded.username);
      setUserRole(decoded.role || 'user');
    } catch (e) {
      navigate('/login');
    }

    if (!socket) {
      socket = io(process.env.REACT_APP_BACKEND_URL, {
        transports: ['websocket'],
        extraHeaders: { "ngrok-skip-browser-warning": "true" }
      });
    }

    socket.on('message_history', (history) => setChat(history));
    socket.on('msg_to_client', (payload) => setChat(prev => [...prev, payload]));

    return () => {
      socket.off('message_history');
      socket.off('msg_to_client');
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // On envoie le texte, le user, l'heure et le rôle pour le badge
      socket.emit('msg_to_server', { 
        user: userName, 
        text: message, 
        time: timeStr,
        role: userRole 
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-main-container">
        <div className="chat-messages-area">
          {chat.map((m, i) => {
            const isMine = m.user === userName;
            const initials = m.user ? m.user.charAt(0).toUpperCase() : '?';
            
            return (
              <div key={i} className={`msg-group ${isMine ? 'mine' : 'theirs'}`}>
                <div className="user-avatar-circle">{initials}</div>
                <div className="bubble-container">
                  <div className="msg-header">
                    <span className="username-label">{m.user}</span>
                    {m.role === 'admin' && (
                      <span style={{ 
                        color: '#f85149', 
                        fontSize: '0.6rem', 
                        border: '1px solid #f85149', 
                        padding: '0 4px', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>ADMIN</span>
                    )}
                  </div>
                  <div className="bubble">
                    <span className="msg-text">{m.text}</span>
                    <span className="msg-time">{m.time || '--:--'}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="chat-footer-form">
          <input 
            className="chat-input" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Tapez votre message..."
          />
          <button type="submit" className="send-btn">Envoyer</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;