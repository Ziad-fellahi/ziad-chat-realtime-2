# Configuration API

Ce dossier contient la configuration centralisée pour les appels API.

## Fichiers

### `config.js`

Définit `API_BASE_URL` qui gère automatiquement l'URL du backend selon l'environnement :

- **Local** : `http://localhost:8080` (détecté automatiquement)
- **Production** : Utilise `REACT_APP_BACKEND_URL` ou fallback sur `https://stage.govo.fr`

## Usage

```javascript
import { API_BASE_URL } from '../api/config';

// Utilisation dans les appels API
fetch(`${API_BASE_URL}/auth/login`, { ... });

// Utilisation avec Socket.io
const socket = io(API_BASE_URL, { ... });
```

## Environnements

### Développement Local
L'application détecte automatiquement `localhost` et utilise `http://localhost:8080`.

### Production (Vercel)
Définir la variable d'environnement dans Vercel :
```
REACT_APP_BACKEND_URL=https://votre-backend.com
```

## Logs de Débogage

En mode développement, un message s'affiche dans la console :
- `🔧 Mode Local : connecté au backend local (http://localhost:8080)`
- `🚀 Mode Prod : connecté à https://stage.govo.fr`

Ces logs n'apparaissent pas en production (`NODE_ENV=production`).
