// ... dans ton return
<div className="chat-container">
  <div className="messages-wrapper">
    {messages.map((m, i) => (
      <div key={i} className={`message-row ${m.user === currentUser ? 'me' : 'others'}`}>
        <span className="user-name">{m.user}</span>
        <div className="bubble">
          {m.text}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} /> {/* Pour le scroll auto */}
  </div>

  <form className="input-area" onSubmit={sendMessage}>
    <input 
      className="chat-input"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Écris ton message ici..."
    />
    <button className="send-btn" type="submit">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  </form>
</div>