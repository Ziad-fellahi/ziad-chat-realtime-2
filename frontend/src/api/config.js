/**
 * Configuration centralisée de l'API Backend
 * Backend permanent : https://stage.govo.fr
 * Utilisé en local ET en production
 */

// URL unique du backend (hébergé en permanence)
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://stage.govo.fr';

// Log de débogage en développement uniquement
if (process.env.NODE_ENV === 'development') {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal) {
    console.log('🔧 Mode Local : Frontend (localhost:4000) → Backend (https://stage.govo.fr)');
  } else {
    console.log('🚀 Mode Prod : Frontend (Vercel) → Backend (' + API_BASE_URL + ')');
  }
}

export default API_BASE_URL;
