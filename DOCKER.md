# 🐳 Configuration Docker pour PostgreSQL

Ce projet utilise Docker pour faciliter le démarrage de PostgreSQL en développement.

## 🚀 Démarrage rapide

### 1. Démarrer PostgreSQL avec Docker

```bash
docker-compose up -d
```

Cette commande va :
- Télécharger l'image PostgreSQL 15 (si nécessaire)
- Créer un conteneur nommé `accessuniversity-postgres`
- Démarrer PostgreSQL sur le port 5432
- Créer un volume persistant pour les données

### 2. Vérifier que PostgreSQL est démarré

```bash
docker ps | grep accessuniversity-postgres
```

Vous devriez voir le conteneur avec le statut "Up" et "(healthy)".

### 3. Initialiser la base de données

```bash
# Créer les tables
npm run db:push

# Générer le client Prisma
npm run db:generate

# Peupler avec des données de test (optionnel)
npm run db:seed
```

### 4. Démarrer les serveurs

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📋 Commandes utiles

### Arrêter PostgreSQL
```bash
docker-compose down
```

### Arrêter et supprimer les données
```bash
docker-compose down -v
```

### Voir les logs PostgreSQL
```bash
docker-compose logs postgres
```

### Accéder à la base de données directement
```bash
docker exec -it accessuniversity-postgres psql -U postgres -d accessuniversity
```

### Redémarrer PostgreSQL
```bash
docker-compose restart postgres
```

## ⚙️ Configuration

Le fichier `docker-compose.yml` configure :
- **Utilisateur**: `postgres`
- **Mot de passe**: `postgres`
- **Base de données**: `accessuniversity`
- **Port**: `5432`

Ces identifiants doivent correspondre à votre `DATABASE_URL` dans le fichier `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/accessuniversity?schema=public"
```

## 🔧 Dépannage

### Le conteneur ne démarre pas
```bash
docker-compose logs postgres
```

### Le port 5432 est déjà utilisé
Modifiez le port dans `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Utilisez 5433 au lieu de 5432
```

Puis mettez à jour votre `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/accessuniversity?schema=public"
```

### Réinitialiser complètement la base de données
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
npm run db:seed
```

## 📝 Notes

- Les données sont persistantes grâce au volume Docker `postgres_data`
- Le conteneur redémarre automatiquement sauf si vous l'arrêtez manuellement
- Pour la production, utilisez une base de données gérée (Supabase, Neon, Railway, etc.)







