# Configuration Finale - Backend Hébergé en Permanence

## ✅ Architecture Simplifiée

```
Frontend Local (localhost:4000)  ────┐
                                     │
Frontend Vercel (Production)    ────┼───► Backend Permanent
                                     │    https://stage.govo.fr
Tout autre environnement        ────┘
```

## ✅ Modifications Appliquées

### 1. Configuration API Centralisée

**Fichier** : `frontend/src/api/config.js`

```javascript
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://stage.govo.fr';
```

**Résultat** :
- ✅ Une seule URL pour tous les environnements
- ✅ Pas de détection localhost/port local
- ✅ Backend permanent accessible partout

### 2. Variables d'Environnement

**`.env.development`** (local) :
```env
REACT_APP_BACKEND_URL=https://stage.govo.fr
PORT=4000
```

**`.env.production`** (Vercel) :
```env
REACT_APP_BACKEND_URL=https://stage.govo.fr
```

### 3. CORS Backend

**Fichier** : `backend/src/main.ts`

```typescript
app.enableCors({
  origin: [
    'http://localhost:4000',         // ✅ Frontend local
    'http://127.0.0.1:4000',
    'https://stage.govo.fr',         // ✅ Backend hébergé
    /^https:\/\/.*\.vercel\.app$/,   // ✅ Tous domaines Vercel
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

**Résultat** :
- ✅ Autorise localhost:4000
- ✅ Autorise tous les domaines Vercel
- ✅ Autorise stage.govo.fr

### 4. Redirections après Login

**Fichier** : `frontend/src/pages/Login.js`

```javascript
const rolePages = {
  admin: '/dashboard',
  moniteur: '/moniteur',
  secretaire: '/secretaire',
  eleve: '/eleve',
  user: '/eleve', // Alias
};

navigate(rolePages[data.role] || '/', { replace: true });
```

**Résultat** :
- ✅ Admin → `/dashboard`
- ✅ Moniteur → `/moniteur`
- ✅ Secrétaire → `/secretaire`
- ✅ Élève/User → `/eleve`
- ✅ Navigation avec `replace: true` (pas de retour arrière)

## ✅ Commandes de Démarrage

### Développement Local (Frontend uniquement)

```bash
cd frontend
npm start
```

**Pas besoin de démarrer le backend !** Le frontend se connecte à `https://stage.govo.fr`.

### Console

```
🔧 Mode Local : Frontend (localhost:4000) → Backend (https://stage.govo.fr)
```

### Production (Vercel)

1. Connectez votre repo à Vercel
2. Variable d'environnement : `REACT_APP_BACKEND_URL=https://stage.govo.fr`
3. Déployez

## ✅ Vérifications

### Test de connexion

```bash
# Backend accessible
curl https://stage.govo.fr

# Test login
curl -X POST https://stage.govo.fr/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Test CORS depuis localhost

1. Démarrez le frontend : `npm start`
2. Ouvrez `http://localhost:4000`
3. Essayez de vous connecter
4. Vérifiez la console : pas d'erreur CORS

### Test redirections

1. Connectez-vous avec différents rôles
2. Vérifiez que vous êtes redirigé vers la bonne page
3. Vérifiez qu'il n'y a pas de boucle de redirection

## ✅ Avantages

| Avantage | Description |
|----------|-------------|
| **Simplicité** | Pas de backend local à gérer |
| **Cohérence** | Même base de données partout |
| **Rapidité** | Démarrage en 10 secondes |
| **Sécurité** | HTTPS partout |
| **Collaboration** | Données partagées entre développeurs |
| **Production-ready** | Configuration identique en dev et prod |

## ✅ Fichiers de Configuration Créés/Modifiés

1. ✅ `frontend/src/api/config.js` - Configuration centralisée
2. ✅ `frontend/.env.development` - Variables dev
3. ✅ `frontend/.env.production` - Variables prod
4. ✅ `backend/src/main.ts` - CORS mis à jour
5. ✅ `frontend/src/api/README.md` - Documentation API
6. ✅ `DEV_GUIDE.md` - Guide de développement
7. ✅ `CONFIGURATION_FINALE.md` - Ce fichier

## ✅ Prochaines Étapes

1. **Testez en local** :
   ```bash
   cd frontend
   npm start
   ```

2. **Vérifiez la console** : Devrait afficher le log de connexion au backend

3. **Testez une connexion** : Créez un compte ou connectez-vous

4. **Vérifiez les redirections** : Assurez-vous d'être redirigé selon votre rôle

5. **Déployez sur Vercel** : Configurez la variable d'environnement

## ✅ Support

En cas de problème :
1. Vérifiez les logs de la console
2. Vérifiez l'onglet Network des DevTools
3. Consultez `frontend/src/api/README.md` pour le dépannage
4. Consultez `DEV_GUIDE.md` pour les solutions courantes
