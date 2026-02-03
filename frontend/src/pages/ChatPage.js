import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatPage.css'; // IMPORTANT : un seul point si le CSS est au même endroit

const socket = io(process.env.REACT_APP_BACKEND_URL);

function ChatPage({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Charger l'historique
    fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/messages`, {
      headers: { "ngrok-skip-browser-warning": "true" }
    })
    .then(res => res.json())
    .then(data => setMessages(data.messages || []));

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('message');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('message', { user: currentUser || 'Anonyme', text: input });
      setInput('');
    }
  };

  return (
    <div className="chat-page-container">
      <div className="messages-area">
        {messages.map((m, i) => (
          <div key={i} className={`msg-group ${m.user === currentUser ? 'me' : 'others'}`}>
            <span className="user-label">{m.user}</span>
            <div className="msg-bubble">{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-footer" onSubmit={handleSend}>
        <input 
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
        />
        <button type="submit" className="send-btn">Envoyer</button>
      </form>
    </div>
  );
}

export default ChatPage;