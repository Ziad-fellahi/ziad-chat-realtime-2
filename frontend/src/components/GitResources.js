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

  const sections = [
    {
      title: "🚨 ZONE DE RÉCUPÉRATION",
      isSpecial: true,
      commands: [
        { id: 'full-reset', cmd: "pm2 delete all && sudo fuser -k 5000/tcp && sudo systemctl restart redis-server && cd /var/www/govostage/backend && npm run build && pm2 start dist/main.js --name 'govo-back' -i 4 && pm2 start 'ngrok http 5000' --name 'ngrok-tunnel' && pm2 save", desc: "RESET TOTAL DU SERVEUR" }
      ]
    },
    {
      title: "🚀 Production & Redis",
      commands: [
        { id: 'pm1', cmd: "pm2 status", desc: "Statut des 4 instances" },
        { id: 'rd1', cmd: "redis-cli monitor", desc: "Surveiller le chat" },
        { id: 'nt1', cmd: "curl http://localhost:4040/api/tunnels", desc: "Lien Ngrok" }
      ]
    }
  ];

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h1>Guide <span className="text-gradient">Serveur</span></h1>
      </div>
      <div className="resources-grid">
        {sections.map((section, idx) => (
          <div key={idx} className="resource-card">
            <h3>{section.title}</h3>
            <div className="command-list">
              {section.commands.map((c) => (
                <div key={c.id} className="command-item" onClick={() => copyToClipboard(c.cmd, c.id)}>
                  <code>{c.cmd}</code>
                  <p>{c.desc} {copiedId === c.id && "✅"}</p>
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