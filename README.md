# Urbex Chronicles

Une application web progressive dédiée à l'exploration urbaine interactive avec des circuits géolocalisés, des missions et des défis.

## Démos et liens

- **Application déployée** : https://urbex-chronicles.netlify.app/
- **Documentation API** : https://urbex-chronicles-api-main-iijawu.laravel.cloud/
- **CMS Admin** : https://tubular-stroopwafel-1c150b.netlify.app/

## Description

Urbex Chronicles est une plateforme interactive qui transforme l'exploration urbaine en aventure gamifiée. Les utilisateurs peuvent participer à des circuits d'exploration géolocalisés, résoudre des énigmes et défis sur le terrain, et suivre leur progression à travers un système de récompenses.

### Fonctionnalités principales

- **Circuits d'exploration** : Parcours géolocalisés avec missions interactives
- **Géolocalisation** : Missions basées sur la position réelle de l'utilisateur
- **Questions et énigmes** : Défis variés (QCM, énigmes, QR codes, vues 360°)
- **Système de progression** : Récompenses, achievements et classements
- **Interface responsive** : Optimisée pour mobile et desktop
- **Mode PWA** : Installation possible comme application mobile

## Technologies

- **Frontend** : Vue.js 3, Vue Router, Pinia
- **Styling** : Tailwind CSS, Sass
- **Cartes** : Leaflet
- **Build** : Vite
- **PWA** : Service Workers, manifeste d'application

## Installation et développement

### Prérequis

- Node.js 20.19+ ou 22.12+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd urbex-chronicles-vue

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Linter le code
npm run format   # Formater le code
```

## Structure du projet

```
src/
├── components/
│   ├── layout/     # Header, Footer, Navigation
│   └── ui/         # Composants d'interface
├── views/          # Pages principales
├── stores/         # Gestion d'état (Pinia)
├── services/       # Services API
├── router/         # Configuration des routes
├── assets/         # Styles et ressources
└── utils/          # Fonctions utilitaires
```

## Configuration

L'application se connecte à une API Laravel pour :

- Authentification utilisateur
- Gestion des circuits et missions
- Géolocalisation et validation des positions
- Système de scoring et achievements

Voir `API_ROUTES.md` pour la documentation complète de l'API.

## Déploiement

L'application est configurée pour le déploiement sur Netlify avec :

- Build automatique depuis Git
- Support PWA
- Redirections SPA configurées

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committer les changes (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Pusher la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request
