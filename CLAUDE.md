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
node scripts/<script>.js   # scripts ponctuels (génération audio ElevenLabs, insertion de contenu)
```

Il n'y a **aucun framework de test** dans ce projet — pas de lanceur de tests, pas de fichiers de test, pas de script `test`. La vérification se fait par le build, le typecheck et le contrôle visuel dans le navigateur.

Le déploiement se fait sur Vercel ([vercel.json](vercel.json)), qui déclare aussi deux crons : `/api/cron/rappels-abonnement` (quotidien) et `/api/cron/newsletter-hebdomadaire` (jeudi). Variables d'environnement : voir [.env.example](.env.example) — Supabase (dont `SUPABASE_SERVICE_ROLE_KEY`, serveur uniquement), `NEXT_PUBLIC_SITE_URL`, Stripe, Moneroo, Resend, `CRON_SECRET`, et hors `.env.example` : `ELEVENLABS_API_KEY`, `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Règle du projet : **toujours demander confirmation explicite à Espoir Chinois avant toute publication ou tout déploiement en ligne.**

## Langue & conventions

- Le produit (ChinoisLingo) est un SaaS francophone d'apprentissage du mandarin. **Toute l'interface, tout le contenu, les commentaires, les identifiants de code côté serveur (`exigerAdmin`, `utilisateurDeLaRequete`, `verifierRateLimit`…) et les messages de commit sont en français.** S'y conformer.
- Style de commit : `feat: ...` / `fix: ...` / `docs: ...` / `refactor: ...`, avec un scope facultatif (`fix(auth): ...`) et un sujet en français.
- L'utilisateur / propriétaire est toujours appelé **Espoir Chinois** ; slogan de la marque : « Le chinois devient facile ».
- **Aucun secret en dur**, même comme valeur de repli : toujours `process.env.*` lu depuis `.env.local` (règle permanente d'AGENTS.md).

## Spécification produit normative — à lire avant tout travail d'UI ou de contenu

Trois documents font autorité sur cette application, et ils sont bien plus détaillés que ce fichier :

- [AGENTS.md](AGENTS.md) — règles globales, règles de contenu par rubrique (Écoute & Lecture, Vocabulaire, Formations), conventions de personnages et de rôles, **les 11 règles de génération audio ElevenLabs**.
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
- Audio ElevenLabs : modèle **`eleven_v3` obligatoire** ; sauvegarder `public/audio/readings_backup_*` avant tout écrasement.

AGENTS.md se termine par un bloc auto-généré `<!-- BEGIN:nextjs-agent-rules -->` écrit par `next dev`. Il demande de lire `node_modules/next/dist/docs/` avant d'écrire du code spécifique à Next — il s'agit de Next.js 16, dont les conventions diffèrent des versions antérieures (ex. `middleware` → `proxy`).

## Architecture

**Stack** : Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind v4 + Supabase, avec Stripe / Moneroo (paiement), Resend (e-mails), Upstash (rate limiting), ElevenLabs (audio pré-généré). Tailwind v4 est piloté par le CSS — il n'y a pas de `tailwind.config` ; les tokens sont dans `@theme` au sein de [src/app/globals.css](src/app/globals.css), et le mode sombre est une variante de classe (`@custom-variant dark`). Alias de chemin `@/*` → `src/*`.

**Pages : quasiment tout est composant client.** [src/app/layout.tsx](src/app/layout.tsx) (polices, metadata, viewport, `AuthProvider`) et la landing [src/app/page.tsx](src/app/page.tsx) sont côté serveur. [src/app/(app)/layout.tsx](<src/app/(app)/layout.tsx>) est `'use client'` et fournit `ThemeProvider` + `PreferencesProvider` ainsi que l'habillage applicatif (`TopNav`, `MobileTabBar`, toasts, `StudyTimeTracker`, `BanniereBonus`) à l'intérieur de la « carte conteneur » arrondie unique.

**Routes** :
- `/` — landing publique (un utilisateur connecté est redirigé vers `/tableau-de-bord`).
- Parcours d'entrée hors `(app)` : `/onboarding` (questionnaire + inscription), `/connexion`, `/inscription`, `/reinitialisation-mot-de-passe`, `/desabonnement`, `/auth/callback` (route handler Supabase).
- Groupe `(app)` : `/tableau-de-bord`, `/vocabulaire`, `/ecoute-lecture`, `/formation`, `/livres`, `/mon-compte`, `/parametres`, `/abonnement` (+ `/abonnement/retour`, retour de paiement).
- `/admin/*` — back-office (utilisateurs, e-mails, notifications, historique, message fondateur).
- `/api/*` — les seules routes serveur : `paiement/*`, `webhooks/{stripe,moneroo}`, `cron/*`, `emails/*`, `admin/*`, `classement`, `moi/acces`.

**Authentification : double garde.**
1. [src/proxy.ts](src/proxy.ts) (convention Next 16, **doit rester dans `src/`** — à la racine il serait ignoré silencieusement) protège l'*affichage* côté serveur : session avec e-mail confirmé exigée sur les pages de son `matcher`, rôle `admin` (`profiles.role`) pour `/admin`, redirection des connectés hors de `/` et `/connexion`. Toute nouvelle page protégée doit être ajoutée au `matcher` ; une nouvelle page publique à `ROUTES_PUBLIQUES`. `/api` est volontairement exclu.
2. Les routes API gardent leurs *données* elles-mêmes : le client envoie son jeton Supabase en `Authorization: Bearer`, validé par `utilisateurDeLaRequete` ([src/lib/payments/session-serveur.ts](src/lib/payments/session-serveur.ts)) ; les routes admin appellent `exigerAdmin` ([src/lib/admin/garde.ts](src/lib/admin/garde.ts)), puis utilisent `createAdminClient` (service_role, contourne RLS — [src/lib/supabase/admin.ts](src/lib/supabase/admin.ts)). Rate limiting via `verifierRateLimit` ([src/lib/security/rateLimiter.ts](src/lib/security/rateLimiter.ts), Upstash avec repli mémoire). Les modules serveur importent `'server-only'`.

Côté client, [src/lib/auth/AuthContext.tsx](src/lib/auth/AuthContext.tsx) porte l'état session/profil et appelle `recordDailyActivity` (série de jours). La case « Rester connecté » passe par un cookie de session éphémère ([src/lib/supabase/session-ephemere.ts](src/lib/supabase/session-ephemere.ts)) lu par le proxy.

**Freemium & abonnement.** [src/lib/payments/acces.ts](src/lib/payments/acces.ts) est la **source de vérité unique** du palier gratuit (quotas par rubrique appliqués *par rang*, histoires / formations / niveaux HSK gratuits). Côté UI, `useAbonnement()` renvoie un `EtatAbonnement` ([subscription.ts](src/lib/payments/subscription.ts)) dont le champ `accesComplet` (vrai pour abonné **ou** admin — ne jamais lui substituer `estAbonne`). Deux passerelles : Stripe (carte, EUR, récurrent) et Moneroo (Mobile Money, FCFA) ; l'octroi d'accès après webhook est centralisé dans `payments/octroi.ts`.

**Modèle de données à deux étages.** C'est le point le plus important à comprendre :

1. *Contenu statique compilé dans le bundle* — tout le catalogue pédagogique est du TypeScript/JSON dans le dépôt, pas en base :
   - [src/content/vocabulaire-hsk{1..6}.json](src/content/) — environ 5 000 mots officiels HSK, agrégés par [src/lib/data/hskCompleteDictionary.ts](src/lib/data/hskCompleteDictionary.ts).
   - [src/lib/data/](src/lib/data/) — corpus de phrases vérifiées (`tatoebaCorpus`, `hskSentencesDatabase`), liste initiale de notifications.
   - [src/lib/mock/](src/lib/mock/) — malgré le nom, il s'agit de **contenu de production**, pas de données factices : `coursesData` (formations et leçons), `combinationData` (Méthode de la Combinaison), `dailyWords` (Mot du Jour), `characters` (personnages récurrents), `vocabulary`, `reading`, `dashboard`.
   - `readingCatalog` — tout le catalogue Écoute & Lecture (chansons, vidéos, articles, histoires/séries, dialogues, podcasts avec Hanzi/Pinyin/Français ligne par ligne) est un unique tableau exporté en tête de [ecoute-lecture/page.tsx](<src/app/(app)/ecoute-lecture/page.tsx>) (fichier de ~7 700 lignes, `export const readingCatalog` vers la ligne 131). Ajouter du contenu revient à éditer ce tableau sur place — les scripts `scripts/insert_ep*.js` le font par remplacement de chaîne.
2. *État utilisateur et back-office dans Supabase* — schéma versionné dans [supabase/migrations/](supabase/migrations/). Tables principales : `profiles` (dont `role`, abonnement), `saved_words`, `content_progress`, `course_progress`, `daily_activity`, `notifications`, `payments`, `processed_events` (idempotence des webhooks), `emails_abonnement`, `emails_log`, `nouveaux_contenus`, `personnages_voix`, `admin_actions_log`. Types générés et alias de lignes dans [src/lib/supabase/types.ts](src/lib/supabase/types.ts) — à mettre à jour avec toute nouvelle migration.

**Contrat de la couche services client** ([src/lib/services/](src/lib/services/)) : chaque fonction crée un client navigateur, appelle `supabase.auth.getUser()`, retourne une valeur vide neutre (`[]`, `{}`, `false`, `null`) s'il n'y a pas d'utilisateur, et en cas d'erreur fait `console.error` puis retourne cette valeur neutre. **Les services ne lèvent jamais d'exception** — les appelants comptent dessus. Conserver cette forme en ajoutant un nouveau service. Les écritures de progression sont des `upsert` qui reposent sur des contraintes d'unicité composites (`user_id,content_id` et `user_id,course_id,lesson_id`). Exception : `elevenlabsService` est un module serveur (génération audio pour `/api/admin/audio/generate`).

`dashboardService.fetchRealDashboardStats()` est l'agrégateur : il appelle en parallèle les autres services, calcule la progression HSK par rapport à des `HSK_TOTALS` codés en dur, synthétise les séries du graphique, et retombe sur trois cartes « activité récente » par défaut pour les nouveaux utilisateurs.

**E-mails** ([src/lib/emails/](src/lib/emails/)) : envoi via Resend (`resend.ts`), gabarits par type (bienvenue, abonnement, récap hebdo, désabonnement, manuel), journalisation dans `emails_log`. Signature unique « L'équipe ChinoisLingo », tutoiement.

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

**Audio & vidéo.**
- L'audio d'Écoute & Lecture, du vocabulaire et du Mot du Jour est **pré-généré par ElevenLabs** et servi en statique depuis `public/audio/{readings,vocab,wod}/`. Pour chaque contenu : un master `<id>.mp3`, des clips par phrase `<id>_<sentenceId>.mp3` et un `<id>_meta.json` (`contentId`, `fullAudioUrl`, `sentences[]` avec `startMs`/`endMs`/`durationMs`/`audioUrl`) que le lecteur immersif charge. Voix par personnage : [src/lib/audio/voicesConfig.ts](src/lib/audio/voicesConfig.ts) + table `personnages_voix`, attribution dans `voiceAllocator.ts`.
- La Web Speech API (`SpeechSynthesisUtterance`, `lang: 'zh-CN'`) reste utilisée comme prononciation à la volée dans certains composants (flashcards, détail de mot, recherche) — le lecteur immersif ne doit pas y basculer quand l'audio ElevenLabs existe.
- Toute lecture YouTube passe par [`ChinoisLingoVideoPlayer`](src/components/ui/ChinoisLingoVideoPlayer.tsx), qui pré-monte l'iframe pour un démarrage en 1 tap, masque l'habillage YouTube, désactive le clic droit et implémente son propre plein écran (avec repli iOS). Ne jamais intégrer d'iframe brute.

## Particularités du dépôt

- **`scripts/` est dans `.gitignore`** : ces scripts (génération audio ElevenLabs via `ffmpeg-static`, insertion d'épisodes) lisent `ELEVENLABS_API_KEY` directement dans `.env.local` et écrivent dans `public/audio/` ou réécrivent `ecoute-lecture/page.tsx`. Ils ne sont pas versionnés.
- **`content/` à la racine est un doublon strictement identique de `src/content/`.** Seul `src/content` est importé (`@/content/...`). En cas de régénération des jeux de données HSK, mettre à jour `src/content/` (ou les deux) — ne modifier que la copie racine ne change rien.
- Les scripts racine `generate_*.js`, `translate_*.py`, `polish_pure_french.js`, `import_official_hsk_from_github.js` sont des **scripts ponctuels de génération / nettoyage de données HSK**, hors build. Certains contiennent des chemins absolus obsolètes pointant vers `app/src/content/` ; vérifier le chemin d'écriture avant d'en lancer un.
- [src/lib/supabase/middleware.ts](src/lib/supabase/middleware.ts) (`updateSession`) est un vestige non utilisé : la garde réelle est `src/proxy.ts`. De même, le commentaire de `session-serveur.ts` affirmant qu'« aucun middleware » n'existe est antérieur au proxy.
- `Chinoislingo mobile money skills/` (non suivi par git, exclu dans `tsconfig.json`) est une compétence de référence pour les paiements. Ses `examples/*.ts` sont des exemples de documentation ; l'intégration réelle vit dans [src/lib/payments/](src/lib/payments/).
- `next.config.ts` n'autorise les images distantes que depuis `images.unsplash.com`, `**.unsplash.com` et `**.googleusercontent.com`. Un nouvel hébergeur d'images (y compris `img.youtube.com` via `next/image`) nécessite une entrée `remotePatterns`.
- Le viewport est verrouillé (`maximumScale: 1`, `userScalable: false`) : les champs de saisie mobiles doivent utiliser `text-[16px]` pour éviter le zoom automatique iOS au focus.
