# Configuration API

Ce dossier contient la configuration centralisée pour les appels API.

## Architecture Simplifiée

**Backend permanent** : `https://stage.govo.fr`

Le backend est hébergé en permanence et accessible depuis :
- ✅ Votre machine locale (`localhost:4000`)
- ✅ Vercel (production)
- ✅ Tout autre environnement

## Fichiers

### `config.js`

Définit `API_BASE_URL` qui pointe **toujours** vers le backend hébergé :

```javascript
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://stage.govo.fr';
```

## Usage

```javascript
import { API_BASE_URL } from '../api/config';

// Utilisation dans les appels API
fetch(`${API_BASE_URL}/auth/login`, { ... });

// Utilisation avec Socket.io
const socket = io(API_BASE_URL, { ... });
```

## Configuration

### Développement Local

**Frontend** : `http://localhost:4000`  
**Backend** : `https://stage.govo.fr` ✅

Pas de backend local à démarrer ! Tout passe par le serveur hébergé.

**Commande :**
```bash
cd frontend
npm start
```

**Console :**
```
🔧 Mode Local : Frontend (localhost:4000) → Backend (https://stage.govo.fr)
```

### Production (Vercel)

Variable d'environnement déjà configurée :
```
REACT_APP_BACKEND_URL=https://stage.govo.fr
```

**Console :**
```
🚀 Mode Prod : Frontend (Vercel) → Backend (https://stage.govo.fr)
```

## CORS Backend

Le backend doit autoriser les requêtes depuis :

**`backend/src/main.ts`** :
```typescript
app.enableCors({
  origin: [
    'http://localhost:4000',         // Frontend local
    'http://127.0.0.1:4000',
    'https://stage.govo.fr',         // Backend hébergé
    /^https:\/\/.*\.vercel\.app$/,   // Tous domaines Vercel
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

## Avantages

✅ **Simplicité** : Une seule URL pour tous les environnements  
✅ **Pas de backend local** : Pas besoin de démarrer NestJS localement  
✅ **Données partagées** : Même base de données en dev et prod  
✅ **HTTPS** : Connexions sécurisées même en développement  

## Redirections après Login

Les utilisateurs sont automatiquement redirigés selon leur rôle :

- `admin` → `/dashboard`
- `moniteur` → `/moniteur`
- `secretaire` → `/secretaire`
- `eleve` ou `user` → `/eleve`

Voir `Login.js` pour la logique de redirection.

## Dépannage

### Erreur CORS depuis localhost

Si vous voyez "CORS policy blocked" en local :
1. Vérifiez que le backend inclut `http://localhost:4000` dans les origines autorisées
2. Redéployez le backend si nécessaire

### Erreur CORS depuis Vercel

Si vous voyez "CORS policy blocked" en production :
1. Vérifiez que le regex `/^https:\/\/.*\.vercel\.app$/` est bien dans `main.ts`
2. Ou ajoutez votre domaine Vercel explicitement

### Le frontend ne se connecte pas

1. Vérifiez que `https://stage.govo.fr` est accessible : `curl https://stage.govo.fr`
2. Ouvrez la console et regardez le message de log
3. Vérifiez les erreurs réseau dans l'onglet Network des DevTools


