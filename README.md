# 🚀 Simple App Demo - PWA

Une application web progressive (PWA) de démonstration inspirée du design de TOM, créée pour apprendre le processus de développement et déploiement PWA avec GitHub et PWABuilder.

![Simple App Demo](https://img.shields.io/badge/PWA-Ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📱 Aperçu

Simple App Demo est une PWA complète qui démontre :
- ✅ Interface moderne inspirée du design TOM
- ✅ Mode hors ligne complet
- ✅ Installation sur tous les appareils
- ✅ Navigation multi-pages
- ✅ Stockage local avec IndexedDB
- ✅ Notifications et popup interactifs

## 🎯 Fonctionnalités

### Page d'accueil (`index.html`)
- **Menu déroulant** avec 4 options (données, paramètres, aide, à propos)
- **Popup informatif** avec contenu dynamique selon la sélection
- **Statut PWA** en temps réel (installation, connexion)
- **Bouton d'installation** automatique
- **Navigation** vers la page 2

### Page 2 (`page2.html`)
- **Statistiques animées** avec compteurs dynamiques
- **Formulaire utilisateur** avec sauvegarde IndexedDB
- **Log d'activité** en temps réel
- **Popup de confirmation** réutilisable
- **Navigation** de retour

### Fonctionnalités PWA
- **Service Worker** avec stratégies de cache optimisées
- **Mode hors ligne** avec pages de fallback stylées
- **Installation** sur iOS, Android, Windows, macOS
- **Icônes** complètes pour tous les appareils
- **Manifest** PWA standard

## 📁 Structure du projet

```
simple-app-pwa/
├── index.html              # Page d'accueil principale
├── page2.html              # Page secondaire avec fonctionnalités
├── styles.css              # Styles inspirés de TOM
├── script.js               # JavaScript principal
├── sw.js                   # Service Worker
├── manifest.json           # Manifeste PWA
├── icon-base.svg           # Icône vectorielle de base
├── generate-icons.html     # Générateur d'icônes
├── icons/                  # Dossier des icônes PNG
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md               # Documentation (ce fichier)
```

## 🛠️ Installation et utilisation

### 1. Cloner le projet
```bash
git clone https://github.com/VOTRE-USERNAME/simple-app-pwa.git
cd simple-app-pwa
```

### 2. Générer les icônes
1. Ouvrir `generate-icons.html` dans votre navigateur
2. Cliquer sur "📦 Télécharger toutes les icônes"
3. Créer un dossier `icons/` à la racine
4. Y placer tous les fichiers PNG téléchargés

### 3. Tester localement
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (npx)
npx http-server

# Avec PHP
php -S localhost:8000
```

### 4. Ouvrir dans le navigateur
- Accéder à `http://localhost:8000`
- Tester les fonctionnalités PWA
- Vérifier l'installation sur mobile

## 🌐 Déploiement sur GitHub Pages

### 1. Créer un repository GitHub
```bash
# Initialiser git
git init
git add .
git commit -m "Initial commit - Simple App PWA"

# Ajouter l'origine remote
git remote add origin https://github.com/VOTRE-USERNAME/simple-app-pwa.git
git push -u origin main
```

### 2. Activer GitHub Pages
1. Aller dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** / **(root)**
4. Cliquer **Save**

### 3. Accéder à votre PWA
- URL : `https://VOTRE-USERNAME.github.io/simple-app-pwa/`
- Attendre 5-10 minutes pour la propagation
- Tester l'installation PWA

## 📦 Soumission à PWABuilder

### 1. Accéder à PWABuilder
- Aller sur [https://www.pwabuilder.com](https://www.pwabuilder.com)
- Entrer l'URL de votre GitHub Pages : `https://VOTRE-USERNAME.github.io/simple-app-pwa/`

### 2. Analyse automatique
PWABuilder analysera automatiquement :
- ✅ Manifeste PWA
- ✅ Service Worker  
- ✅ Icônes
- ✅ HTTPS
- ✅ Responsive design

### 3. Génération des packages
- **Android** : Fichier APK pour Google Play Store
- **iOS** : Package pour App Store Connect
- **Windows** : MSIX pour Microsoft Store
- **macOS** : Package pour Mac App Store

### 4. Télécharger et publier
1. Télécharger les packages générés
2. Suivre les guides de publication pour chaque store
3. Soumettre votre PWA aux différents stores d'applications

## 🎨 Personnalisation

### Couleurs (dans `styles.css`)
```css
:root {
    --orange: #F2A021;      /* Couleur principale */
    --yellow: #EBCC00;      /* Accent jaune */
    --teal: #2EAB9B;        /* Validation */
    --red: #CB0000;         /* Erreurs */
    --blue: #267C99;        /* Actions */
}
```

### Icônes
1. Modifier `icon-base.svg` avec votre design
2. Utiliser `generate-icons.html` pour générer les PNG
3. Remplacer les fichiers dans le dossier `icons/`

### Contenu
- **Textes** : Modifier directement dans les fichiers HTML
- **Fonctionnalités** : Ajouter dans `script.js`
- **Styles** : Personnaliser dans `styles.css`

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Variables CSS, Grid, Flexbox
- **JavaScript ES6+** : Classes, Promises, IndexedDB
- **Service Worker** : Cache et mode hors ligne
- **Web App Manifest** : Configuration PWA
- **IndexedDB** : Stockage local persistant

## 📊 Fonctionnalités techniques

### Service Worker (`sw.js`)
- **Cache statique** : HTML, CSS, JS, icônes
- **Cache dynamique** : Ressources à la demande
- **Stratégies** : Network First + Cache First
- **Mode hors ligne** : Pages de fallback

### IndexedDB (`script.js`)
- **Base de données** : SimpleAppDB
- **Store** : preferences
- **Données** : Préférences utilisateur, historique

### Responsive Design
- **Mobile First** : Design optimisé mobile
- **Breakpoints** : 768px pour tablette/desktop
- **Flexbox/Grid** : Layouts adaptatifs

## 🐛 Dépannage

### PWA ne s'installe pas
- Vérifier HTTPS (obligatoire)
- Contrôler le manifeste avec les DevTools
- Tester le Service Worker dans l'onglet Application

### Icônes manquantes
- Générer les icônes avec `generate-icons.html`
- Vérifier les chemins dans `manifest.json`
- Tester différentes tailles d'écran

### Mode hors ligne
- Vérifier le Service Worker dans DevTools
- Tester la déconnexion réseau
- Contrôler les caches dans Application → Storage

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation PWA officielle
- Tester avec les DevTools du navigateur

---

**Simple App Demo** - Une PWA complète pour apprendre le développement moderne ! 🚀