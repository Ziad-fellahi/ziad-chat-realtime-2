import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css'; // Vérifie bien que le fichier est dans le même dossier !

const socket = io(process.env.REACT_APP_BACKEND_URL);

function Chat({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Charger l'historique
    fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/messages`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
    })
    .then(res => res.json())
    .then(data => setMessages(data.messages || []));

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('message');
  }, []);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const msgData = { user: currentUser || 'Anonyme', text: input };
      socket.emit('message', msgData);
      setInput('');
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <span>Serveur Live : 🟢 Connecté</span>
        <small>{messages.length} messages</small>
      </div>

      <div className="messages-container">
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.user === currentUser ? 'me' : 'others'}`}>
            <span className="user-tag">{m.user}</span>
            <div className="message-bubble">{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input 
          className="chat-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez un message..."
        />
        <button type="submit" className="send-button">Envoyer</button>
      </form>
    </div>
  );
}

export default Chat;