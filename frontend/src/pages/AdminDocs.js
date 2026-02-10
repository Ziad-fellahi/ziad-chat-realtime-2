import React, { useState } from 'react';
import { API_BASE_URL } from '../api/config';
import '../styles/AdminDocs.css';

const AdminDocs = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [adminName, setAdminName] = useState('admin_test');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const dynamicAdminCmd = `curl -X POST ${API_BASE_URL}/auth/register -H 'Content-Type: application/json' -d '{"username":"${adminName}", "password":"${adminName}", "role":"admin"}'`;

  const sections = [
    {
      title: "🚨 Séquence d'Initialisation (Cold Boot)",
      isSpecial: true,
      commands: [
        { 
          id: 'full-reset', 
          cmd: "pm2 delete all && sudo fuser -k 8080/tcp && sudo systemctl restart redis-server && cd /var/www/govostage/backend && npm run build && pm2 start dist/main.js --name 'govo-back' -i 4 && pm2 start 'ngrok http 8080' --name 'ngrok-tunnel' && pm2 save", 
          desc: "Relance complète : Nettoyage ports, Redis, Build et Cluster 4 cœurs." 
        }
      ]
    },
    {
      title: "🚀 Gestion Serveur (PM2)",
      commands: [
        { id: 'pm1', cmd: "pm2 status", desc: "État des instances et monitoring." },
        { id: 'pm2', cmd: "pm2 logs govo-back", desc: "Logs en temps réel du backend." },
        { id: 'pm3', cmd: "pm2 stop all", desc: "Arrêt immédiat de tous les processus." }
      ]
    },
    {
      title: "🔴 Synchronisation Redis",
      commands: [
        { id: 'rd1', cmd: "redis-cli monitor", desc: "Surveiller les messages transitant entre les instances." },
        { id: 'rd2', cmd: "redis-cli info clients", desc: "Vérifier le nombre d'instances connectées à Redis." },
        { id: 'rd3', cmd: "sudo systemctl restart redis-server", desc: "Redémarrer le service Redis proprement." }
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
        <h1>Admin <span className="text-gradient">Console</span></h1>
        <p>Gestion de l'infrastructure Redis & Cluster Multi-cœurs.</p>
      </div>

      <div className="resources-grid">
        {/* GÉNÉRATEUR ADMIN */}
        <div className="resource-card special-card">
          <div className="card-header">
            <h3>👤 Création de compte</h3>
            <span className="admin-badge-right">ADMIN</span>
          </div>
          <div className="admin-generator">
            <input 
              type="text" 
              placeholder="Nom du nouvel admin..." 
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="admin-input"
            />
            <div 
              className={`command-item ${copiedId === 'dynamic-adm' ? 'active' : ''}`}
              onClick={() => copyToClipboard(dynamicAdminCmd, 'dynamic-adm')}
            >
              <div className="cmd-row">
                <code>{dynamicAdminCmd}</code>
                <span className="copy-status">
                  {copiedId === 'dynamic-adm' ? 'Copié' : <CopyIcon />}
                </span>
              </div>
              <p>Nom et Password du compte Admin : <strong>{adminName}</strong></p>
            </div>
          </div>
        </div>

        {/* SECTIONS CLASSIQUES */}
        {sections.map((section, idx) => (
          <div key={idx} className={`resource-card ${section.isSpecial ? 'special-card' : ''}`}>
            <div className="card-header">
              <h3>{section.title}</h3>
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

export default AdminDocs;