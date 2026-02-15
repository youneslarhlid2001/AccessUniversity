# Architecture des Dashboards & Flux de Données

Ce document décrit l'architecture multi-rôles de la plateforme AccessUniversity et la manière dont les données circulent entre les différentes interfaces.

## 1. Vue d'ensemble des Rôles

L'application est divisée en 3 espaces distincts sécurisés, plus une partie publique.

### 🎓 A. Dashboard Étudiant (`/dashboard/student`)
L'utilisateur final standard.
*   **Objectif** : S'orienter, rechercher des écoles, gérer ses dossiers.
*   **Fonctionnalités** :
    *   Vue d'ensemble et suggestions.
    *   Moteur de recherche d'écoles (Catalogue).
    *   Suivi des candidatures (Envoyé, En cours, Accepté).
    *   Gestion de documents (CV, Notes).
    *   Outil d'orientation IA.

### 🏛️ B. Dashboard École (`/dashboard/school`)
Le responsable d'admission d'un établissement partenaire.
*   **Objectif** : Gérer l'image de l'école et traiter les candidatures entrantes.
*   **Fonctionnalités** :
    *   **Fiche École** : Éditer la description, les programmes, les prix, les photos qui apparaissent sur le site public.
    *   **Candidatures** : Voir la liste des étudiants qui ont postulé, télécharger leurs dossiers, changer le statut (Accepter/Refuser).
    *   **Statistiques** : Voir combien d'étudiants ont visité la fiche ou mis l'école en favoris.

### 🛡️ C. Dashboard Admin (`/dashboard/admin`)
L'équipe interne d'AccessUniversity.
*   **Objectif** : Modération, support et vision globale.
*   **Fonctionnalités** :
    *   Gestion de tous les utilisateurs (Bannir, Modifier).
    *   Validation des créations de comptes Écoles.
    *   Suivi des paiements (Stripe).
    *   Configuration du site (CMS, FAQ).

---

## 2. Flux de Communication (Data Flow)

Il n'y a pas de communication "directe" (Peer-to-Peer) entre les dashboards. Tout passe par la **Base de Données (PostgreSQL)** via l'API Backend.

### Scénario 1 : Mise à jour de la Vitrine (École -> Public)
1.  L'école se connecte sur son dashboard.
2.  Elle modifie son "Programme Bachelor".
3.  L'API met à jour la table `School` en base de données.
4.  **Immédiatement**, le **Site Vitrine** (Page `/ecoles/[id]`) affiche les nouvelles informations car il lit la même base de données.

### Scénario 2 : Candidature (Étudiant -> École)
1.  L'étudiant clique sur "Postuler" depuis le site ou son dashboard.
2.  L'API crée une entrée dans la table `Application` : `{ studentId: X, schoolId: Y, status: 'PENDING' }`.
3.  L'école Y consulte son dashboard. Sa liste de candidatures fait une requête : `SELECT * FROM Application WHERE schoolId = Y`.
4.  L'école voit le nouvel étudiant.

### Scénario 3 : Réponse (École -> Étudiant)
1.  L'école change le statut de la candidature de 'PENDING' à 'ACCEPTED'.
2.  L'API met à jour la ligne correspondante en base de données.
3.  L'étudiant consulte son dashboard. Il voit son statut passer au vert ("Accepté").

---

## 3. Schéma Technique (Mermaid)

```mermaid
graph TD
    %% Base de données Centrale
    DB[("PostgreSQL Database")]
    style DB fill:#333,stroke:#fff,stroke-width:2px,color:#fff

    %% API Layer
    API["API Backend (Node/Express)"]
    style API fill:#e6fffa,stroke:#047857

    %% Site Vitrine
    subgraph PUBLIC [Site Vitrine (Next.js)]
        Home[Accueil]
        SchoolPage[Page École]
    end

    %% Dashboards
    subgraph DASHBOARDS [Espaces Connectés]
        StudentDash[Dashboard Étudiant]
        SchoolDash[Dashboard École]
        AdminDash[Dashboard Admin]
    end

    %% Flux
    StudentDash -- "1. Postule" --> API
    SchoolDash -- "2. Met à jour fiche" --> API
    AdminDash -- "3. Valide école" --> API
    
    API <-- "CRUD Operations" --> DB
    
    API -- "Sert les données" --> PUBLIC
    API -- "Sert les données" --> DASHBOARDS
```
