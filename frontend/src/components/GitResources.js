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
      title: "🌿 Branches & Navigation",
      commands: [
        { id: 'c4', cmd: "git branch", desc: "Lister les branches existantes." },
        { id: 'c5', cmd: "git checkout <nom>", desc: "Changer de branche." },
        { id: 'c6', cmd: "git checkout -b <nom>", desc: "Créer et changer de branche." }
      ]
    },
    {
      title: "🔄 Fusion & Synchronisation",
      commands: [
        { id: 'c7', cmd: "git pull", desc: "Récupérer le travail des autres." },
        { id: 'c8', cmd: "git merge <source>", desc: "Fusionner une branche." },
        { id: 'c9', cmd: "git merge --abort", desc: "Annuler une fusion qui se passe mal." }
      ]
    },
    {
      title: "🌐 Configuration",
      commands: [
        { id: 'c10', cmd: "git remote -v", desc: "Voir l'URL actuelle du dépôt." },
        { id: 'c11', cmd: "git remote set-url origin <url>", desc: "Changer l'URL de destination." }
      ]
    }
  ];

  // Icône de copie minimaliste (SVG)
  const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h1>Guide <span className="text-gradient">Git</span></h1>
        <p>Cliquez sur une commande pour la copier instantanément dans votre terminal.</p>
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
                  {copiedId === 'full-seq' ? 'Copié !' : 'Copier la séquence'}
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