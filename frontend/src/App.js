import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'; 

// URL de ton backend NestJS
const SOCKET_URL = 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Pour scroller automatiquement vers le bas
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Connexion au backend
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // 2. Réception de l'historique (dès qu'on se connecte)
    newSocket.on('message_history', (history) => {
      setMessages(history);
    });

    // 3. Réception d'un nouveau message en temps réel
    newSocket.on('msg_to_client', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Nettoyage si on quitte la page
    return () => newSocket.close();
  }, []);

  // Scroll automatique à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = () => {
    if (username.trim()) setIsLoggedIn(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && socket) {
      // Envoi au backend
      socket.emit('msg_to_server', {
        user: username,
        text: currentMessage,
      });
      setCurrentMessage('');
    }
  };

  // --- Écran de Login ---
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Bienvenue 👋</h2>
          <input
            type="text"
            placeholder="Choisis ton pseudo..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Entrer dans le chat</button>
        </div>
      </div>
    );
  }

  // --- Écran de Chat ---
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Discussion en direct (Connecté: {username})</h3>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => {
          const isMe = msg.user === username;
          return (
            <div key={index} className={`message-row ${isMe ? 'my-message' : 'other-message'}`}>
              <div className="message-bubble">
                <div className="message-user">{msg.user}</div>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-footer" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Écrire un message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Envoyer ➤</button>
      </form>
    </div>
  );
}

export default App;