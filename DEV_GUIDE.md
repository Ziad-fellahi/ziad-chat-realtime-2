# Guide de Développement

## Architecture Simplifiée

**Backend permanent** : `https://stage.govo.fr`  
**Frontend local** : `http://localhost:4000`  
**Frontend production** : Vercel

Le backend est hébergé en permanence et accessible depuis tous les environnements.

## Démarrage Rapide

### Frontend uniquement (Développement Local)

```bash
cd frontend
npm install
npm start
```

Le frontend démarre sur `http://localhost:4000` et se connecte automatiquement à `https://stage.govo.fr`.

**Pas besoin de démarrer le backend localement !** 🎉

### Console

Vous devriez voir :
```
🔧 Mode Local : Frontend (localhost:4000) → Backend (https://stage.govo.fr)
```

## Configuration

### Variables d'Environnement

**`.env.development`** (local) :
```env
REACT_APP_BACKEND_URL=https://stage.govo.fr
PORT=4000
```

**`.env.production`** (Vercel) :
```env
REACT_APP_BACKEND_URL=https://stage.govo.fr
```

### Ports

- **Frontend** : `4000` (local), dynamique (Vercel)
- **Backend** : `8080` (hébergé sur `https://stage.govo.fr`)

## CORS Backend

Le backend doit autoriser les requêtes depuis :
- `http://localhost:4000` (développement local)
- `https://*.vercel.app` (production Vercel)

**`backend/src/main.ts`** :
```typescript
app.enableCors({
  origin: [
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'https://stage.govo.fr',
    /^https:\/\/.*\.vercel\.app$/,
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

## Redirections après Login

Les utilisateurs sont automatiquement redirigés selon leur rôle :

| Rôle | Redirection |
|------|-------------|
| `admin` | `/dashboard` |
| `moniteur` | `/moniteur` |
| `secretaire` | `/secretaire` |
| `eleve` ou `user` | `/eleve` |

Voir [`Login.js`](frontend/src/pages/Login.js) et [`Home.js`](frontend/src/pages/Home.js) pour la logique.

## Dépannage

### Erreur CORS en local

**Symptôme** : "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution** :
1. Vérifiez que `http://localhost:4000` est dans les origines autorisées du backend
2. Si vous avez modifié `main.ts`, redéployez le backend

### Erreur CORS sur Vercel

**Symptôme** : "CORS policy blocked" en production

**Solution** :
1. Vérifiez que le regex `/^https:\/\/.*\.vercel\.app$/` est bien dans `main.ts`
2. Ou ajoutez votre URL Vercel spécifique : `https://votre-app.vercel.app`

### Le frontend ne charge pas

**Symptôme** : Page blanche ou erreurs de connexion

**Solutions** :
1. Ouvrez la console et vérifiez les erreurs
2. Vérifiez que `https://stage.govo.fr` est accessible : `curl https://stage.govo.fr`
3. Vérifiez l'onglet Network des DevTools
4. Effacez le cache du navigateur

### Redirection infinie

**Symptôme** : L'utilisateur est constamment redirigé vers `/login`

**Solutions** :
1. Vérifiez que le token est bien stocké dans `localStorage`
2. Ouvrez la console et regardez les logs de `AuthContext`
3. Vérifiez que le rôle est correct dans le token JWT
4. Effacez `localStorage` et reconnectez-vous

## Déploiement

### Vercel (Frontend)

1. Connectez votre repo GitHub à Vercel
2. Ajoutez la variable d'environnement :
   ```
   REACT_APP_BACKEND_URL=https://stage.govo.fr
   ```
3. Déployez

### Backend (déjà hébergé)

Le backend sur `https://stage.govo.fr` est déjà configuré et fonctionne.

## Tests

### Test de connexion backend

```bash
curl https://stage.govo.fr
```

### Test de login

```bash
curl -X POST https://stage.govo.fr/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

## Avantages de cette Architecture

✅ **Simplicité** : Pas de backend local à gérer  
✅ **Cohérence** : Même backend partout  
✅ **Rapidité** : Démarrage en quelques secondes  
✅ **Sécurité** : HTTPS partout  
✅ **Collaboration** : Données partagées entre développeurs
