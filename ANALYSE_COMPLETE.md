# 📋 Analyse Complète - AccèsUniversity

**Date de création** : 14 janvier 2026  
**Version** : 1.0.0

Ce document présente une analyse approfondie du projet AccèsUniversity :
- 🔴 Erreurs techniques (Backend & Frontend)
- 🟡 Incohérences dans les User Stories
- 🟢 Propositions d'améliorations et nouvelles fonctionnalités

---

## 🔴 ERREURS TECHNIQUES

### 1. Backend - Erreurs Critiques

#### 1.1 ❌ Stockage JWT dans localStorage (VULNÉRABILITÉ XSS)
**Fichiers concernés** : `app/login/page.tsx`, `app/register/page.tsx`, tous les composants dashboard

```javascript
// ❌ PROBLÉMATIQUE - Vulnérable aux attaques XSS
localStorage.setItem('token', data.token)
localStorage.setItem('user', JSON.stringify(data.user))
```

**Problème** : Les tokens JWT stockés en `localStorage` sont accessibles par n'importe quel script JavaScript, rendant l'application vulnérable aux attaques XSS.

**Solution** : Utiliser des cookies `httpOnly` avec `sameSite: 'strict'` et `secure: true`.

---

#### 1.2 ❌ Pas de Rate Limiting sur l'authentification
**Fichier** : `server/routes/auth.js`

**Problème** : Un attaquant peut tenter des milliers de connexions par seconde (brute force).

**Solution** :
```javascript
const rateLimit = require('express-rate-limit')
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives, réessayez dans 15 minutes'
})
router.post('/login', authLimiter, async (req, res) => { ... })
```

---

#### 1.3 ❌ Pas de transactions Prisma sur les opérations critiques
**Fichier** : `server/routes/orientation.js` (lignes 73-102)

```javascript
// ❌ PROBLÉMATIQUE - Opérations non atomiques
orientationResponse = await prisma.orientationResponse.create({ ... })
const savedRecommendations = await Promise.all(
  schools.map((school) => prisma.recommendation.create({ ... }))
)
```

**Problème** : Si la création des recommandations échoue, l'orientation est quand même sauvegardée = données incohérentes.

**Solution** :
```javascript
const result = await prisma.$transaction(async (tx) => {
  const orientation = await tx.orientationResponse.create({ ... })
  const recommendations = await Promise.all(
    schools.map((school) => tx.recommendation.create({ ... }))
  )
  return { orientation, recommendations }
})
```

---

#### 1.4 ❌ Score de recommandation aléatoire
**Fichier** : `server/routes/orientation.js` (ligne 91)

```javascript
// ❌ Le score contient une partie aléatoire !
score: score + Math.floor(Math.random() * 20)
```

**Problème** : Le score de recommandation inclut une valeur aléatoire (0-20), ce qui n'a aucun sens pour un système d'orientation "personnalisé".

**Solution** : Implémenter un vrai algorithme de matching basé sur :
- Correspondance niveau d'études ↔ formations proposées
- Correspondance objectifs ↔ débouchés de l'école
- Budget étudiant ↔ frais de scolarité

---

#### 1.5 ❌ Webhook Stripe sans re-vérification du montant
**Fichier** : `server/routes/payment.js` (lignes 52-76)

```javascript
// ❌ On fait confiance au montant envoyé par Stripe sans vérifier
await prisma.payment.create({
  data: {
    amount: paymentIntent.amount / 100,
    // ...
  },
})
await prisma.user.update({
  where: { id: paymentIntent.metadata.userId },
  data: { isPremium: true },
})
```

**Problème** : Pas de vérification que le montant payé correspond au forfait Premium (600€). Un utilisateur malveillant pourrait théoriquement modifier le montant.

**Solution** : Vérifier que `paymentIntent.amount === 60000` (600€ en centimes) avant d'activer le premium.

---

#### 1.6 ❌ Pas de validation Zod côté serveur
**Fichiers** : Toutes les routes dans `server/routes/`

**Problème** : Zod est installé (`package.json` ligne 34) mais jamais utilisé. La validation est basique.

**Solution** :
```javascript
const { z } = require('zod')

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().optional()
})
```

---

### 2. Frontend - Erreurs Techniques

#### 2.1 ❌ Types TypeScript incorrects (`any` partout)
**Fichiers** : 10+ fichiers avec 20+ occurrences de `any`

```typescript
// ❌ Exemples problématiques
const [recommendations, setRecommendations] = useState<any[]>([])  // orientation/page.tsx:41
} catch (err: any) {  // Partout
```

**Solution** : Créer un fichier `types/index.ts` avec toutes les interfaces.

---

#### 2.2 ❌ Vérification d'authentification côté client uniquement
**Fichier** : `app/dashboard/layout.tsx`

