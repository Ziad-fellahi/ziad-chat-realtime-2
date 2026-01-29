import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

// Connexion au tunnel (LocalTunnel ou Ngrok)
const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000', { 
  transports: ['websocket'],
  // Ce header évite les blocages sur certains tunnels
  extraHeaders: {
    "bypass-tunnel-reminder": "true" 
  }
});

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // SE SOUVENIR DE MOI
    const savedName = localStorage.getItem('chat-user');
    if (savedName) {
      setUserName(savedName);
      setIsLogged(true);
    }

    socket.on('message_history', (history) => setChat(history));
    socket.on('msg_to_client', (payload) => setChat(prev => [...prev, payload]));
    
    return () => { 
      socket.off('message_history'); 
      socket.off('msg_to_client'); 
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('chat-user', userName);
      setIsLogged(true);
    }
  };

  // CHANGER DE NOM
  const handleLogout = () => {
    localStorage.removeItem('chat-user');
    window.location.reload(); 
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('msg_to_server', { user: userName, text: message });
      setMessage('');
    }
  };

  if (!isLogged) {
    return (
      <div className="home-container">
        <form onSubmit={handleLogin}>
          <input 
            style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
            placeholder="Ton pseudo..." 
            value={userName}
            onChange={e => setUserName(e.target.value)} 
          />
          <button className="start-button" style={{marginLeft: '10px', padding: '10px', cursor: 'pointer'}}>Entrer</button>
        </form>
      </div>
    );
  }

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
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ecrivez ici..." />
        <button type="submit" className="send-btn">➤</button>
      </form>
    </div>
  );
}

export default ChatPage;