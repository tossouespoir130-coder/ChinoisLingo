# GEMINI.md — Documentation Complète du Projet ChinoisLingo

Ce fichier sert de référence architecturale, technique et pédagogique absolue pour tout agent ou modèle d’IA interagissant avec le projet **ChinoisLingo**.

---

## 1. Identité & Règles d'Or de la Plateforme

- **Nom de la plateforme** : **ChinoisLingo**
- **Slogan officiel** : **« Le chinois devient facile »** (ou *« Avec ChinoisLingo, le chinois devient facile »*).
- **Nom de l'utilisateur / Propriétaire** : **Espoir Chinois** (toujours s'adresser à lui sous ce nom).
- **Règle Permanente de Salutation Officielle (`Nǐhǎo`)** : La formule de salutation officielle en pinyin sur TOUTE la plateforme (emails de bienvenue, récapitulatifs hebdomadaires, onboarding, notifications, messages et interface) s'écrit obligatoirement et exclusivement **`Nǐhǎo`** (attaché en un seul mot avec le 3ème ton `ǐ` sur le i).
- **Règle Permanente de Signature Exclusive des E-mails (`L'équipe ChinoisLingo`)** : Tous les e-mails de la plateforme (bienvenue, récapitulatifs hebdomadaires, notifications, authentification, réinitialisation de mot de passe, abonnements) signent obligatoirement et exclusivement **« L'équipe ChinoisLingo »** (bannissement des mentions nominatives dans les signatures d'emails).
- **Règle Permanente de Tutoiement dans les E-mails** : Tous les e-mails de la plateforme (bienvenue, récapitulatifs hebdomadaires, abonnements, notifications et messages d'Espoir Chinois) tutoient systématiquement et chaleureusement l'utilisateur (« tu », « ton », « ta », « tes »).
- **Règle Permanente d'Appellation Exclusive de la Méthode** : L'unique appellation officielle sur toute la plateforme, dans le code, les emails, les landing pages, les composants et la documentation est **« Méthode de la Combinaison »**. **Bannissement strict et absolu de l'expression *« méthode combinatoire »***.
- **Règle de Déploiement** : Toujours demander confirmation explicite à Espoir Chinois avant toute publication ou déploiement en ligne.
- **Règle Permanente de Sécurité Absolue des Clés API & Secrets** : Ne **JAMAIS** écrire une clé d'API, un token ou un secret en dur dans le code, même comme valeur de repli (*fallback*), valeur temporaire ou pour un test rapide. Utiliser **systématiquement et obligatoirement une variable d'environnement (`process.env.*`) stockée exclusivement dans `.env.local`** dès la toute première ligne de code qui en a besoin, quel que soit le service (ElevenLabs, Resend, Stripe, Moneroo, Supabase, etc.). Tout script utilitaire ou d'administration doit être situé dans un dossier exclu du suivi Git (`scripts/` dans `.gitignore`).
- **Règle d'Unicité Absolue des Images** : Ne **JAMAIS** réutiliser la même image deux fois dans tout l'outil. Chaque ressource (mot, pack, article, chanson, histoire, dialogue, podcast, formation, livre) possède son image HD dédiée et exclusive.
- **Règle Globale de Célébration (Confettis & Paillettes)** : Dès qu'une ressource ou leçon est marquée comme terminée, déclencher systématiquement `confetti({ ... })`.
- **Règle Globale du Bouton Terminé (`✓ Terminé`)** : Sur toute l'application, l'état validé utilise le bouton avec fond rouge/corail (`#E53935` / `#E91E63`), texte blanc net, icône `Check`, intitulé exact **`✓ Terminé`** (sans le mot "Revoir").
- **Règle Globale d'Auto-Alignement des Onglets sur Mobile (`scrollIntoView`)** : Dès qu'un utilisateur clique sur un onglet ou filtre dans un ruban horizontal, l'élément défile automatiquement et de façon fluide pour venir se positionner au tout début visible à gauche (`inline: 'start'`).
- **Règle Permanente de Nommage des Personnages Récurrents** :
  - **Espoir** : `苏波` (Pinyin : `Sūbō`)
  - **Lily** : `丽丽` (Pinyin : `Lìli`) — Bannissement strict de la variante 莉莉.
  - **Katia** : `卡蒂娅` (Pinyin : `Kǎdìyà`)
  - **Brice** : `布里斯` (Pinyin : `Bùlǐsī`)
  - **Anthony** : `安东尼` (Pinyin : `Āndōngní`)
  - **Claire** : `克莱尔` (Pinyin : `Kèlái'ěr`)
  - **Monsieur Li** : `李老师` (Pinyin : `Lǐ Lǎoshī`)
- **Règle d'Exclusivité Absolue des Caractères Chinois Simplifiés (`简体字`)** : Sur **TOUTE l'application, dans tous les modules, rubriques, contenus et composants** (Vocabulaire, Écoute & Lecture, Formations, Dialogues, Histoires, Chansons, Articles, Podcasts, Dictionnaire, Notifications), utiliser **exclusivement et rigoureusement des caractères chinois simplifiés (`简体字`)**. Bannissement absolu et strict de tout caractère chinois traditionnel (`繁体字`) (ex: `放松`, `门`, `国`, `学`, `点`).
- **Règle Permanente de Structure : Histoires & Articles vs Dialogues & Vidéos** :
  - **Histoires & Articles** : Le texte est rédigé et présenté en **un bloc narratif fluide et continu (paragraphe par paragraphe)**, sans aucune étiquette ni badge d'interlocuteur (`speaker`) devant les phrases. Les personnages sont présentés collectivement dans la carte *« Les Personnages de l’Histoire »* positionnée **en bas de page (après le texte et le vocabulaire, juste avant la validation de fin de leçon)** pour un accès immédiat à la lecture.
  - **Dialogues & Vidéos scénarisées** : La parole étant alternée, chaque réplique affiche le nom et le rôle de l'interlocuteur (`speaker`) avec son code couleur distinctif. La carte de présentation des intervenants est également consultable en bas avant validation.
- **Règle Permanente de Perfection Orthographique et Grammaticale Française & Audit Automatique** : Sur **TOUTE l'application** (textes, leçons, dialogues, histoires, articles, vocabulaire, traductions, boutons, notifications, emails), zéro faute de français n'est tolérée (orthographe, grammaire, accords, ponctuation, typographie soignée). Lors de chaque audit ou ajout de contenu, une vérification systématique de l'orthographe française doit être exécutée.
- **Règle Permanente de Contrôle & Checking Audio Obligatoire avant Déploiement** : Pour TOUT contenu ajouté ou modifié sur la plateforme (histoire, article, dialogue, chanson, podcast, formation, vocabulaire), exécuter obligatoirement un contrôle final complet (*checking*) :
  1. Vérifier la présence effective et la conformité de toutes les pistes audio générées avec la voix attribuée (**Narrateur n°1** `narrator_1` pour les histoires et articles, voix dédiées pour les personnages).
  2. Vérifier la conformité stricte du fichier de métadonnées `_meta.json` (`contentId`, `fullAudioUrl`, tableau `sentences` avec `sentenceId`, `startMs`, `endMs`, `durationMs`, `audioUrl`).
  3. Vérifier que le lecteur immersif charge et joue bien les fichiers audio réels d'ElevenLabs (Master continu et audio phrase par phrase) sans aucun basculement intempestif sur la synthèse vocale du navigateur.
- **Règle Permanente de Distinction : « Épisode » (Vidéos) vs « Partie » (Histoires & Lectures)** : Le terme **« Épisode »** est réservé exclusivement aux contenus vidéos (`type: 'videos'`). Pour les histoires et lectures scénarisées (`type: 'histoires'`), utiliser systématiquement le terme **« Partie »** (`Partie 1`, `Partie 2`...) et **`X parties`** pour la durée globale.

### Les 11 Règles Permanentes de Génération Audio
1. **Modèle Obligatoire** : Toujours `eleven_v3`, jamais `eleven_multilingual_v2` ni aucun autre modèle.
2. **Réglages de Voix Obligatoires (Identiques sur tous les contenus)** :
   - `stability`: `0.50`
   - `similarity_boost`: `0.85`
   - `style`: `0.0`
   - `use_speaker_boost`: `true`
   - `output_format`: `mp3_44100_128`
3. **Structure de Génération selon le Type de Contenu** :
   - *Histoires et articles* : UN SEUL bloc, un seul appel API (`/v1/text-to-speech/{voice_id}/with-timestamps`), jamais fragmenté.
   - *Dialogues* : Groupés par répliques consécutives du même personnage avec Request Stitching, crossfade et normalisation du volume.
4. **Émotion et Expressivité Naturelles** : `eleven_v3` interprète nativement le contexte et la ponctuation. Pas de balises manuelles par défaut.
5. **Timestamps Obligatoires** : Extraction systématique des timestamps via `/with-timestamps` dans `_meta.json`.
6. **Régénération Propre** : Remplacement complet et homogène de tous les anciens fichiers existants.
7. **Validation Avant Génération de Masse** : Générer 2-3 exemples représentatifs et attendre la validation d'Espoir Chinois avant de lancer sur l'ensemble.
8. **Sauvegarde de Sécurité** : Sauvegarder systématiquement l'existant (`public/audio/readings_backup_*`) avant écrasement.
9. **Documentation Permanente** : Règle inscrite dans `AGENTS.md` et `GEMINI.md`.
10. **Rotation des Narrateurs pour les Histoires (5 Narrateurs Officiels)** :
    - Les 5 narrateurs officiels du catalogue sont classés dans cet ordre :
      1. **Narratrice 1 (Voix Principale)** : **Anna Su** (`9lHjugDhwqoxA5MhX0az`) — *Voix énergique et dynamique*
      2. **Narrateur 2** : **Ethan Zhang** (`brChkoggsUHF1stW6omH`)
      3. **Narratrice 3** : **Siqi Liu** (`W8lBaQb9YIoddhxfQNLP`)
      4. **Narratrice 4** : **Sage** (`APSIkVZudNbPAwyPoeVO`)
      5. **Narrateur 5** : **Hua Feng** (`rtRocV7drsrJFSQPxlD3`)
    - *Histoires indépendantes* : Rotation circulaire stricte entre les 5 narrateurs (Histoire 1 = Anna Su, Histoire 2 = Ethan, Histoire 3 = Siqi, Histoire 4 = Sage, Histoire 5 = Hua Feng, Histoire 6 = retour à Anna Su...).
    - *Séries d'histoires* : UN SEUL narrateur lit toute la série d'épisodes sans changement.
11. **Traitement des Débuts/Fins de Segments Audio (Anti-Glitch, Anti-Cut & Padding)** :
    - Micro fade-in (20-30ms) et fade-out (30-40ms) systématiques sur chaque segment découpé.
    - Padding de fin (+80ms) pour préserver la résonance naturelle et les consonnes finales sans aucune coupure abrupte.
    - Assemblage fluide avec pause naturelle (350ms) et normalisation sonore (`loudnorm`). S'applique à tous les contenus (histoires, dialogues, articles, vocabulaire).


---

## 2. Distinction des 3 Rôles d’Espoir Chinois

1. **Rôle 1 — Fondateur de ChinoisLingo** (Notifications, messages de la plateforme, emails) :
   - Signature / Intitulé : **`Espoir Chinois`** (*« Espoir Chinois, Fondateur de ChinoisLingo »*).
2. **Rôle 2 — Formateur** (Rubrique Formations & Podcasts de cours) :
   - Intitulé : **`Espoir Chinois`** (*« Formateur : Espoir Chinois »*).
3. **Rôle 3 — Personnage & Intervenant dans les Dialogues, Histoires et Vidéos** :
   - Nom français du personnage : **`Espoir`** (sans "Chinois").
   - Nom chinois (Hanzi) : **`苏波`** (Pinyin : **`Sūbō`**).
   - Traduction française de présentation : `我叫苏波。` se traduit **obligatoirement** par **`Je m’appelle Espoir.`** (et jamais par `Je m’appelle Sūbō.`).

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
   - Moteur d'assemblage interactif (Sujet + Verbe & Modalité + Complément / Sujet + Adjectif / Verbe + Complément).
   - Richesse de la combinaison mathématique (multiplicateur de phrases affiché en bas de page).
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
- **Règles des Cartes du Catalogue, Miniatures et Hubs de Séries** : Titre 100% en français, nom d'artiste 100% en alphabet latin, description concise en français, badge HSK coloré (aucun caractère chinois ni pinyin sur les cartes extérieures, miniatures ou hubs de sélection ; suppression de tout badge violet d'épisode redondant sur l'image car le titre mentionne déjà l'épisode ; les Hanzi et Pinyin sont réservés strictement à l'intérieur du lecteur immersif).
- **Règle Permanente d'Illustration par Miniature Originale de la Première Vidéo** : Pour toute série de vidéos ou formation (Vidéos, Formations), l'image de couverture DOIT obligatoirement être la miniature originale de la première vidéo (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`).
- **Lecteur Immersif & Multimédia (Responsivité & Ergonomie Mobile Maximale)** :
   - **Absence de Badge HSK à l'Intérieur du Lecteur** : Le badge HSK est affiché sur la carte extérieure du catalogue et totalement supprimé de l'en-tête de lecture pour une clarté et un confort visuel absolu.
   - **En-tête Mobile & Desktop 100% Aligné** : Le Titre bilingue `Titre Français (Hanzi)` est complété à droite par les boutons d'action rapide `[👁 Pinyin]` et `[🌐 Traduction]` en **micro-pills ultra-compacts**, tenant sur une seule ligne horizontale sur tous les smartphones.
   - **Lecteur Vidéo avec Bouton Signature Violet (1-Clic Direct Garanti)** : Pour toute vidéo sur la plateforme (Vidéos, Chansons, Formations), affichage de la miniature avec le bouton circulaire Play violet `#6200EE`. Pré-initialisé en arrière-plan pour un lancement instantané dès le premier tap tactile.
   - **Chansons** :
     - **Miniature YouTube Officielle Directe** : Pour TOUTES les chansons, l'image d'illustration de la carte et du lecteur est obligatoirement la miniature officielle YouTube (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`).
     - **Épuration des Paroles & Zéro Nom d'Artiste / Speaker dans les Couplets** : Ne jamais afficher de nom d'artiste ou d'interlocuteur devant les vers. Seules les sections musicales (`Couplet 1`, `Refrain`, `Pré-refrain`, `Pont`, `Outro`) sont conservées.
     - **Synthèse Vocale ElevenLabs Obligatoire pour Tous les Lyrics** : Générer systématiquement les audios parlés phrase par phrase (`${songId}_${sentenceId}.mp3`), le master unifié (`${songId}.mp3`) et les métadonnées (`${songId}_meta.json`) avec ElevenLabs pour que chaque vers soit audible d'un simple clic avec une voix pure, légère, claire et agréable.
     - **Découpage Rythmique & Triptyque Bilingue** : Paroles synchronisées découpées à chaque pause musicale / virgule (saut de ligne obligatoire), triptyque Hanzi + Pinyin complet avec tons + Traduction française soignée, balisage explicite des `🎵 Pré-refrain` (orange) et `🎵 Refrain` (rose).
   - **Règle Phonologique Chinoise des Tons (不 & 一)** :
     - **不** : devient **`bú`** (2ème ton) devant un mot au 4ème ton (ex: `bú shì`, `bú yòng`, `bú pà`, `bú huì`).
     - **一** : devient **`yí`** (2ème ton) devant un mot au 4ème ton (ex: `yí cì`, `yí jù`, `yí bèizi`), et **`yì`** (4ème ton) devant les 1er, 2ème et 3ème tons (ex: `yì shēng`, `yì bēi`).
   - **Vérification Multi-Sources** : Comparaison systématique des lyrics sur plusieurs sources chinoises certifiées pour garantir l'exactitude audio.
   - **Dialogues** : Section *Les Personnages du Dialogue* intercalée en en-tête avec rôles et portraits, puis répliques immersives avec lecture audio et pinyin commutable.
   - **Articles & Histoires** : Paragraphes bilingues avec synthèse vocale phrase par phrase.
   - **Règle Permanente de Narration dans les Séries d'Histoires** : Dans les épisodes ou histoires sans prise de parole directe, la voix par défaut est le **Narrateur n°1** (`narrator_1` / Ethan Zhang `brChkoggsUHF1stW6omH`, modèle `eleven_v3`). Lorsqu'un personnage s'exprime (Katia, Brice, Anthony, Espoir, Lily), sa réplique utilise sa voix dédiée respective et le narrateur reprend le relais pour le reste.

### 4.4. Formations & Masterclasses (`/formation`)
- Catalogue de formations vidéo animées par **Espoir Chinois**.
- Badges unifiés au bas de la miniature (Niveau, Thématique, Compteur de leçons).
- Lecteur vidéo immersif avec suivi de progression, validation de leçons et quiz interactif.

### 4.5. Livres & Programmes VIP (`/livres`)
- Ouvrages de négociation commerciale (Guangzhou & Yiwu), lexiques de fret maritime & transit douanier, coaching immersif.

### 4.6. Recherche Globale, Notifications & Pop-up Toasts
- **Recherche Globale (`GlobalSearchModal.tsx`)** : Barre de recherche instantanée avec état vide épuré et filtrage par onglets de résultats (Vocabulaire, Écoute & Lecture, Formations...).
- **Notifications (`NotificationsModal.tsx` & `notificationsData.ts`)** : Filtres *Tous*, *Espoir Chinois (Fondateur)* et *Système* avec auto-scroll au clic, persistance et **titres bilingues structurés sur 2 lignes propres (`\n`)** (Ligne 1 : Français / Ligne 2 : `<Chinois> 🎬` avec l'émoji clapet à la fin) pour un confort mobile optimal sans icône orpheline.
- **Pop-up Toast Automatique de Nouveau Contenu (`NewContentToast.tsx`)** : Dès qu'un nouveau contenu (vidéo, formation, dialogue, chanson) est publié, le pop-up toast apparaît automatiquement en bas à droite après 2.5 secondes avec la photo d'Espoir Chinois pour inviter l'apprenant à le découvrir en 1 clic.

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
