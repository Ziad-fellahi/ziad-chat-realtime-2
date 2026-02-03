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
  const [isTyping, setIsTyping] = useState(false);
  
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
      <div className="chat-main-container">
        <div className="chat-header">
          <h2># général</h2>
          <div style={{color: '#8b949e', fontSize: '0.8rem'}}>
            Connecté en tant que <strong>{userName}</strong>
          </div>
        </div>

        <div className="chat-messages-area">
          <div className="date-separator"><span>Aujourd'hui</span></div>
          
          {chat.map((m, i) => (
            <div key={i} className="msg-row">
              <div className="msg-avatar">
                {m.user?.charAt(0).toUpperCase()}
              </div>
              <div className="msg-content">
                <div className="msg-meta">
                  <span className="msg-user">{m.user}</span>
                  {m.role === 'admin' && <span className="admin-pill">ADMIN</span>}
                  <span className="msg-time">{m.time}</span>
                </div>
                <div className="msg-text">{m.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleSend} className="input-wrapper">
            <textarea 
              className="chat-input"
              rows="2"
              placeholder={`Envoyer un message à #général`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <div className="input-actions">
              <button 
                type="submit" 
                className="send-btn-pro" 
                disabled={!message.trim()}
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default ChatPage;