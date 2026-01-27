import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Écouter l'historique des messages (envoyé à la connexion)
    socket.on('message_history', (history) => {
      console.log('Historique reçu:', history);
      setMessages(history);
    });

    // Écouter les nouveaux messages
    socket.on('msg_to_client', (message) => {
      console.log('Nouveau message:', message);
      setMessages((prev) => [...prev, message]);
    });

    // Nettoyage à la déconnexion
    return () => {
      socket.off('message_history');
      socket.off('msg_to_client');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputText.trim()) {
      // Envoyer le message au serveur
      socket.emit('msg_to_server', {
        user: username,
        text: inputText,
      });
      
      setInputText('');
    }
  };

  // Écran de choix du pseudo
  if (!isUsernameSet) {
    return (
      <div className="username-container">
        <div className="username-box">
          <h2>💬 Chat en Temps Réel</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              placeholder="Entrez votre pseudo..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              autoFocus
            />
            <button type="submit" className="username-btn">
              Rejoindre le chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Écran principal du chat
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Chat - Connecté en tant que : {username}</h2>
        <button 
          onClick={() => setIsUsernameSet(false)}
          className="logout-btn"
        >
          Changer de pseudo
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`message ${msg.user === username ? 'own-message' : ''}`}
          >
            <div className="message-user">{msg.user}</div>
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          placeholder="Tapez votre message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default Chat;