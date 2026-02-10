/**
 * Configuration centralisée de l'API Backend
 * Gère automatiquement l'URL selon l'environnement (local vs production)
 */

// Détection de l'environnement
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Configuration de l'URL de base
export const API_BASE_URL = isLocalhost
  ? 'http://localhost:8080'
  : process.env.REACT_APP_BACKEND_URL || 'https://stage.govo.fr';

// Log de débogage en développement uniquement
if (process.env.NODE_ENV === 'development') {
  if (isLocalhost) {
    console.log('🔧 Mode Local : connecté au backend local (http://localhost:8080)');
  } else {
    console.log('🚀 Mode Prod : connecté à ' + API_BASE_URL);
  }
}

export default API_BASE_URL;
