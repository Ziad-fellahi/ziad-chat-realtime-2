# GoVo Mobile - Application Mobile

Application mobile React Native pour GoVo, portée depuis l'application Web.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go sur votre téléphone (iOS/Android)

### Installation des dépendances

```bash
cd frontend/appmobile
npm install
```

### Démarrage de l'application

```bash
npm start
```

Puis scannez le QR code avec :
- **iOS** : Application Appareil photo
- **Android** : Application Expo Go

### Autres commandes

```bash
npm run android  # Lancer sur émulateur Android
npm run ios      # Lancer sur simulateur iOS
npm run web      # Lancer dans le navigateur
```

## 📱 Architecture

```
appmobile/
├── app/                          # Routes avec expo-router
│   ├── _layout.js               # Layout racine avec AuthProvider
│   ├── index.js                 # Redirect intelligent basé sur auth
│   ├── login.js                 # Page de connexion
│   └── (authenticated)/         # Routes protégées
│       ├── _layout.js          # Layout authentifié
│       ├── eleve.js            # Espace élève
│       ├── moniteur.js         # Espace moniteur
│       └── admin.js            # Dashboard admin
├── components/                  # Composants réutilisables
│   ├── PageHeader.js
│   └── Card.js
├── contexts/                    # Contextes React
│   └── AuthContext.js          # Gestion auth avec AsyncStorage
├── config/                      # Configuration
│   └── api.js                  # URL backend (stage.govo.fr)
├── package.json
├── app.json
└── babel.config.js
```

## 🔐 Authentification

L'authentification utilise **AsyncStorage** au lieu de localStorage :

```javascript
// Sauvegarder le token
await AsyncStorage.setItem('token', token);

// Récupérer le token
const token = await AsyncStorage.getItem('token');

// Nettoyer
await AsyncStorage.clear();
```

## 🔄 Navigation et Redirection

### Écran d'Accueil
L'application démarre sur un écran d'accueil élégant (`app/index.js`) qui :
- **Vérifie automatiquement** si un token JWT existe dans AsyncStorage
- **Redirige immédiatement** vers l'espace utilisateur si connecté
- **Affiche l'écran de bienvenue** avec logo et bouton "Commencer" si non connecté

### Redirection Intelligente
Après le login ou au démarrage, redirection basée sur le rôle :

- **Admin** → `/admin` (Dashboard complet avec chat temps réel)
- **Moniteur** → `/moniteur` (Espace moniteur)
- **Secrétaire** → `/admin` (Même vue que admin)
- **Élève/User** → `/eleve` (Espace élève)

## 🌐 Backend

L'application est connectée en permanence à :
```
https://stage.govo.fr
```

Configuration dans `config/api.js` :
```javascript
export const API_BASE_URL = 'https://stage.govo.fr';
```

## 📡 WebSocket (Socket.io)

Le Dashboard Admin utilise Socket.io pour le temps réel :
- Affichage des utilisateurs en ligne
- Messages en temps réel
- Métriques live (msg/sec)

## 🎨 Design Mobile

- **LinearGradient** pour les backgrounds
- **TouchableOpacity** pour les boutons
- **ScrollView** pour le défilement
- **FlatList** pour les listes performantes
- **SafeAreaView** pour éviter l'encoche
- **KeyboardAvoidingView** pour les formulaires
- **Design 100% responsive** qui s'adapte à tous les écrans
- **Système de constantes** pour un design cohérent

### Design Responsive

L'application utilise un système complet de design responsive :

- ✅ **SafeAreaView** sur tous les écrans (évite l'encoche)
- ✅ **Flexbox** avec `flex: 1` (pas de hauteurs fixes)
- ✅ **useWindowDimensions** pour les dimensions dynamiques
- ✅ **Constantes responsive** (`SPACING`, `FONT_SIZES`, `COLORS`)
- ✅ **ScrollView** partout (contenu toujours accessible)
- ✅ **KeyboardAvoidingView** sur les formulaires

Voir [RESPONSIVE_GUIDE.md](./RESPONSIVE_GUIDE.md) pour plus de détails.

## 📝 Différences Web vs Mobile

### Stockage
- Web : `localStorage`
- Mobile : `AsyncStorage` (async/await)

### Navigation
- Web : `react-router-dom`
- Mobile : `expo-router`

### Composants
- `<div>` → `<View>`
- `<h1>`, `<p>` → `<Text>`
- `<button>` → `<TouchableOpacity>` / `<Button>`
- `<input>` → `<TextInput>`

### Styles
- Web : CSS / CSS-in-JS
- Mobile : StyleSheet.create()

## 🛠️ Fonctionnalités Portées

✅ Authentification JWT avec AsyncStorage  
✅ Navigation intelligente basée sur les rôles  
✅ Pages Élève, Moniteur, Admin  
✅ Dashboard Admin avec Socket.io  
✅ Chat temps réel  
✅ Liste des utilisateurs en ligne  
✅ Métriques en temps réel  
✅ Déconnexion sécurisée  

## 🔧 Dépendances Principales

```json
{
  "expo": "~51.0.0",
  "expo-router": "~3.5.0",
  "react-native": "0.74.0",
  "@react-native-async-storage/async-storage": "1.23.1",
  "expo-secure-store": "~13.0.1",
  "socket.io-client": "^4.5.4",
  "expo-linear-gradient": "~13.0.2"
}
```

## 🐛 Debugging

### Voir les logs
```bash
npm start
```
Puis appuyer sur `j` pour ouvrir le debugger

### Erreurs communes

**Module not found** :
```bash
npm install
expo start -c  # Clear cache
```

**Socket.io ne se connecte pas** :
Vérifiez que `https://stage.govo.fr` est accessible

**Token expiré** :
Le token JWT expire après un certain temps. Reconnectez-vous.

## 📦 Build Production

### Android APK
```bash
expo build:android
```

### iOS App
```bash
expo build:ios
```

### EAS Build (Recommandé)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🤝 Contribution

1. Toute modification doit être testée sur iOS ET Android
2. Utiliser `StyleSheet.create()` pour les styles
3. Respecter l'architecture expo-router
4. Garder la cohérence avec l'app Web

## 📞 Support

En cas de problème :
1. Vérifier les logs Expo
2. Vérifier la connexion au backend
3. Clear cache : `expo start -c`
4. Réinstaller : `rm -rf node_modules && npm install`

---

**Powered by Expo & React Native** 🚀
