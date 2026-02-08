# AccèsUniversity - MVP

Plateforme d'accompagnement pour aider les étudiants à trouver leur école idéale.

## 🚀 Stack Technique

- **Front-end**: Next.js 14 + TailwindCSS
- **Back-end**: Node.js + Express
- **Base de données**: PostgreSQL via Prisma
- **Authentification**: JWT
- **Paiement**: Stripe
- **Hébergement**: Vercel (front) + Render/OVH (API + DB)

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/accessuniversity?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# API
API_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PORT=3001
```

### 3. Configuration de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer la base de données et appliquer les migrations
npm run db:push

# (Optionnel) Seed la base de données avec des données de démo
npm run db:seed
```

### 4. Lancer l'application

**Terminal 1 - Front-end (Next.js)**
```bash
npm run dev
```
Le front-end sera accessible sur http://localhost:3000

**Terminal 2 - Back-end (Express)**
```bash
npm run server:dev
```
L'API sera accessible sur http://localhost:3001

## 👤 Comptes de démo

Après avoir exécuté le seed :

- **Admin**: 
  - Email: `admin@accessuniversity.com`
  - Password: `admin123`

- **Étudiant**: 
  - Email: `student@example.com`
  - Password: `student123`

## 📁 Structure du projet

```
AccessUniversity/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/          # Dashboards étudiant/admin
│   ├── ecoles/             # Pages écoles
│   ├── login/              # Page de connexion
│   ├── register/           # Page d'inscription
│   ├── orientation/        # Formulaire d'orientation
│   ├── paiement/           # Page de paiement Stripe
│   ├── faq/                # FAQ
│   └── contact/            # Contact
├── server/                 # API Express
│   ├── routes/             # Routes API
│   ├── middleware/         # Middlewares (auth, etc.)
│   └── index.js            # Point d'entrée serveur
├── prisma/                 # Prisma
│   ├── schema.prisma       # Schéma de base de données
│   └── seed.js             # Script de seed
├── uploads/                # Fichiers uploadés (créé automatiquement)
└── public/                 # Assets statiques
```

## 🔑 Fonctionnalités

### Authentification
- Inscription/Connexion avec JWT
- Protection des routes API
- Gestion des rôles (student/admin)

### Orientation
- Formulaire multi-étapes
- Calcul de score basique
- Recommandations d'écoles personnalisées

### Écoles
- Liste des écoles partenaires
- Fiches détaillées par école
- Recherche et filtres

### Paiement
- Intégration Stripe
- Forfait unique 600€
- Mise à jour automatique du statut premium

### Dashboard Étudiant
- Vue d'ensemble du profil
- Recommandations personnalisées
- Upload de documents (premium)
- Suivi de dossier

### Dashboard Admin
- Statistiques globales
- Gestion des étudiants
- Gestion des écoles
- Historique des paiements

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Tokens JWT avec expiration
- Validation des entrées
- Protection CORS
- Middleware d'authentification

## 🚢 Déploiement

### Front-end (Vercel)

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez

### Back-end (Render/OVH)

1. Créez une instance PostgreSQL
2. Déployez l'API Express
3. Configurez les variables d'environnement
4. Configurez le webhook Stripe

### Variables d'environnement de production

Assurez-vous de configurer :
- `DATABASE_URL` (production)
- `JWT_SECRET` (fort et unique)
- `STRIPE_SECRET_KEY` (clé de production)
- `STRIPE_WEBHOOK_SECRET`
- URLs de production pour `API_URL` et `NEXT_PUBLIC_APP_URL`

## 📝 Notes

- Les fichiers uploadés sont stockés localement dans `/uploads`
- Pour la production, considérez l'utilisation de S3 ou un service similaire
- Le webhook Stripe doit être configuré pour mettre à jour automatiquement le statut premium
- Les migrations Prisma doivent être exécutées en production

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez la `DATABASE_URL` dans `.env`

### Erreur Stripe
- Vérifiez vos clés API Stripe
- Assurez-vous que le webhook est configuré correctement

### Erreur d'authentification
- Vérifiez que `JWT_SECRET` est défini
- Vérifiez que le token est envoyé dans les headers

## 📄 Licence

Propriétaire - AccèsUniversity








