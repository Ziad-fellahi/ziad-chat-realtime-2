# Assets Directory

Ce dossier contient les ressources graphiques de l'application :

- **icon.png** : Icône de l'application (1024x1024px)
- **splash.png** : Écran de démarrage (1242x2436px)
- **adaptive-icon.png** : Icône Android adaptative (1024x1024px)
- **favicon.png** : Favicon pour le Web (48x48px)

## 📐 Dimensions Recommandées

### Icon (icon.png)
- Taille : 1024x1024px
- Format : PNG avec transparence
- Usage : iOS et Android

### Splash Screen (splash.png)
- Taille : 1242x2436px (iPhone 11 Pro Max)
- Format : PNG
- Background : #ffffff (blanc)
- Usage : Écran de démarrage

### Adaptive Icon (adaptive-icon.png)
- Taille : 1024x1024px
- Format : PNG avec transparence
- Zone sûre : Cercle de 640px de diamètre au centre
- Usage : Android uniquement

### Favicon (favicon.png)
- Taille : 48x48px
- Format : PNG
- Usage : Version Web

## 🎨 Création des Assets

Vous pouvez créer vos assets avec :
- Figma
- Adobe Illustrator
- Canva
- Ou tout autre outil de design

## 🔧 Génération Automatique

Expo peut générer automatiquement tous les assets à partir d'une seule image :

```bash
npx expo-generate-icon --icon ./path/to/your/icon.png
```

## 📦 Assets Actuels

⚠️ Les assets par défaut doivent être remplacés par vos propres images.

Pour l'instant, utilisez des placeholders en attendant les vrais assets.

## 🔗 Resources

- [Expo Icon Guidelines](https://docs.expo.dev/develop/user-interface/app-icons/)
- [Expo Splash Screen](https://docs.expo.dev/develop/user-interface/splash-screen/)
