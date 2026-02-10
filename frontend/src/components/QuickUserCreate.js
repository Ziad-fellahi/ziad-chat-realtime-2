import React, { useState } from 'react';
import { Copy } from 'lucide-react';

function QuickUserCreate({ allowedRoles = ['eleve', 'moniteur', 'secretaire', 'admin'] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(allowedRoles[0] || 'eleve');
  const [message, setMessage] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const token = localStorage.getItem('token');

  // Fonction de génération de mot de passe aléatoire sécurisé
  const generateSecurePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let generatedPassword = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    return generatedPassword;
  };

  // Handler pour le bouton "Générer un mot de passe"
  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setPassword(newPassword);
    setMessage('🔑 Mot de passe généré automatiquement');
    setTimeout(() => setMessage(''), 2000);
  };

  // Handler pour créer le compte
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!username.trim()) {
      setMessage('❌ Le nom d\'utilisateur est requis');
      return;
    }

    // Si le mot de passe est vide, en générer un automatiquement
    const finalPassword = password.trim() || generateSecurePassword();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username.trim(),
          password: finalPassword,
          role: role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedCredentials({
          username: username.trim(),
          password: finalPassword,
          role: role
        });
        setUsername('');
        setPassword('');
        setRole(allowedRoles[0] || 'eleve');
        setMessage('✅ Compte créé avec succès');
      } else {
        setMessage(`❌ ${data.message || 'Erreur lors de la création'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur de connexion au serveur');
    }
  };

  // Fonctions de copie
  const copyUsername = () => {
    navigator.clipboard.writeText(createdCredentials.username);
    setMessage('✅ Username copié');
    setTimeout(() => setMessage(''), 2000);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(createdCredentials.password);
    setMessage('✅ Mot de passe copié');
    setTimeout(() => setMessage(''), 2000);
  };

  // Mapping des labels de rôles
  const roleLabels = {
    'eleve': 'Élève',
    'moniteur': 'Moniteur',
    'secretaire': 'Secrétaire',
    'admin': 'Admin'
  };

  return (
    <>
      <div className="quick-create-card">
        <h3 className="quick-create-title">
          ➕ {allowedRoles.length === 1 ? `Création d'un nouveau compte ${roleLabels[allowedRoles[0]].toLowerCase()}` : 'Ajout Rapide d\'Utilisateur'}
        </h3>
        <form onSubmit={handleCreateAccount} className="quick-create-form">
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez le username"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe (optionnel)</label>
            <div className="password-input-group">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Laisser vide pour générer automatiquement"
                className="form-input"
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="btn-generate-password"
                title="Générer un mot de passe aléatoire"
              >
                🎲
              </button>
            </div>
            <span className="form-hint">Si vide, un mot de passe sera généré automatiquement</span>
          </div>

          {/* Afficher le rôle selon les permissions */}
          {allowedRoles.length === 1 ? (
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <div className="role-fixed">
                <span className="role-badge">{roleLabels[allowedRoles[0]]}</span>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                {allowedRoles.map((allowedRole) => (
                  <option key={allowedRole} value={allowedRole}>
                    {roleLabels[allowedRole]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="btn-create-account">
            Créer le compte
          </button>

          {message && (
            <div className={`message ${message.includes('❌') ? 'message-error' : 'message-success'}`}>
              {message}
            </div>
          )}
        </form>

        {/* Bloc de succès avec identifiants */}
        {createdCredentials && (
          <div className="success-block">
            <h4 className="success-title">✅ Compte créé avec succès !</h4>
            <div className="credentials-display">
              <div className="credential-row">
                <div className="credential-field">
                  <label className="credential-label">Username</label>
                  <div className="credential-value-container">
                    <span className="credential-value">{createdCredentials.username}</span>
                    <button
                      onClick={copyUsername}
                      className="btn-copy-credential"
                      title="Copier le username"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="credential-row">
                <div className="credential-field">
                  <label className="credential-label">Mot de passe</label>
                  <div className="credential-value-container">
                    <span className="credential-value password-value">{createdCredentials.password}</span>
                    <button
                      onClick={copyPassword}
                      className="btn-copy-credential"
                      title="Copier le mot de passe"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default QuickUserCreate;