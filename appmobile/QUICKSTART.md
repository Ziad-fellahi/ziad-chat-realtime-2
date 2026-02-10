# 🚀 Guide de Démarrage Rapide - GoVo Mobile

## Installation en 3 étapes

### 1️⃣ Installer les dépendances

```bash
cd frontend/appmobile
npm install
```

### 2️⃣ Lancer l'application

```bash
npm start
```

### 3️⃣ Scanner le QR Code

- **iOS** : Ouvrir l'appareil photo et scanner
- **Android** : Ouvrir Expo Go et scanner

## ✅ Vérification

Une fois l'app lancée, vous devriez voir :
- Page de login avec fond dégradé bleu
- Connexion à `https://stage.govo.fr`
- Redirection automatique après login selon votre rôle

## 🔑 Comptes de Test

Utilisez les mêmes identifiants que l'application Web :

```
Admin : admin / motdepasse
Moniteur : moniteur1 / motdepasse
Élève : eleve1 / motdepasse
```

## 📱 Pages Disponibles

- **`/login`** : Connexion (public)
- **`/eleve`** : Espace élève (protégé)
- **`/moniteur`** : Espace moniteur (protégé)
- **`/admin`** : Dashboard admin avec chat temps réel (protégé)

## 🔧 Commandes Utiles

```bash
npm start           # Démarrer l'app
npm run android     # Lancer sur Android
npm run ios         # Lancer sur iOS
npm run web         # Lancer dans le navigateur
expo start -c       # Démarrer avec cache nettoyé
```

## 🐛 Problèmes Courants

### Module not found
```bash
rm -rf node_modules
npm install
expo start -c
```

### Socket.io ne se connecte pas
Vérifiez que vous êtes connecté à internet et que `https://stage.govo.fr` est accessible.

### L'app ne se lance pas
```bash
npm install -g expo-cli
expo doctor  # Diagnostic
```

## 📖 Documentation Complète

Voir [README.md](./README.md) pour la documentation complète.

---

**Bon développement ! 🎉**