**Problème** : La protection des routes dashboard se fait uniquement côté client. Un utilisateur peut accéder aux données en modifiant le localStorage.

**Solution** : Implémenter un middleware Next.js pour vérifier le token côté serveur.

---

#### 2.3 ❌ Données utilisateur non synchronisées
**Fichier** : `app/paiement/page.tsx` (lignes 201-214)

```javascript
// ❌ On lit le statut premium depuis localStorage
const userStr = localStorage.getItem('user')
if (userStr) {
  const user = JSON.parse(userStr)
  if (user.isPremium) {
    setIsPremium(true)
  }
}
```

**Problème** : Le statut `isPremium` est lu depuis `localStorage`, pas depuis l'API. Après un paiement réussi via webhook, le localStorage n'est pas mis à jour.

**Solution** : Toujours récupérer les données fraîches depuis l'API `/api/auth/me`.

---

#### 2.4 ❌ Gestion d'erreur incomplète dans les formulaires
**Fichiers** : `app/login/page.tsx`, `app/register/page.tsx`

```javascript
// ❌ Le setLoading(false) n'est pas appelé si validation échoue
const handleSubmit = async (e: React.FormEvent) => {
  setLoading(true)
  if (!formData.email || !formData.password) {
    setError('...')
    return  // ← setLoading(false) manquant !
  }
```

**Solution** : Mettre le `setLoading(false)` dans un bloc `finally` OU le mettre après chaque `return`.

---

## 🟡 INCOHÉRENCES DANS LES USER STORIES

### 3.1 ❌ Orientation accessible sans compte mais non sauvegardée
**User Story actuelle** : "En tant que visiteur, je peux faire le quiz d'orientation"

**Problème** : 
1. Un visiteur fait le quiz → reçoit des recommandations
2. Il crée un compte ensuite → ses recommandations sont **perdues**
3. Il doit refaire le quiz

**Solution** : 
- Sauvegarder les réponses dans `sessionStorage`
- À l'inscription, reprendre automatiquement ces réponses et les sauvegarder

---

### 3.2 ❌ 3 forfaits affichés mais un seul statut "Premium"
**Fichiers** : `app/paiement/page.tsx`, `prisma/schema.prisma`

**Problème** :
- La page paiement affiche **3 forfaits** : Starter (299€), Premium (600€), Enterprise (999€)
- Mais le modèle `User` n'a qu'un champ `isPremium: Boolean`
- **Tous les forfaits donnent le même statut Premium !**

**Solution** : 
```prisma
model User {
  ...
  subscriptionTier  String?  @default(null) // "starter" | "premium" | "enterprise" | null
  subscriptionEnd   DateTime?
}
```

---

### 3.3 ❌ Upload de documents accessible sans être Premium
**Fichier** : `app/dashboard/student/upload/`

**Problème** : La page d'upload est accessible à tous les utilisateurs, mais la description dit que c'est une fonctionnalité Premium.

**Solution** : Ajouter une vérification `requirePremium` côté API et afficher un message "Passez à Premium" côté frontend.

---

### 3.4 ❌ Favoris vs Candidatures - Confusion
**User Stories conflictuelles** :
- "Je peux ajouter une école en favori" (modèle `Favorite`)
- "Je peux créer une candidature avec statut 'intéressé'" (modèle `Application`)

**Problème** : Les deux concepts se chevauchent. Un utilisateur peut avoir :
- Une école en "favori" (table Favorite)
- ET une candidature "intéressé" vers la même école (table Application)

**Solution** : 
- **Option A** : Fusionner les deux concepts (supprimer Favorite, garder uniquement Application)
- **Option B** : Clarifier que Favorite = "watchlist" et Application = "candidature active"

---

### 3.5 ❌ Recommandations multiples non gérées
**Fichier** : `server/routes/orientation.js`

**Problème** : Chaque fois qu'un utilisateur refait le quiz, on crée de NOUVELLES recommandations sans supprimer les anciennes.

**Solution** :
```javascript
// Supprimer les anciennes recommandations avant d'en créer
await prisma.recommendation.deleteMany({
  where: { userId: userId }
})
```

---

### 3.6 ❌ Pas de lien entre Orientation et Recommandations
**Modèle Prisma** :

**Problème** : `Recommendation` n'a pas de lien vers `OrientationResponse`. On ne sait pas quelle orientation a généré quelle recommandation.

**Solution** :
```prisma
model Recommendation {
  ...
  orientationId  String?
  orientation    OrientationResponse? @relation(fields: [orientationId], references: [id])
}
```

---

### 3.7 ❌ Dashboard Admin - Statistiques non fiables

**Problème** : Les statistiques affichées sont des valeurs statiques ou approximatives, pas des vraies requêtes en base.

**Solution** : Créer des vraies statistiques :
- Nombre d'inscriptions par jour/semaine/mois
- Taux de conversion (inscription → premium)
- Revenus par période

