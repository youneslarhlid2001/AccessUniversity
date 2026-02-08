# Plan de Test - User Stories & Parcours Utilisateur AccessUniversity

Ce document recense les scénarios à tester pour valider le bon fonctionnement de l'application (Happy Paths) et la gestion des erreurs (Error Paths).

## 1. Authentification & Profil

### ✅ Parcours Réussite (Happy Paths)
- [Good] **Inscription** : En tant que visiteur, je peux créer un compte avec un email unique et un mot de passe valide. Je suis redirigé vers le dashboard.
- [Good] **Connexion** : En tant qu'utilisateur, je peux me connecter avec mes identifiants corrects.
- [Good] **Déconnexion** : En tant qu'utilisateur connecté, je peux me déconnecter via le menu profil.
- [Il faut se connecter et déconnecter pour voir le changement sur le menu en bas.] **Mise à jour Profil** : En tant qu'étudiant, je peux modifier mes informations personnelles (Nom, Prénom) dans la page Profil.

### ❌ Parcours Erreur (Error Paths)
- [Good] **Inscription Doublon** : Essayer de créer un compte avec un email déjà existant (doit afficher une erreur claire).
- [Good] **Connexion Invalide** : Essayer de se connecter avec un mauvais mot de passe ou un email inconnu.
- [Good] **Champs Manquants** : Tenter de s'inscrire sans remplir tous les champs obligatoires.

## 2. Module Orientation (Dashboard)

### ✅ Parcours Réussite (Happy Paths)
- [Good] **Nouvelle Analyse** : Depuis le dashboard, je peux lancer une "Nouvelle Orientation", remplir les 3 étapes (Niveau, Pays, Profil) et voir les résultats.
- [Good] **Sauvegarde Automatique** : Une fois l'analyse terminée, elle doit apparaître dans "Mon Orientation".
- [Good mais page de détails pas trop significative et pas bien organisée ] **Détails Historique** : Depuis la liste "Mon Orientation", je peux cliquer sur une ancienne analyse et revoir exactement les mêmes résultats et recommandations.
- [Good] **Navigation vers École** : Depuis les résultats d'une orientation, je peux cliquer sur une école recommandée et arriver sur sa page de détail interne (`/dashboard/student/ecoles/[id]`).

### ❌ Parcours Erreur (Error Paths)
- [Good] **Formulaire Incomplet** : Essayer de passer à l'étape suivante sans sélectionner de niveau ou de pays.
- [Good] **Accès Non Autorisé** : Essayer d'accéder à l'URL d'une orientation qui ne m'appartient pas (ex: changer l'ID dans l'URL). Doit rediriger ou afficher une erreur 404/403.

## 3. Gestion des Écoles & Candidatures

### ✅ Parcours Réussite (Happy Paths)
- [Good] **Catalogue** : Je peux voir la liste des écoles dans "Mes Écoles".
- [Dans le dashboard, je ne possède pas de recherche ou filtres pour les écoles mais cela est bien présent sur la page des écoles sur le site web ] **Recherche** : Je peux filtrer les écoles par nom ou pays.
- [Dans la page de détail je peux le faire mais pas dans le listing des écoles] **Favoris** : Je peux ajouter/retirer une école de ses favoris depuis la liste ou la page détail.
- [Good] **Intérêt** : Sur une page école, je peux cliquer sur "Je suis intéressé". Le statut doit passer à "Intéressé".
- [Good] **Suivi Candidature** : Je peux changer manuellement le statut de ma candidature (Envoyée, Acceptée, Refusée) et ajouter une note personnelle.

### ❌ Parcours Erreur (Error Paths)
- [Good] **École Inexistante** : Accéder à `/dashboard/student/ecoles/fake-id` doit afficher une page 404 ou un message d'erreur et un bouton retour.
- [Je n'ai pas de boutons de sauvegarde mais je peux ajouter une note et elle reste sauvegardée] **Note Non Sauvegardée** : Vérifier que si la connexion coupe pendant la sauvegarde d'une note, l'interface ne reste pas bloquée (test difficile manuellement, mais vérifier le feedback visuel).

## 4. Dashboard Principal

### ✅ Parcours Réussite (Happy Paths)
- [Pour les compteurs, je ne peux pas les voir car le texte est en blanc comme la couleur du cadre] **Affichage Données** : Le dashboard doit afficher mon Prénom, mon statut (Premium/Gratuit), et des compteurs corrects (nombre d'orientations, favoris, etc.).
- [Good] **Widget Dernière Orientation** : Le widget doit afficher la date et le pays de ma dernière orientation et être cliquable.
- [Good mais comme les compteurs le texte en blanc et on le voit pas] **Lien Premium** : Si je suis gratuit, le encart "Devenir Premium" doit être visible et mener au paiement.

### ❌ Parcours Erreur (Error Paths)
- [Good] **Données Vides** : Si je suis un nouvel utilisateur sans orientation ni favori, le dashboard doit afficher des "Empty States" (états vides) propres et non des erreurs ou des blocs vides cassés.

## 5. Paiement (Si activé)

### ✅ Parcours Réussite (Happy Paths)
- [Good mais pas de détails sur les offres.] **Accès Offre** : Je peux voir la page des offres Premium.
- [Non testé, je sais pas comment faire la simulation] **Simulation Paiement** : (En mode test) Je peux simuler un paiement réussi et voir mon statut passer à "Premium" sur le dashboard instantanément.

### ❌ Parcours Erreur (Error Paths)
- [Non testé, je sais pas comment faire la simulation] **Echec Paiement** : Simuler un échec de carte (ex: carte refusée) et vérifier que le message d'erreur est compréhensible.

## 6. Documents

### ✅ Parcours Réussite (Happy Paths)
- [Non testé, reservé aux users premium] **Upload** : Je peux télécharger un fichier (PDF/Image) dans la section Documents.
- [Non testé, reservé aux users premium] **Visualisation/Liste** : Le fichier apparaît bien dans la liste après upload.
- [Non testé, reservé aux users premium] **Suppression** : Je peux supprimer un document.

### ❌ Parcours Erreur (Error Paths)
- [Non testé, reservé aux users premium] **Format Invalide** : Essayer d'uploader un fichier .exe ou très lourd (vérifier si une limite est en place).
