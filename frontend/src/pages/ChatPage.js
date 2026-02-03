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
    socket.on('msg_to_client', (msg) => setChat(prev => [...prev, msg]));

    return () => { socket.off('msg_to_client'); };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      socket.emit('msg_to_server', { user: userName, text: message, time: timeStr });
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
                  <div className="msg-header">
                    <span className="username-label">{m.user}</span>
                    <span className="timestamp">{m.time}</span>
                  </div>
                  <div className="bubble">{m.text}</div>
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
            placeholder="Écrire un message..."
          />
          <button type="submit" className="send-btn">Envoyer</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;