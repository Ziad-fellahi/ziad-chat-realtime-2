import React, { useEffect } from 'react';
import { Copy, User, Lock, ClipboardList } from 'lucide-react';
import '../styles/Toast.css';

function Toast({ username, password, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const copyUsername = () => {
    navigator.clipboard.writeText(username);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
  };

  const copyAll = () => {
    const text = `Identifiant: ${username}, MDP: ${password}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="toast-container">
      <div className="toast-content">
        <span className="toast-text">
          Compte créé : <strong>{username}</strong> | <strong>{password}</strong>
        </span>
        <div className="toast-actions">
          <button
            onClick={copyUsername}
            className="toast-btn"
            title="Copier le username"
          >
            <User size={16} />
          </button>
          <button
            onClick={copyPassword}
            className="toast-btn"
            title="Copier le mot de passe"
          >
            <Lock size={16} />
          </button>
          <button
            onClick={copyAll}
            className="toast-btn"
            title="Tout copier"
          >
            <ClipboardList size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
