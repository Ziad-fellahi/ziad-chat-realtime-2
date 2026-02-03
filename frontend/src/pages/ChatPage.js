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
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserName(decoded.username);
    } catch (e) { setUserName('Ghost'); }

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
      socket.emit('msg_to_server', { user: userName, text: message });
      setMessage('');
    }
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-main-container">
        <header className="chat-header-custom">
          <div className="user-info">
            <span>● {userName}</span>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} 
                  style={{background: 'none', border: '1px solid #ff4b2b', color: '#ff4b2b', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer'}}>
            EXIT
          </button>
        </header>

        <div className="chat-messages-area">
          {chat.map((m, i) => (
            <div key={i} className={`msg-group ${m.user === userName ? 'mine' : 'theirs'}`}>
              <span style={{fontSize: '0.7rem', color: '#64748b', marginBottom: '5px', alignSelf: m.user === userName ? 'flex-end' : 'flex-start'}}>
                {m.user}
              </span>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={send} className="chat-footer-form">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
          <button type="submit" className="send-icon-btn">➤</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;