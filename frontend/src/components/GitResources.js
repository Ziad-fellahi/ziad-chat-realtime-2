import React, { useState } from 'react';
import '../styles/GitResources.css';

const GitResources = () => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const copyFullSequence = () => {
    const sequence = "git add .\ngit commit -m 'Mise à jour'\ngit push origin main";
    copyToClipboard(sequence, 'full-seq');
  };

  const sections = [
    {
      title: "⚡ Séquence Quotidienne",
      isSpecial: true,
      commands: [
        { id: 'c1', cmd: "git add .", desc: "Préparer tous les fichiers modifiés." },
        { id: 'c2', cmd: "git commit -m 'Update'", desc: "Enregistrer les modifications localement." },
        { id: 'c3', cmd: "git push origin main", desc: "Envoyer le travail sur GitHub." }
      ]
    },
    {
      title: "🚀 Gestion Production (PM2)",
      commands: [
        { id: 'pm1', cmd: "pm2 status", desc: "Voir l'état de tes 4 instances et du tunnel." },
        { id: 'pm2', cmd: "pm2 logs", desc: "Afficher les erreurs du backend en direct." },
        { id: 'pm3', cmd: "pm2 restart govo-back", desc: "Redémarrer proprement les 4 cœurs." },
        { id: 'pm4', cmd: "pm2 save", desc: "Sauvegarder la config pour le prochain reboot." }
      ]
    },
    {
      title: "🔴 Redis & Temps Réel",
      commands: [
        { id: 'rd1', cmd: "redis-cli ping", desc: "Vérifier si Redis est vivant (réponse PONG)." },
        { id: 'rd2', cmd: "redis-cli monitor", desc: "Espionner les messages du chat en temps réel." },
        { id: 'rd3', cmd: "redis-cli info clients", desc: "Vérifier que les 4 instances sont connectées." }
      ]
    },
    {
      title: "🛠️ Maintenance & Réseau",
      commands: [
        { id: 'nt1', cmd: "curl http://localhost:4040/api/tunnels", desc: "Récupérer la nouvelle URL Ngrok." },
        { id: 'nt2', cmd: "sudo fuser -k 5000/tcp", desc: "Forcer la libération du port 5000." },
        { id: 'nt3', cmd: "npm run build", desc: "Compiler le code NestJS sur Ubuntu." }
      ]
    },
    {
      title: "🌿 Branches & Navigation",
      commands: [
        { id: 'c4', cmd: "git branch", desc: "Lister les branches existantes." },
        { id: 'c5', cmd: "git checkout <nom>", desc: "Changer de branche." },
        { id: 'c6', cmd: "git checkout -b <nom>", desc: "Créer et changer de branche." }
      ]
    }
  ];

  const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h1>Guide <span className="text-gradient">Serveur & Git</span></h1>
        <p>Cliquez sur une commande pour piloter votre serveur Ubuntu à distance.</p>
      </div>

      <div className="resources-grid">
        {sections.map((section, idx) => (
          <div key={idx} className={`resource-card ${section.isSpecial ? 'special-card' : ''}`}>
            <div className="card-header">
              <h3>{section.title}</h3>
              {section.isSpecial && (
                <button 
                  className={`copy-all-btn ${copiedId === 'full-seq' ? 'copied' : ''}`}
                  onClick={copyFullSequence}
                >
                  {copiedId === 'full-seq' ? 'Copié !' : 'Copier Git Push'}
                </button>
              )}
            </div>
            <div className="command-list">
              {section.commands.map((c) => (
                <div 
                  key={c.id} 
                  className={`command-item ${copiedId === c.id ? 'active' : ''}`}
                  onClick={() => copyToClipboard(c.cmd, c.id)}
                >
                  <div className="cmd-row">
                    <code>{c.cmd}</code>
                    <span className="copy-status">
                      {copiedId === c.id ? 'Copié' : <CopyIcon />}
                    </span>
                  </div>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitResources;