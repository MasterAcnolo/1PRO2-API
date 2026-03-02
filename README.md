<div align="center">

# Task Loader API

[![Strapi](https://img.shields.io/badge/Strapi-v5.33.1-2F2E8B?style=for-the-badge&logo=strapi&logoColor=white)](https://strapi.io)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)

**API REST pour la gestion de tableaux Kanban avec authentification et permissions avancées, Partie Back End du Projet [Task Loader](https://github.com/MasterAcnolo/1PRO2-Client)**

[Installation](#installation) •
[API Endpoints](#api-endpoints) •
[Configuration](#configuration)

</div>

---

## Description

Task Loader API est une API REST construite avec **Strapi v5** permettant de créer et gérer des tableaux de type Kanban. Elle offre une gestion complète des utilisateurs, boards, colonnes et cartes avec un système de permissions sécurisé.

### Fonctionnalités principales

| Fonctionnalité | Description |
|----------------|-------------|
| **Authentification JWT** | Inscription, connexion et gestion des sessions sécurisées |
| **Gestion des utilisateurs** | Profils utilisateurs avec ownership des ressources |
| **Boards** | Création et gestion de tableaux Kanban |
| **Colonnes** | Organisation des tâches par colonnes ordonnées |
| **Cartes** | Tâches avec description, couleur et ordre personnalisable |
| **Middleware is-owner** | Protection des ressources par vérification de propriété |
| **Cascade Delete** | Suppression automatique des ressources enfants |

---

## Installation

### Prérequis

- **Node.js** >= 20.0.0
- **MySQL** 8.x
- **npm** >= 6.0.0

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/MasterAcnolo/1PRO2-API
cd 1PRO2-API

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres

# 4. Lancer en mode développement
npm run dev
```

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer en mode développement (hot-reload) |
| `npm run start` | Lancer en mode production |
| `npm run build` | Build du panel admin |
| `npm run upgrade` | Mettre à jour Strapi |

---

## API Endpoints

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/local/register` | Créer un compte |
| `POST` | `/api/auth/local` | Se connecter |

### Boards

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/boards` | Liste des boards de l'utilisateur | ✅ |
| `GET` | `/api/boards/:id` | Détails d'un board | ✅ + Owner |
| `POST` | `/api/boards` | Créer un board | ✅ |
| `PUT` | `/api/boards/:id` | Modifier un board | ✅ + Owner |
| `DELETE` | `/api/boards/:id` | Supprimer un board | ✅ + Owner |

### Columns

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/columns` | Liste des colonnes | ✅ |
| `GET` | `/api/columns/:id` | Détails d'une colonne | ✅ + Owner |
| `POST` | `/api/columns` | Créer une colonne | ✅ |
| `PUT` | `/api/columns/:id` | Modifier une colonne | ✅ + Owner |
| `DELETE` | `/api/columns/:id` | Supprimer une colonne | ✅ + Owner |

### Cards

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/cards` | Liste des cartes | ✅ |
| `GET` | `/api/cards/:id` | Détails d'une carte | ✅ + Owner |
| `POST` | `/api/cards` | Créer une carte | ✅ |
| `PUT` | `/api/cards/:id` | Modifier une carte | ✅ + Owner |
| `DELETE` | `/api/cards/:id` | Supprimer une carte | ✅ + Owner |

---

## Exemples d'utilisation

### 1. Inscription

```bash
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "MySecurePassword123"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "MySecurePassword123"
  }'
```

### 3. Créer un board

```bash
curl -X POST http://localhost:1337/api/boards \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Mon projet"
    }
  }'
```

### 4. Créer une colonne

```bash
curl -X POST http://localhost:1337/api/columns \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "À faire",
      "order": 1,
      "board_id": "board-document-id"
    }
  }'
```

### 5. Créer une carte

```bash
curl -X POST http://localhost:1337/api/cards \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Implémenter la feature X",
      "description": "Description détaillée de la tâche",
      "order": 1,
      "color": "FF5733",
      "column": "column-document-id"
    }
  }'
```

---

## Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Server
HOST=0.0.0.0
PORT=1337

# Security
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

# Database
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=task_loader
DATABASE_USERNAME=root
DATABASE_PASSWORD=your-password
```

### Configuration de la base de données

Le fichier `config/database.js` utilise les variables d'environnement :

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'mysql2',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'task_loader'),
      user: env('DATABASE_USERNAME', 'root'),
      password: env('DATABASE_PASSWORD', ''),
    },
  },
});
```

---

## Structure du projet

```
task-loader-api/
├── config/
│   ├── admin.js           # Configuration admin
│   ├── api.js             # Configuration API
│   ├── database.js        # Configuration BDD
│   ├── middlewares.js     # Middlewares globaux
│   ├── plugins.js         # Configuration plugins
│   └── server.js          # Configuration serveur
├── src/
│   ├── api/
│   │   ├── board/
│   │   │   ├── content-types/board/
│   │   │   │   ├── schema.json       # Schéma du Board
│   │   │   │   └── lifecycles.js     # Cascade delete
│   │   │   ├── controllers/          # Logique métier
│   │   │   ├── middlewares/          # Middleware is-owner
│   │   │   ├── routes/               # Définition des routes
│   │   │   └── services/             # Services custom
│   │   ├── column/                   # API Column
│   │   ├── card/                     # API Card
│   │   └── utils/
│   │       ├── helpers.js            # Fonctions utilitaires
│   │       └── middleware-factory.js # Factory middlewares
│   └── extensions/
│       └── users-permissions/
│           └── strapi-server.js      # Extension User
├── public/                           # Fichiers statiques
├── database/migrations/              # Migrations BDD
└── types/generated/                  # Types TypeScript générés
```

---

## Sécurité

### Middlewares de protection

| Middleware | Description |
|------------|-------------|
| **is-owner** | Vérifie que l'utilisateur est propriétaire de la ressource |
| **JWT Auth** | Authentification par token JWT |

### Cascade Delete

La suppression en cascade est gérée automatiquement :

```
User supprimé -> Boards supprimés -> Columns supprimées -> Cards supprimées
```

---

## Technologies

| Technologie | Version | Usage |
|-------------|---------|-------|
| [Strapi](https://strapi.io) | v5.33.1 | Headless CMS / Backend |
| [Node.js](https://nodejs.org) | 20+ | Runtime JavaScript |
| [MySQL](https://mysql.com) | 8.x | Base de données |
| [JWT](https://jwt.io) | - | Authentification |

---