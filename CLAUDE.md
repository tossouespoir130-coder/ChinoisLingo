# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Ce fichier fournit les instructions de travail à Claude Code sur le dépôt **ChinoisLingo**.

## Commandes

```bash
npm run dev            # serveur de développement (Next 16)
npm run build          # build de production
npm run start          # sert le build de production
npm run lint           # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx eslint "src/app/(app)/vocabulaire/page.tsx"   # linter un seul fichier
npx tsc --noEmit       # vérification des types (tsconfig : noEmit + strict)
```

Il n'y a **aucun framework de test** dans ce projet — pas de lanceur de tests, pas de fichiers de test, pas de script `test`. La vérification se fait par le build, le typecheck et le contrôle visuel dans le navigateur.

Le déploiement se fait sur Vercel ([vercel.json](vercel.json)). Variables d'environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (voir [.env.example](.env.example)). Règle du projet : **toujours demander confirmation explicite à Espoir Chinois avant toute publication ou tout déploiement en ligne.**

## Langue & conventions

- Le produit (ChinoisLingo) est un SaaS francophone d'apprentissage du mandarin. **Toute l'interface, tout le contenu, les commentaires et les messages de commit sont en français.** S'y conformer.
- Style de commit : `feat: ...` / `fix: ...` / `docs: ...` avec un sujet en français.
- L'utilisateur / propriétaire est toujours appelé **Espoir Chinois** ; slogan de la marque : « Le chinois devient facile ».

## Spécification produit normative — à lire avant tout travail d'UI ou de contenu

Trois documents font autorité sur cette application, et ils sont bien plus détaillés que ce fichier :

- [AGENTS.md](AGENTS.md) — règles globales, règles de contenu par rubrique (Écoute & Lecture, Vocabulaire, Formations), conventions de personnages et de rôles.
- [.agents/rules/chinoislingo-design-system.md](.agents/rules/chinoislingo-design-system.md) — palette, anatomie des cartes, spécifications d'animation, architecture des modals, typographie.
- [GEMINI.md](GEMINI.md) — vue d'ensemble architecturale et pédagogique (large recouvrement avec AGENTS.md).

Les règles qui reviennent le plus souvent :

- **La charte de couleurs HSK est fixe partout** : HSK1 `#00BFA5`, HSK2 `#0288D1`, HSK3 `#6200EE`, HSK4 `#3F51B5`, HSK5 `#8E24AA`, HSK6 `#D81B60`. Marque : violet `#6200EE`, turquoise `#03DAC5`.
- **Ne jamais réutiliser deux fois la même image dans l'application.** Chaque ressource possède son image HD unique. Pour les séries vidéo et les formations, la couverture doit être la miniature YouTube originale de la première vidéo (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`).
- **Le bouton de validation s'intitule exactement `✓ Terminé`** sur fond rouge/corail, et toute complétion doit déclencher `confetti(...)`.
- **Aucun caractère chinois sur les cartes du catalogue** — titre en français, auteur en alphabet latin, description en français. Hanzi et Pinyin uniquement à l'intérieur du lecteur immersif. Aucun badge HSK *dans* le lecteur.
- Le contenu d'Écoute & Lecture est trié par **niveau HSK croissant**.
- Les rubans horizontaux d'onglets/filtres doivent appeler `scrollIntoView({ inline: 'start' })` au clic.
- Tous les modals passent par [`<Portal>`](src/components/ui/Portal.tsx) (rendu dans `document.body`).
- Le sandhi tonal est appliqué dans le contenu : 不 → `bú` devant un 4ᵉ ton ; 一 → `yí` devant un 4ᵉ ton, `yì` sinon.
- Phrases d'exemple : n'afficher qu'une phrase dont on est sûr à **100 %** (sources Tatoeba / hskhsk). Moins d'exemples vaut toujours mieux qu'un exemple approximatif.

AGENTS.md se termine par un bloc auto-généré `<!-- BEGIN:nextjs-agent-rules -->` écrit par `next dev`. Il demande de lire `node_modules/next/dist/docs/` avant d'écrire du code spécifique à Next — il s'agit de Next.js 16, dont les conventions diffèrent des versions antérieures.

## Architecture