---

### 3.8 ❌ Logement sans lien avec les écoles

**Problème** : La page logement affiche des logements, mais il n'y a pas de lien avec la ville où l'étudiant veut étudier.

**Solution** : 
- Filtrer les logements par proximité avec les écoles recommandées
- Ajouter un champ "distance de l'école" dans les résultats

---

## 🟢 PROPOSITIONS D'AMÉLIORATIONS

### 4. Nouvelles fonctionnalités recommandées

#### 4.1 🆕 Système de récupération de mot de passe
**Priorité** : 🔴 HAUTE

**Description** : Actuellement, un utilisateur qui oublie son mot de passe n'a aucune solution.

**Implémentation** :
- Route `/api/auth/forgot-password` → envoie un email avec un token temporaire
- Route `/api/auth/reset-password` → valide le token et change le mot de passe
- Page `/forgot-password` avec formulaire

---

#### 4.2 🆕 Notifications en temps réel
**Priorité** : 🟡 MOYENNE

**Description** : Alerter les utilisateurs sur :
- Nouvelles écoles ajoutées correspondant à leur profil
- Deadlines de candidature approchantes
- Mises à jour de leur dossier par l'admin

**Implémentation** : WebSockets avec Socket.io ou Server-Sent Events

---

#### 4.3 🆕 Système de messagerie interne
**Priorité** : 🟡 MOYENNE

**Description** : Permettre la communication entre étudiants et conseillers

**Nouveau modèle** :
```prisma
model Message {
  id         String   @id @default(uuid())
  fromUserId String
  toUserId   String
  subject    String
  content    String   @db.Text
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

---

#### 4.4 🆕 Comparateur d'écoles
**Priorité** : 🟢 BASSE (existe déjà partiellement ?)

**Description** : Permettre de comparer 2-3 écoles côte à côte sur :
- Frais de scolarité
- Programmes
- Débouchés
- Localisation

---

#### 4.5 🆕 Avis et témoignages d'anciens étudiants
**Priorité** : 🟡 MOYENNE

**Description** : Permettre aux anciens étudiants de laisser des avis sur les écoles

**Nouveau modèle** :
```prisma
model Review {
  id        String   @id @default(uuid())
  userId    String
  schoolId  String
  rating    Int      // 1-5 étoiles
  title     String
  content   String   @db.Text
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

#### 4.6 🆕 Calendrier des deadlines
**Priorité** : 🔴 HAUTE

**Description** : Vue calendrier affichant :
- Deadlines de candidature
- Dates d'entretien
- Résultats attendus

**Note** : Une page `/dashboard/student/calendrier` existe déjà mais non analysée.

---

#### 4.7 🆕 Export PDF du dossier
**Priorité** : 🟢 BASSE

**Description** : Permettre à l'étudiant d'exporter son dossier complet en PDF :
- Profil
- Quiz d'orientation
- Recommandations
- Candidatures

---

#### 4.8 🆕 Intégration avec parcours Parcoursup/MonMaster
**Priorité** : 🟡 MOYENNE

**Description** : Synchroniser les candidatures avec les plateformes officielles (si API disponible).

---

### 5. Améliorations techniques recommandées

#### 5.1 📊 Monitoring et Logs
- Intégrer **Sentry** pour le tracking d'erreurs
- Intégrer **Vercel Analytics** ou **Plausible** pour les stats
- Implémenter un système de logs structurés (Winston/Pino)

#### 5.2 🔒 Sécurité
- Migrer JWT vers cookies httpOnly
- Ajouter rate limiting (express-rate-limit)
- Ajouter headers de sécurité (helmet.js)
- Valider toutes les entrées avec Zod

#### 5.3 📱 Performance
- Implémenter la pagination sur toutes les listes
- Utiliser `next/image` pour optimiser les images
- Ajouter du cache Redis pour les données statiques
- Implémenter le lazy loading des composants lourds

#### 5.4 🧪 Tests
- Tests unitaires avec Vitest
- Tests E2E avec Playwright
- Coverage minimum de 80%

#### 5.5 🚀 CI/CD
- GitHub Actions pour les tests automatiques
- Déploiement automatique sur Vercel
- Vérification des types TypeScript avant merge

---

## 📊 RÉCAPITULATIF

| Catégorie | Nombre | Priorité |
|-----------|--------|----------|
| Erreurs Backend | 6 | 🔴 HAUTE |
| Erreurs Frontend | 4 | 🔴 HAUTE |
| Incohérences User Stories | 8 | 🟡 MOYENNE |
| Nouvelles fonctionnalités | 8 | 🟡 Variable |
| Améliorations techniques | 5 | 🟢 BASSE-MOYENNE |

---

**Dernière mise à jour** : 14 janvier 2026
