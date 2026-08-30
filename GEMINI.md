# GEMINI.md — Documentation Complète du Projet ChinoisLingo

Ce fichier sert de référence architecturale, technique et pédagogique absolue pour tout agent ou modèle d’IA interagissant avec le projet **ChinoisLingo**.

---

## 1. Identité & Règles d'Or de la Plateforme

- **Nom de la plateforme** : **ChinoisLingo**
- **Slogan officiel** : **« Le chinois devient facile »** (ou *« Avec ChinoisLingo, le chinois devient facile »*).
- **Nom de l'utilisateur / Propriétaire** : **Espoir Chinois** (toujours s'adresser à lui sous ce nom).
- **Règle de Déploiement** : Toujours demander confirmation explicite à Espoir Chinois avant toute publication ou déploiement en ligne.
- **Règle d'Unicité Absolue des Images** : Ne **JAMAIS** réutiliser la même image deux fois dans tout l'outil. Chaque ressource (mot, pack, article, chanson, histoire, dialogue, podcast, formation, livre) possède son image HD dédiée et exclusive.
- **Règle Globale de Célébration (Confettis & Paillettes)** : Dès qu'une ressource ou leçon est marquée comme terminée, déclencher systématiquement `confetti({ ... })`.
- **Règle Globale du Bouton Terminé (`✓ Terminé`)** : Sur toute l'application, l'état validé utilise le bouton avec fond rouge/corail (`#E53935` / `#E91E63`), texte blanc net, icône `Check`, intitulé exact **`✓ Terminé`** (sans le mot "Revoir").
- **Règle Globale d'Auto-Alignement des Onglets sur Mobile (`scrollIntoView`)** : Dès qu'un utilisateur clique sur un onglet ou filtre dans un ruban horizontal, l'élément défile automatiquement et de façon fluide pour venir se positionner au tout début visible à gauche (`inline: 'start'`).

---

## 2. Distinction des 3 Rôles d’Espoir Chinois

1. **Rôle 1 — Fondateur de ChinoisLingo** (Notifications, messages de la plateforme, emails) :
   - Signature : *« Espoir Chinois, Fondateur de ChinoisLingo »* (ou *« Espoir Chinois — Fondateur »*).
2. **Rôle 2 — Formateur** (Rubrique Formations & Cours vidéos) :
   - Intitulé : *« Formateur : Espoir Chinois »*.
3. **Rôle 3 — Personnage & Intervenant Contextuel** (Dialogues, Histoires, Écoute & Lecture) :
   - Nommage contextuel selon le scénario (ex: *Espoir Chinois (Partenaire)*, *Katia (Acheteuse)*, *Brice (Client)*, *王总 (Directeur)*).

---

## 3. Stack Technique & Architecture

- **Framework** : Next.js 16 (App Router, Turbopack) + React 19 + TypeScript.
- **Backend & Base de Données** : **Supabase PostgreSQL** (`@supabase/supabase-js`, `@supabase/ssr`), Row Level Security (RLS), tables relationnelles (`profiles`, `saved_words`, `content_progress`, `course_progress`, `notifications`).
- **Authentification** : Supabase Auth (Email / Mot de passe, Magic Link, gestion de session côté client & serveur via `AuthProvider`).
- **Services Fullstack** : Couche de persistance modulaire dans `src/lib/services/` (`vocabularyService`, `progressService`, `profileService`, `notificationService`).
- **Styles & Design System** : Vanilla CSS Tokens + Tailwind CSS utilities, design néo-moderne glassmorphism, mode sombre complet (`dark:` tokens).
- **Animations** : Transitions CSS fluides, micro-animations `.btn-press`, canvas-confetti, timers CSS de progression.
- **Synthèse Vocale (TTS)** : Web Speech API (`zh-CN` pour le chinois, prononciation native).
- **Localisation des Données** : Données statiques HSK haute performance combinées avec la persistance dynamique en temps réel Supabase.

---

## 4. Structure des Pages & Fonctionnalités Clés

