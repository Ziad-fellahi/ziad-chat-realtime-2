import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

// On place le socket en dehors pour éviter les reconnexions au re-render
let socket;

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Décodage du username
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      setUserName(decoded.username);
    } catch (e) {
      setUserName('Utilisateur');
    }

    // URL Dynamique
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://votre-ngrok.ngrok-free.dev';
    
    if (!socket) {
      socket = io(backendUrl, { 
        transports: ['websocket'],
        extraHeaders: { "ngrok-skip-browser-warning": "true" }
      });
    }

    socket.on('message_history', (history) => setChat(history));
    socket.on('msg_to_client', (payload) => {
      setChat(prev => [...prev, payload]);
      setTypingUser(null);
    });

    socket.on('typing_to_client', (data) => {
      if (data.isTyping && data.user !== userName) {
        setTypingUser(data.user);
      } else {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off('msg_to_client');
      socket.off('typing_to_client');
    };
  }, [navigate, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typingUser]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (socket) {
      socket.emit('typing_start', { user: userName });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { user: userName });
      }, 2000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('msg_to_server', { user: userName, text: message });
      socket.emit('typing_stop', { user: userName });
      setMessage('');
    }
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-main-container">
        <header className="chat-header-custom">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="online-indicator" />
            <span><strong>{userName}</strong> (Live)</span>
          </div>
          <button className="logout-button" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Quitter</button>
        </header>

        <div className="chat-messages-area">
          {chat.map((m, i) => (
            <div key={i} className={`msg-group ${m.user === userName ? 'mine' : 'theirs'}`}>
              {m.user !== userName && <div className="user-avatar">{m.user?.charAt(0)}</div>}
              <div className="bubble">
                {m.user !== userName && <div style={{ fontSize: '0.7rem', color: '#8b949e', marginBottom: '4px' }}>{m.user}</div>}
                {m.text}
              </div>
            </div>
          ))}
          
          {typingUser && (
            <div className="typing-indicator">
              <div className="dots"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>
              <span>{typingUser} écrit...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-footer-form">
          <input value={message} onChange={handleInputChange} placeholder="Message..." />
          <button type="submit" className="send-icon-btn">➤</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;