**Stack** : Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind v4 + Supabase. Tailwind v4 est piloté par le CSS — il n'y a pas de `tailwind.config` ; les tokens sont dans `@theme` au sein de [src/app/globals.css](src/app/globals.css), et le mode sombre est une variante de classe (`@custom-variant dark`). Alias de chemin `@/*` → `src/*`.

**Tout est composant client.** [src/app/layout.tsx](src/app/layout.tsx) est la seule partie côté serveur (polices, metadata, viewport) et encapsule les enfants dans `AuthProvider`. [src/app/(app)/layout.tsx](<src/app/(app)/layout.tsx>) est `'use client'` et fournit `ThemeProvider` + `PreferencesProvider` ainsi que l'habillage applicatif (`TopNav`, `MobileTabBar`, `SrsReminderToast`, `NewContentToast`) à l'intérieur de la « carte conteneur » arrondie unique.

**Routes** : `/` redirige vers `/connexion` ; `/abonnement` redirige vers `/mon-compte?tab=subscription`. Les vraies pages vivent dans le groupe `(app)` : `/tableau-de-bord`, `/vocabulaire`, `/ecoute-lecture`, `/formation`, `/livres`, `/mon-compte`, `/parametres`.

**L'authentification est 100 % côté client, et aucune route n'est protégée.** [src/lib/auth/AuthContext.tsx](src/lib/auth/AuthContext.tsx) porte l'état session/profil et appelle `recordDailyActivity` (logique de série de jours) au chargement de la session. [src/lib/supabase/middleware.ts](src/lib/supabase/middleware.ts) exporte `updateSession`, mais **aucun `middleware.ts` n'existe à la racine du projet** : rien ne rafraîchit la session côté serveur et aucune page n'est verrouillée. Un utilisateur déconnecté qui atteint une page `(app)` obtient des données vides / de repli plutôt qu'une redirection. De même, [src/lib/supabase/server.ts](src/lib/supabase/server.ts) est actuellement inutilisé — toutes les lectures/écritures passent par le client navigateur.

**Modèle de données à deux étages.** C'est le point le plus important à comprendre :