### 4.1. Tableau de Bord (`/tableau-de-bord`)
- Statistiques en direct (série de jours avec flamme animée, mots maîtrisés, temps d'apprentissage).
- Section *Reprendre là où vous vous êtes arrêté* (accès direct en 1 clic aux lecteurs de leçons).
- Vue synthétique de la progression par palier HSK (HSK 1 à HSK 6).

### 4.2. Vocabulaire (`/vocabulaire`)
Comprend 4 sous-sections fondamentales :
1. **Vocabulaire HSK** : Les 6 packs officiels (HSK 1 à HSK 6) avec images HD d'étude, jauge de maîtrise, consultation de la liste complète des mots et sessions de **Flashcards 3D** (verso avec prononciation et vraies phrases contextuelles certifiées).
2. **Méthode de la Combinaison** :
   - Moteur combinatoire interactif (Sujet + Verbe & Modalité + Complément / Sujet + Adjectif / Verbe + Complément).
   - Richesse combinatoire mathématique (multiplicateur de phrases affiché en bas de page).
   - Structure 100% vérifiée (zéro structure approximative ; orientation bienveillante vers les mots pivots en cas d'entrée hors base).
   - Prononciation vocale instantanée, copie et sauvegarde dans *Mes Mots*.
3. **Mes Mots** :
   - Bibliothèque des mots et phrases enregistrés par l'apprenant.
   - Bouton *Réviser* (actif dès le 1er mot enregistré).
   - Modal d'ajout de mot personnalisé épuré (`Caractères Hanzi`, `Pinyin avec tons`, `Traduction en Français`, `Exemple(s)`, `Note`).
4. **Dictionnaire (HSK 1–6)** :
   - Moteur de recherche instantané multi-critères (Hanzi, Pinyin, Français).
   - Fiche détaillée du mot avec **jusqu'à 5 phrases d'exemples progressives issues du corpus vérifié Tatoeba** ordonnées du niveau débutant au niveau avancé (HSK 1 à HSK 5-6), avec audio et pastille certifiée `✓`.

### 4.3. Écoute & Lecture (`/ecoute-lecture`)
- **6 Catégories dans l'ordre officiel** : Chansons (coché par défaut à l'ouverture du catalogue général), Articles, Histoires, Dialogues, Podcasts, Vidéos.
- **Règles des Cartes du Catalogue** : Titre 100% en français, nom d'artiste 100% en alphabet latin, badge HSK coloré (aucun caractère chinois sur la carte extérieure ; les Hanzi et Pinyin sont réservés à l'intérieur du lecteur immersif).
- **Règle Permanente d'Illustration par Miniature Originale de la Première Vidéo** : Pour toute série de vidéos ou formation (Vidéos, Formations), l'image de couverture DOIT obligatoirement être la miniature originale de la première vidéo (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`).
- **Lecteur Immersif & Multimédia** :
   - **Lecteur Vidéo avec Bouton Personnalisé Violet Signature ChinoisLingo** : Pour toute vidéo sur la plateforme (Vidéos, Chansons, Formations), affichage de la miniature avec le bouton circulaire Play violet `#6200EE`. Dès le clic, la vidéo démarre immédiatement en lecture fluide (`autoplay=1`) au sein de l'application sans redirection.
   - **Chansons** : Paroles synchronisées découpées à chaque pause musicale / virgule (saut de ligne obligatoire), triptyque Hanzi + Pinyin complet avec tons + Traduction française soignée, balisage explicite des `🎵 Pré-refrain` (orange) et `🎵 Refrain` (rose).
   - **Règle Phonologique Chinoise des Tons (不 & 一)** :
     - **不** : devient **`bú`** (2ème ton) devant un mot au 4ème ton (ex: `bú shì`, `bú yòng`, `bú pà`, `bú huì`).
     - **一** : devient **`yí`** (2ème ton) devant un mot au 4ème ton (ex: `yí cì`, `yí jù`, `yí bèizi`), et **`yì`** (4ème ton) devant les 1er, 2ème et 3ème tons (ex: `yì shēng`, `yì bēi`).
   - **Vérification Multi-Sources** : Comparaison systématique des lyrics sur plusieurs sources chinoises certifiées pour garantir l'exactitude audio.
   - **Dialogues** : Section *Les Personnages du Dialogue* intercalée en en-tête avec rôles et portraits, puis répliques immersives avec lecture audio et pinyin commutable.
   - **Articles & Histoires** : Paragraphes bilingues avec synthèse vocale phrase par phrase.

### 4.4. Formations & Masterclasses (`/formation`)
- Catalogue de formations vidéo animées par **Espoir Chinois**.
- Badges unifiés au bas de la miniature (Niveau, Thématique, Compteur de leçons).
- Lecteur vidéo immersif avec suivi de progression, validation de leçons et quiz interactif.

### 4.5. Livres & Programmes VIP (`/livres`)
- Ouvrages de négociation commerciale (Guangzhou & Yiwu), lexiques de fret maritime & transit douanier, coaching immersif.

### 4.6. Recherche Globale & Notifications
- **Recherche Globale (`GlobalSearchModal.tsx`)** : Barre de recherche instantanée avec état vide épuré et filtrage par onglets de résultats (Vocabulaire, Écoute & Lecture, Formations...).
- **Notifications (`NotificationsModal.tsx`)** : Filtres *Tous*, *Espoir Chinois (Fondateur)* et *Système* avec auto-scroll au clic.

---

## 5. Charte Chromatique Officielle des Niveaux HSK

- **HSK 1** : Turquoise / Vert Émeraude (`#00BFA5` / `#00897B`)
- **HSK 2** : Bleu Azur Océan (`#0288D1`)
- **HSK 3** : Violet Officiel ChinoisLingo (`#6200EE`)
- **HSK 4** : Indigo / Bleu Roi (`#3F51B5`)
- **HSK 5** : Pourpre / Violet Profond (`#8E24AA`)
- **HSK 6** : Rubis Impérial / Magenta (`#D81B60` / `#D32F2F`)

---

## 6. Structure des Répertoires Principaux

```
Espoir Chinois SAAS/
├── AGENTS.md                  # Règles et instructions permanentes du projet
├── GEMINI.md                  # Documentation de référence globale (ce fichier)
├── package.json               # Dépendances et scripts Next.js à la racine
├── next.config.ts             # Configuration Next.js (Turbopack, images)
├── tsconfig.json              # Configuration TypeScript
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── layout.tsx         # Layout principal avec Sidebar et Header
│   │   │   ├── tableau-de-bord/   # Page Dashboard
│   │   │   ├── vocabulaire/       # Page Vocabulaire (HSK, Combinaison, Mes Mots, Dictionnaire)
│   │   │   ├── ecoute-lecture/    # Page Écoute & Lecture (Chansons, Articles, Podcasts...)
│   │   │   ├── formation/         # Page Formations vidéo
│   │   │   ├── livres/            # Page Livres & Programmes
│   │   │   ├── abonnement/        # Page Plans d'abonnement
│   │   │   ├── mon-compte/        # Page Profil
│   │   │   └── parametres/        # Page Paramètres
│   │   └── layout.tsx             # Root layout Next.js
│   ├── components/
│   │   ├── layout/                # Sidebar, Header, GlobalSearchModal, NotificationsModal
│   │   ├── vocabulary/            # CombinationMethod, FlashcardSession, WordDetailModal, AddWordModal
│   │   └── ui/                    # Composants génériques et modaux
│   ├── lib/
│   │   ├── data/                  # hskSentencesDatabase.ts (corpus de phrases vérifiées Tatoeba)
│   │   ├── mock/                  # combinationData.ts, coursesData.ts, vocabData.ts
│   │   └── utils.ts
│   └── content/                   # vocabulaire-hsk1.json à vocabulaire-hsk6.json
└── public/                    # Fichiers statiques et médias
```

---

## 7. Instructions pour Tout Modèle d’IA ou Agent Futur

1. **Adresser toujours l'utilisateur sous le nom « Espoir Chinois »**.
2. **Ne jamais déployer ni publier en ligne sans l'accord préalable d'Espoir Chinois**.
3. **Conserver le slogan « Le chinois devient facile »** sur toutes les communications.
4. **Toujours tester la compilation (`npm run build`)** avant de clore une modification de code.
5. **Respecter la règle de vérification visuelle obligatoire dans le navigateur** pour toute vidéo ou élément multimédia intégré.
6. **Prioriser la simplicité, la clarté et l'élégance épurée (Design System ChinoisLingo)** sans jamais sacrifier le confort mobile.
