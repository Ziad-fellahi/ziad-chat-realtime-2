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
    } catch (e) { setUserName('?'); }

    if (!socket) {
      socket = io(process.env.REACT_APP_BACKEND_URL, {
        transports: ['websocket'],
        extraHeaders: { "ngrok-skip-browser-warning": "true" }
      });
    }

    socket.on('message_history', (h) => setChat(h));
    socket.on('msg_to_client', (p) => setChat(prev => [...prev, p]));

    return () => { 
        socket.off('message_history');
        socket.off('msg_to_client'); 
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
      
      socket.emit('msg_to_server', { 
        user: userName, 
        text: message, 
        time: timeStr 
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
            const initial = m.user ? m.user.charAt(0) : '?';
            return (
              <div key={i} className={`msg-group ${isMine ? 'mine' : 'theirs'}`}>
                <div className="user-avatar-circle">{initial}</div>
                <div className="bubble-container">
                  {!isMine && <span style={{fontSize: '0.7rem', color: '#38bdf8', marginBottom: '2px', marginLeft: '5px'}}>{m.user}</span>}
                  <div className="bubble">{m.text}</div>
                  <span className="msg-time">{m.time || '--:--'}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={send} className="chat-footer-form">
          <input 
            className="chat-input"
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Écris ton message ici..." 
          />
          <button type="submit" style={{background: '#38bdf8', color: '#000', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold'}}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;