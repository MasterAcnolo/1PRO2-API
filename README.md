# Task Loader API

API REST construite avec **Strapi v5** pour gérer des tableaux Kanban (boards, colonnes, cartes) avec authentification et gestion des permissions.

## Description

Cette API permet de créer et gérer des tableaux de type Kanban avec une hiérarchie complète :
- **Users** : Utilisateurs authentifiés
- **Boards** : Tableaux appartenant à un utilisateur
- **Columns** : Colonnes à l'intérieur d'un tableau
- **Cards** : Cartes organisées dans les colonnes
- **Labels** : Étiquettes pour catégoriser les cartes

## Architecture

```
User (1) ──< (N) Board (1) ──< (N) Column (1) ──< (N) Card
                                                         │
                                                   Label (M──<N)
```

### Hiérarchie des données
- Un **utilisateur** peut avoir plusieurs **boards**
- Un **board** contient plusieurs **columns**
- Une **column** contient plusieurs **cards**
- Les **cards** peuvent être associées à des **labels**

### Sécurité et permissions
- **Authentification requise** pour toutes les opérations (sauf login/register)
- **Middleware is-owner** : Vérifie que l'utilisateur est propriétaire de la ressource
- **Cascade delete** : Suppression automatique des ressources enfants

## Démarrage rapide

### Prérequis
- Node.js >= 20.0.0
- MySQL 8.x
- npm >= 6.0.0

### Installation

```bash
# Cloner le repository
git clone <repository-url>

# Installer les dépendances
npm install

# Configurer la base de données
# Éditer le fichier config/database.js avec vos credentials MySQL
```

### Commandes disponibles

```bash
# Lancer en mode développement (avec auto-reload)
npm run dev

# Lancer en mode production
npm run start

# Build du panel admin
npm run build

# Mettre à jour Strapi
npm run upgrade
```

## API Endpoints

### Authentication
```
POST   /api/auth/local/register    # Créer un compte
POST   /api/auth/local             # Se connecter
```

### Boards
```
GET    /api/boards                 # Liste des boards de l'utilisateur
GET    /api/boards/:id             # Détails d'un board (+ owner check)
POST   /api/boards                 # Créer un board
PUT    /api/boards/:id             # Modifier un board (+ owner check)
DELETE /api/boards/:id             # Supprimer un board (+ owner check)
```

### Columns
```
GET    /api/columns                # Liste des colonnes
GET    /api/columns/:id            # Détails d'une colonne (+ owner check)
POST   /api/columns                # Créer une colonne
PUT    /api/columns/:id            # Modifier une colonne (+ owner check)
DELETE /api/columns/:id            # Supprimer une colonne (+ owner check)
```

### Cards
```
GET    /api/cards                  # Liste des cartes
GET    /api/cards/:id              # Détails d'une carte (+ owner check)
POST   /api/cards                  # Créer une carte
PUT    /api/cards/:id              # Modifier une carte (+ owner check)
DELETE /api/cards/:id              # Supprimer une carte (+ owner check)
```

### Labels
```
GET    /api/labels                 # Liste des labels
GET    /api/labels/:id             # Détails d'un label
POST   /api/labels                 # Créer un label
PUT    /api/labels/:id             # Modifier un label
DELETE /api/labels/:id             # Supprimer un label
```

## Exemple d'utilisation

### 1. S'inscrire
```bash
POST /api/auth/local/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "MySecurePassword123"
}
```

### 2. Créer un board
```bash
POST /api/boards
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "data": {
    "name": "Mon projet"
  }
}
```

### 3. Créer une colonne
```bash
POST /api/columns
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "data": {
    "name": "À faire",
    "order": 1,
    "board_id": "board-document-id"
  }
}
```

### 4. Créer une carte
```bash
POST /api/cards
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "data": {
    "name": "Implémenter la feature X",
    "description": "Description détaillée",
    "order": 1,
    "color": "FF5733",
    "column": "column-document-id"
  }
}
```

## Fonctionnalités avancées

### Cascade Delete automatique
Lors de la suppression :
- **User** → Supprime tous ses boards (+ columns + cards)
- **Board** → Supprime toutes ses columns (+ cards)
- **Column** → Supprime toutes ses cards

### Middlewares is-owner
Protègent les routes sensibles en vérifiant que :
- L'utilisateur est authentifié
- L'utilisateur est propriétaire de la ressource (directement ou indirectement)

### Filtre automatique des boards
Le controller `board.find()` filtre automatiquement pour ne retourner que les boards de l'utilisateur connecté.

## Structure du projet

```
src/
├── api/
│   ├── board/
│   │   ├── content-types/board/
│   │   │   ├── schema.json          # Schéma du Board
│   │   │   └── lifecycles.js        # Cascade delete
│   │   ├── controllers/board.js     # Logique métier
│   │   ├── middlewares/is-owner.js  # Vérification propriété
│   │   ├── routes/board.js          # Routes protégées
│   │   └── services/board.js        # Service custom
│   ├── column/                      # Idem pour Column
│   ├── card/                        # Idem pour Card
│   ├── label/                       # Idem pour Label
│   └── utils/
│       ├── helpers.js               # Fonctions utilitaires
│       ├── middleware-factory.js    # Factory middlewares
│       └── README.md                # Documentation utils
├── extensions/
│   └── users-permissions/
│       └── strapi-server.js         # Extension User + cascade delete
└── index.js
```

## Configuration

### Base de données (MySQL)
Éditer `config/database.js` :
```javascript
connection: {
  host: env('DATABASE_HOST', '127.0.0.1'),
  port: env.int('DATABASE_PORT', 3306),
  database: env('DATABASE_NAME', 'task_loader'),
  user: env('DATABASE_USERNAME', 'root'),
  password: env('DATABASE_PASSWORD', ''),
}
```

### Variables d'environnement
Créer un fichier `.env` :
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
JWT_SECRET=your-jwt-secret
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=task_loader
DATABASE_USERNAME=root
DATABASE_PASSWORD=your-password
```

## Technologies utilisées

- **[Strapi v5.33.1](https://strapi.io)** - Headless CMS
- **[MySQL 3.9.8](https://www.mysql.com/)** - Base de données
- **Node.js 20+** - Runtime JavaScript
- **JWT** - Authentification

## Déploiement

Pour déployer sur Strapi Cloud :
```bash
npm run deploy
```

Autres options de déploiement : [Strapi Deployment Docs](https://docs.strapi.io/dev-docs/deployment)

## Documentation

- [Documentation Strapi](https://docs.strapi.io)
- [Documentation des utilitaires](src/api/utils/README.md)
- [API Reference](https://docs.strapi.io/dev-docs/api/rest)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## License

Voir le fichier [license.txt](license.txt)

---

**Astuce** : Utilisez le panel admin Strapi à `http://localhost:1337/admin` pour gérer visuellement vos contenus.
