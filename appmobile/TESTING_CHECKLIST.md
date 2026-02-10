# 🧪 Tests Responsive - Checklist

## ✅ Tests à Effectuer

### 1. **Installation et Démarrage**
```bash
cd frontend/appmobile
npm install
npm start
```

**Vérifications :**
- [ ] Pas d'erreurs lors de l'installation
- [ ] Application démarre correctement
- [ ] QR code s'affiche

---

### 2. **Page de Login (login.js)**

#### **Tests Visuels**
- [ ] SafeAreaView : pas de chevauchement avec la barre de statut
- [ ] Box de connexion centrée verticalement
- [ ] Box responsive (adapte sa largeur à l'écran)
- [ ] Gradient de fond visible
- [ ] Inputs bien espacés
- [ ] Bouton "Se connecter" bien visible

#### **Tests Fonctionnels**
- [ ] Clavier apparaît quand on tape dans un input
- [ ] KeyboardAvoidingView : clavier ne cache pas les inputs
- [ ] ScrollView : on peut scroller si clavier prend de la place
- [ ] trim() fonctionne : pas d'erreur avec espaces
- [ ] Connexion réussie avec identifiants valides
- [ ] Message d'erreur si identifiants invalides

#### **Tests Responsive**
- [ ] **iPhone SE (375px)** : Tout est lisible, rien ne dépasse
- [ ] **iPhone 14 (390px)** : Proportionnel et bien espacé
- [ ] **iPad (768px)** : Box ne prend pas toute la largeur (max 400px)
- [ ] **Rotation** : Layout reste correct en paysage

---

### 3. **Page Index (index.js)**

#### **Tests Visuels**
- [ ] SafeAreaView : pas de chevauchement
- [ ] Loader centré pendant le chargement
- [ ] Couleur du loader = bleu (#2563eb)

#### **Tests Fonctionnels**
- [ ] Redirection automatique vers /login si non connecté
- [ ] Redirection automatique vers page selon rôle si connecté
- [ ] Pas de boucle infinie de redirections

---

### 4. **Page Élève (eleve.js)**

#### **Tests Visuels**
- [ ] SafeAreaView : pas de chevauchement
- [ ] Header bien formaté avec titre et sous-titre
- [ ] Username affiché avec icône 👤
- [ ] Cards bien espacées (gap: SPACING.md)
- [ ] ScrollView : tout le contenu est accessible
- [ ] Bouton déconnexion visible en bas

#### **Tests Fonctionnels**
- [ ] Affichage correct pour rôle "élève"
- [ ] Affichage correct pour rôle "admin" (vue gestion)
- [ ] Bouton déconnexion fonctionne
- [ ] Redirection vers /login après déconnexion

#### **Tests Responsive**
- [ ] **Petit écran** : Cards empilées, lisibles
- [ ] **Grand écran** : Cards espacées, proportionnelles
- [ ] **ScrollView** : On peut scroller si contenu dépasse

---

### 5. **Page Moniteur (moniteur.js)**

#### **Tests Visuels**
- [ ] Identique à Page Élève
- [ ] Vue admin : titre "Gestion des Moniteurs"
- [ ] Vue moniteur : titre "Mon Espace Moniteur"

#### **Tests Fonctionnels**
- [ ] Vue admin affichée seulement pour admin
- [ ] Vue moniteur affichée pour moniteurs
- [ ] Bouton déconnexion fonctionne

#### **Tests Responsive**
- [ ] Identique à Page Élève

---

### 6. **Page Admin (admin.js)**

#### **Tests Visuels**
- [ ] SafeAreaView : pas de chevauchement
- [ ] Gradient violet visible (#667eea → #764ba2)
- [ ] Header admin avec titre et username
- [ ] Navigation rapide : 2 cards côte à côte
- [ ] Métriques : 3 valeurs alignées horizontalement
- [ ] Liste utilisateurs en ligne visible
- [ ] Terminal des messages visible avec en-tête
- [ ] Bouton déconnexion en bas

#### **Tests Fonctionnels**
- [ ] Socket.io se connecte au backend
- [ ] Liste des utilisateurs en ligne s'affiche
- [ ] Messages temps réel s'affichent dans le terminal
- [ ] Auto-scroll des messages fonctionne
- [ ] Compteur msg/sec s'actualise
- [ ] Boutons navigation vers /moniteur et /eleve fonctionnent
- [ ] Bouton déconnexion fonctionne

#### **Tests Responsive**
- [ ] **Petit écran** : Tout est accessible via scroll
- [ ] **Grand écran** : Espacements proportionnels
- [ ] **FlatList** : Listes performantes (pas de lag)
- [ ] **Terminal** : Messages lisibles sur tous écrans

---

### 7. **Composants (PageHeader, Card)**

#### **PageHeader.js**
- [ ] Utilise constantes FONT_SIZES, SPACING, COLORS
- [ ] Titre et sous-titre bien espacés
- [ ] Bordure inférieure visible

#### **Card.js**
- [ ] Utilise constantes SHADOWS, BORDER_RADIUS
- [ ] Valeur colorée selon prop `color`
- [ ] Hint en italique et gris clair

---

### 8. **Constantes (constants/styles.js)**

#### **Vérifications**
- [ ] Fichier existe
- [ ] `responsiveSize()` fonctionne correctement
- [ ] `SPACING` a toutes les valeurs (xs, sm, md, lg, xl, xxl)
- [ ] `FONT_SIZES` a toutes les valeurs (xs → xxxl)
- [ ] `COLORS` définit toutes les couleurs
- [ ] `SHADOWS` a small, medium, large
- [ ] `BORDER_RADIUS` a sm, md, lg, xl

---

## 📊 Résultats des Tests

### ✅ Tests Réussis
- [ ] Tous les tests visuels OK
- [ ] Tous les tests fonctionnels OK
- [ ] Tous les tests responsive OK
- [ ] Pas d'erreurs dans la console
- [ ] Performance fluide (pas de lag)

### ❌ Problèmes Détectés
_(À remplir si des problèmes sont trouvés)_

---

## 🎯 Scores Attendus

### **Performances**
- Temps de lancement : < 3 secondes
- Scroll fluide : 60 FPS
- Connexion Socket.io : < 1 seconde

### **Compatibilité**
- ✅ iOS 12+
- ✅ Android 8+
- ✅ Écrans 375px → 1024px+

### **Accessibilité**
- ✅ Zones tactiles ≥ 50px de hauteur
- ✅ Contraste texte suffisant
- ✅ Pas de texte coupé

---

## 🔧 Commandes de Test

### **Mode Développement**
```bash
npm start
```

### **Test iOS**
```bash
npm run ios
```

### **Test Android**
```bash
npm run android
```

### **Clear Cache**
```bash
expo start -c
```

### **Rebuild**
```bash
rm -rf node_modules
npm install
expo start -c
```

---

## 📝 Notes

- Tester sur plusieurs tailles d'écran (iPhone SE, iPhone 14, iPad)
- Tester en mode portrait ET paysage
- Vérifier les transitions entre pages
- Vérifier la déconnexion fonctionne partout
- Vérifier que Socket.io se reconnecte en cas de perte réseau

---

**Tests à effectuer avant déploiement ! ✅**