1. *Contenu statique compilé dans le bundle* — tout le catalogue pédagogique est du TypeScript/JSON dans le dépôt, pas en base :
   - [src/content/vocabulaire-hsk{1..6}.json](src/content/) — environ 5 000 mots officiels HSK, agrégés par [src/lib/data/hskCompleteDictionary.ts](src/lib/data/hskCompleteDictionary.ts).
   - [src/lib/data/](src/lib/data/) — corpus de phrases vérifiées (`tatoebaCorpus`, `hskSentencesDatabase`), liste initiale de notifications.
   - [src/lib/mock/](src/lib/mock/) — malgré le nom, il s'agit de **contenu de production**, pas de données factices : `coursesData` (formations et leçons), `combinationData` (moteur de la Méthode de la Combinaison), `dailyWords` (catalogue du Mot du Jour), `vocabulary`, `reading`, `dashboard`.
   - `readingCatalog` — tout le catalogue Écoute & Lecture (chansons, vidéos, articles, histoires, dialogues, podcasts avec Hanzi/Pinyin/Français ligne par ligne) est un unique tableau exporté couvrant [ecoute-lecture/page.tsx:120-1591](<src/app/(app)/ecoute-lecture/page.tsx#L120-L1591>), déclaré au-dessus du composant dans le même fichier. Ajouter du contenu revient à éditer ce tableau sur place.
2. *État par utilisateur dans Supabase* — 5 tables : `profiles`, `saved_words`, `content_progress`, `course_progress`, `notifications`. Les types générés et les alias de lignes (`Profile`, `SavedWord`, `ContentProgress`, `CourseProgress`, `NotificationItem`) sont dans [src/lib/supabase/types.ts](src/lib/supabase/types.ts).

**Contrat de la couche services** ([src/lib/services/](src/lib/services/)) : chaque fonction crée un client navigateur, appelle `supabase.auth.getUser()`, retourne une valeur vide neutre (`[]`, `{}`, `false`, `null`) s'il n'y a pas d'utilisateur, et en cas d'erreur fait `console.error` puis retourne cette valeur neutre. **Les services ne lèvent jamais d'exception** — les appelants comptent dessus. Conserver cette forme en ajoutant un nouveau service. Les écritures de progression sont des `upsert` qui reposent sur des contraintes d'unicité composites (`user_id,content_id` et `user_id,course_id,lesson_id`).

`dashboardService.fetchRealDashboardStats()` est l'agrégateur : il appelle en parallèle les quatre autres services, calcule la progression HSK par rapport à des `HSK_TOTALS` codés en dur, synthétise les séries du graphique à partir de `total_minutes_learned` / `total_words_mastered`, et retombe sur trois cartes « activité récente » par défaut pour les nouveaux utilisateurs.

**Persistance côté client.** localStorage porte une part significative de l'état ; les noms de clés comptent :

| Clé | Rôle |
| --- | --- |
| `chinoislingo_user_preferences` | tout [PreferencesContext](src/context/PreferencesContext.tsx) (affichage pinyin/traduction, taille de session SRS, face de carte, vitesse audio, avatar, nom) |
| `espoir_theme` | mode clair/sombre ([ThemeContext](src/context/ThemeContext.tsx), bascule `.dark` sur `<html>`) |
| `chinoislingo_read_notifications` | identifiants de notifications lues, fusionnés avec les lignes Supabase par `notificationService` |
| `chinoislingo_user_dashboard_stats` | cache du tableau de bord servant d'état initial pour un affichage avant le retour réseau |
| `chinoislingo_dismissed_content_toast`, `chinoislingo_completed_readings`, `chinoislingo_user_raw_photo` | fermeture du toast, miroir local des complétions, photo d'avatar non recadrée |

La cloche de notifications reste synchronisée entre `TopNav` et `NotificationsModal` via un événement window personnalisé, `chinoislingo_notifications_updated`, émis depuis `notificationService`.

**Liens profonds.** Les cartes « Continuer » du tableau de bord, les notifications et la recherche globale naviguent par paramètre d'URL : garder ces formats stables — `/ecoute-lecture?type=<contentType>&id=<itemId>`, `/formation?course=<id>&lesson=<id>` (également reflétés dans `sessionStorage`), `/vocabulaire?tab=&word=&level=`, `/mon-compte?tab=`. Comme ces pages lisent `useSearchParams`, chacune est découpée en un composant interne `XxxContent()` enveloppé par un export par défaut dans `<Suspense>` — suivre ce schéma pour toute nouvelle page lisant des paramètres.

**Audio & vidéo.** La prononciation utilise la Web Speech API (`SpeechSynthesisUtterance`, `lang: 'zh-CN'`) — aucun fichier audio, aucun service TTS externe. Toute lecture YouTube passe par [`ChinoisLingoVideoPlayer`](src/components/ui/ChinoisLingoVideoPlayer.tsx), qui pré-monte l'iframe pour un démarrage en 1 tap, masque l'habillage YouTube, désactive le clic droit et implémente son propre plein écran (avec repli iOS). Ne jamais intégrer d'iframe brute.

## Particularités du dépôt

- **`content/` à la racine est un doublon strictement identique de `src/content/`.** Seul `src/content` est importé (`@/content/...`). En cas de régénération des jeux de données HSK, mettre à jour `src/content/` (ou les deux) — ne modifier que la copie racine ne change rien.
- Les scripts racine `generate_*.js`, `translate_*.py`, `polish_pure_french.js`, `import_official_hsk_from_github.js` sont des **scripts ponctuels de génération / nettoyage de données**, hors build. Certains contiennent des chemins absolus obsolètes pointant vers `app/src/content/` ; vérifier le chemin d'écriture avant d'en lancer un.
- `Chinoislingo mobile money skills/` (non suivi par git, exclu dans `tsconfig.json`) est une compétence de référence pour l'intégration de paiement pas encore construite (Stripe / Moneroo / Bictorys / PayTech mobile money). Ses `examples/*.ts` sont des exemples de documentation, pas du code applicatif.
- `next.config.ts` n'autorise les images distantes que depuis `images.unsplash.com`, `**.unsplash.com` et `**.googleusercontent.com`. Un nouvel hébergeur d'images nécessite une entrée `remotePatterns`.
- Le viewport est verrouillé (`maximumScale: 1`, `userScalable: false`) : les champs de saisie mobiles doivent utiliser `text-[16px]` pour éviter le zoom automatique iOS au focus.
