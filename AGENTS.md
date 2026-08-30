# Instructions du Projet ChinoisLingo

## Règles Globales
- Toujours s'adresser à l'utilisateur sous le nom : **Espoir Chinois**.
- Demander confirmation avant toute publication ou déploiement en ligne.
- Ne pas hésiter à proposer des idées constructives et innovantes.
- Slogan officiel de la marque : **« Le chinois devient facile »** (ou *« Avec ChinoisLingo, le chinois devient facile »*).
- **Règle d'Unicité Absolue et Stricte des Images dans TOUTE l'Application** : Ne JAMAIS réutiliser deux fois la même image dans tout l'outil. Chaque ressource (vocabulaire, article, chanson, histoire, dialogue, podcast, cours, livre, tableau de bord) DOIT posséder sa propre image haute définition unique, exclusive et dédiée. Interdiction absolue de dupliquer une URL ou un visuel d'une rubrique à une autre.
- **Règle Globale de Célébration (Confettis & Paillettes)** : Dès qu'un utilisateur marque une ressource (cours, leçon, chanson, dialogue, article, podcast, mot, livre) comme terminée, déclencher **systématiquement une animation festive de confettis et paillettes** (`confetti({ ... })`) pour le féliciter.
- **Règle Globale du Bouton Terminé (`✓ Terminé`) sur Tout le Site** : Sur **TOUTE l'application et dans toutes les rubriques**, l'état terminé utilise le bouton normalisé : fond rouge/corail (`#E53935` / `#E91E63`), texte blanc net, icône de validation `Check`, intitulé exact **`✓ Terminé`** (sans le mot "Revoir").
- **Règle Globale d'Auto-Alignement des Onglets et Filtres sur Mobile (`scrollIntoView`)** : Sur **TOUTE l'application et dans toutes les rubriques** (Vocabulaire, Écoute & Lecture, Formations, Notifications...), dès qu'un utilisateur clique sur un onglet, un filtre ou un raccourci dans un ruban à défilement horizontal, l'élément cliqué doit **systématiquement s'aligner de manière fluide au tout début visible à gauche (`inline: 'start'`)** pour garantir une lisibilité instantanée et un confort mobile irréprochable.
- **Règle Permanente de l'Avatar de Profil en Haut à Droite (`TopNav`)** : En haut à droite de l'en-tête de navigation, afficher **en permanence la photo de profil circulaire de l'utilisateur**. Au clic, elle ouvre le menu déroulant complet « Mon Compte » donnant accès direct à *Mon Profil*, *Abonnement* (sans "VIP"), *Préférences* (sans "& Étude") ainsi qu'au bouton normalisé **`Se déconnecter`** en bas. Aucun bouton textuel intrusif « Connexion » ne doit venir remplacer l'avatar dans la barre de navigation.
- **Règle du Bouton « Se déconnecter » sur la Page Mon Compte (`/mon-compte`)** : En pied de page de la page *Mon Compte* (accessible depuis tous les onglets), afficher le bouton rouge/rose **`Se déconnecter`** (avec icône `LogOut`) à côté du lien `Retour au Tableau de bord`, permettant à l'apprenant de se déconnecter proprement tout en préservant la carte de profil en haut épurée avec `Modifier le profil` seul.
- **Règle d'Harmonisation Stricte de l'Icône « Aléatoire » (`Shuffle`)** : Sur **TOUTE l'application et dans tous les réglages/préférences** (sens d'apprentissage, ordre des cartes, etc.), le choix aléatoire utilise **exclusivement l'icône de croisement de flèches (`Shuffle`)**. Bannissement absolu de l'émoji ou du symbole du dé (`🎲`).
- **Règle Globale de Chargement par Squelette Animé (`Skeleton Loader`)** : Lors du chargement initial ou de la reconnexion d'un utilisateur, afficher systématiquement un **Skeleton Loader fluide et animé** (`animate-pulse`) le temps de récupérer les données réelles depuis la base de données (profil, série de jours, mots appris, leçons complétées, activités récentes), garantissant une transition sans clignotement ni affichage temporaire de données fictives.
- **Règle d'Animation Garantie du Graphique de Performance** : Le graphique de performance anime systématiquement ses barres verticales de 0 à leur hauteur réelle dès l'arrivée des données (`requestAnimationFrame` + `transition` fluide sur 950ms) sans dépendre d'un rafraîchissement manuel de la page. Les données sont transmises directement depuis l'état racine du Tableau de Bord avec calcul adaptatif de l'échelle (`MAX_WORDS` / `MAX_STUDY_HOURS`) pour une visibilité majestueuse et immédiate à chaque connexion.
- **Règle d'Ergonomie Mobile Plein Écran & Anti-Zoom iOS sur les Formulaires** : Sur smartphone, la page de connexion / inscription s'ajuste pour tenir **intégralement sur un seul écran sans aucun défilement** (`min-h-[100dvh]`).
  - **Mode Connexion** : Sur mobile, le volet violet affiche uniquement l'en-tête (Logo ChinoisLingo + Slogan + « Maîtrisez le mandarin par immersion active » + court sous-titre) au-dessus du formulaire de connexion compact, masquant les 3 highlights pour garantir zéro scroll.
  - **Mode Création de Compte** : Sur mobile, le volet violet est entièrement masqué au profit du formulaire d'inscription complet (Pseudo, Email, Mot de passe, Confirmation) avec un mini-header épuré, permettant à tous les champs de tenir confortablement sur un seul écran sans défilement.
  - Tous les champs de saisie (`<input>`) utilisent obligatoirement une taille minimale de **16px sur mobile** (`text-[16px] sm:text-xs`) combinée à `viewport maximum-scale=1`, supprimant totalement l'effet de zoom automatique intempestif d'iOS et garantissant une expérience de frappe ultra-fluide.

## Design System & Normes UI
Toute page ou composant créé dans ce projet DOIT respecter le **Design System ChinoisLingo** documenté dans [.agents/rules/chinoislingo-design-system.md](file:///.agents/rules/chinoislingo-design-system.md) :
1. **Palette de couleurs centralisée** (Violet `#6200EE`, Turquoise `#03DAC5`, Neutres `#FAFAFA` / `#FFFFFF` / `#212121`, Dark mode tokens).
2. **Structure des cartes** avec `nixtio-card`, `rounded-2xl`, bordures `#E0E0E0` / `#2D2D2D`.
3. **Micro-animations obligatoires** : `.btn-press` au clic, flamme `flame-burn-vivid` sur les séries, jauges progressives sur 3.2s, `IntersectionObserver` sur les éléments défilés, confettis sur action terminée, conformité `prefers-reduced-motion`.
4. **Modals & Fenêtres** : toujours encapsulés dans `<Portal>` (`document.body`) pour garantir un centrage automatique au centre du viewport visible.
5. **Hiérarchie visuelle** : H1 percutant, badges pills, sous-titres épurés, Hanzi lisibles et Pinyin stylisé.

## Règles de Contenu & Médias Écoute & Lecture
Pour chaque rubrique, article, chanson, histoire, dialogue ou podcast ajouté dans **Écoute & Lecture** :
1. **Structure Standard des Cartes** : Format carré (ratio 1:1), image haute définition occupant la moitié supérieure (`object-fit: cover`), badge HSK flottant en haut à droite sur l'image, titre clair en français, sous-titre/artiste et description synthétique dans la moitié inférieure.
2. **Qualité et Lisibilité Absolue des Images** :
   - Sélectionner des images haute résolution (Unsplash/Pexels) parfaitement nettes, lumineuses, contrastées et directement évocatrices du thème.
   - Bannir les images sombres, floues, abstraites ou illisibles.
   - Toujours vérifier visuellement le rendu final dans l'interface avant validation.
3. **Validation & Interaction** :
   - Le bouton d'action en bas à droite affiche l'état :
     - **Non terminé** :
       - `Écouter` pour les **Chansons** et les **Podcasts**.
       - `Lire` pour les **Articles**, **Histoires** et **Dialogues**.
     - **Terminé** :
       - `✓ Terminé` (sur fond rouge/corail, sans le mot "Revoir").
   - Tout clic depuis la section *Continuer* du tableau de bord doit ouvrir directement le lecteur de la leçon correspondante.
4. **Intégralité, Synchronisation Audio et Découpage Rythmique des Paroles (Lyrics)** :
   - **Chronologie & Exhaustivité Audio Réelle** : Pour chaque chanson ajoutée, toujours comparer avec la transcription exacte de la piste chantée pour garantir une synchronisation audio parfaite du début à la fin (Couplets ➔ Pré-refrains ➔ Refrains ➔ Ponts ➔ Répétitions ➔ Outros). Ne jamais omettre un refrain ou une strophe répétée.
   - **Découpage Fin à Chaque Pause / Virgule (Saut de Ligne Obligatoire)** :
     - Chaque vers ou pause musicale de respiration (marquée par une virgule ou une suspension de chant) DOIT constituer **une ligne distincte et indépendante**.
     - **Bannir les lignes longues ou les vers combinés** (ex: ne pas mettre `夜空中最亮的星 能否听清` sur une seule ligne, mais scinder en Ligne 1 : `夜空中最亮的星` et Ligne 2 : `能否听清`).
     - Ce découpage court et naturel permet à l'apprenant de chanter,     - **Balisage Explicite des Refrains & Pré-refrains (`🎵 Refrain` / `🎵 Pré-refrain`)** : Pour TOUTE chanson ajoutée, chaque début de refrain DOIT comporter obligatoirement la propriété `section: 'Refrain'` (badge rose) et chaque pré-refrain `section: 'Pré-refrain'` (badge ambré/orange), offrant un repérage immédiat et une lecture fluide à l'apprenant.
    - **Règle Phonologique Chinoise des Changements de Tons de 不 et 一** :
      - **不** : Devant un mot au **4ème ton** (ton descendant), **不** se prononce et s'écrit obligatoirement en pinyin **`bú`** (au 2ème ton) (ex: `bú shì`, `bú yòng`, `bú pà`, `bú huì`, `bú zài`, `zhǎo bú dào`). Devant les 1er, 2ème et 3ème tons, il reste `bù`.
      - **一** : Devant un mot au **4ème ton**, **一** se prononce et s'écrit obligatoirement **`yí`** (au 2ème ton) (ex: `yí cì`, `yí jù`, `yí bèizi`, `yí yàng`, `yí gè`, `yí dìng`). Devant les 1er, 2ème et 3ème tons, il s'écrit **`yì`** (au 4ème ton) (ex: `yì shēng`, `yì bēi`, `yì tiān`, `yì duǒ`, `yì qǐ`).
    - **Règle de Comparaison Multi-Sources & Synchronisation Audio Stricte** : Toujours comparer les paroles sur plusieurs sources et bases musicales chinoises de référence (QQ Music, NetEase Cloud, Baidu) pour garantir une transcription 100% fidèle à la piste audio intégrée sans omission de strophe ni vers fantôme.
5. **Charte des Couleurs Normalisées pour les Niveaux HSK (HSK 1 à HSK 6)** :
   - Chaque niveau HSK possède une **couleur officielle fixe et unique** sur TOUS les contenus et toutes les pages de l'application :
     - **HSK 1** : **Turquoise / Vert Émeraude** (`#00BFA5` / `#00897B`)
     - **HSK 2** : **Bleu Azur Océan** (`#0288D1`)
     - **HSK 3** : **Violet Officiel ChinoisLingo** (`#6200EE`)
     - **HSK 4** : **Indigo / Bleu Roi** (`#3F51B5`)
     - **HSK 5** : **Pourpre / Violet Profond** (`#8E24AA`)
     - **HSK 6** : **Rubis Impérial / Magenta** (`#D81B60` / `#D32F2F`)
   - Cette cohérence chromatique absolue permet à l'apprenant d'identifier instantanément le niveau de difficulté au premier coup d'œil.
6. **Présentation Visuelle du Lecteur Immersif Écoute & Lecture** :
   - **En-tête de lecture (Ligne 1)** : Afficher le **Titre en français**, suivi du **Titre en caractères chinois (Hanzi)**, puis du **Badge [HSK X]** (`Titre Français (Hanzi) [HSK X]`).
   - **Sous-titres (Lignes 2 & 3)** : Le **Pinyin** est positionné sur la ligne juste en dessous, suivi du **nom de l'artiste** ou de l'auteur sur la ligne suivante.
   - **Boutons d'action rapide en en-tête (Pinyin & Traduction)** :
     - Positionnés **à droite** de l'en-tête, compacts et épurés sur mobile (`text-[10.5px] sm:text-xs`).
     - L'état actif/inactif est signalé visuellement par la couleur du bouton (allumé/éteint).
     - **Épuration maximale** : Ne pas ajouter de bouton de synchronisation ou de lecteur TTS global dans l'en-tête ; l'apprenant fait défiler les paroles librement à son rythme.
   - **Lecteur Vidéo avec Bouton Personnalisé Violet Signature ChinoisLingo** : Sur TOUTE la plateforme (Écoute & Lecture, Vidéos, Chansons, Formations), les vidéos affichent la miniature avec le **bouton Play circulaire personnalisé couleur violette signature ChinoisLingo (`#6200EE`)**. Au clic, la vidéo se lance immédiatement en lecture fluide (`autoplay=1`) au sein de l'application sans redirection.
   - **Épuration de l'Interface** : Ne jamais afficher de compteur technique de lignes ou de vers (ex: "X vers / phrases") dans l'en-tête des paroles/transcriptions afin de préserver une immersion fluide et épurée pour l'apprenant.
7. **Contrôle Systématique, Visuel et Obligatoire dans le Navigateur de Toute Vidéo YouTube** :
   - Pour TOUTE vidéo ou chanson ajoutée ou modifiée, **interdiction formelle de valider sans avoir effectué une vérification visuelle directe dans le navigateur (`browser_subagent`)**.
   - L'agent doit impérativement ouvrir la page, lancer le lecteur immersif, vérifier que la vidéo se charge et qu'elle est jouable sans AUCUN message « Vidéo non disponible », restriction de droits d'auteur ou blocage d'intégration oEmbed.
   - Si une vidéo présente des coupures, des voix off parasites, ou un blocage d'intégration, la remplacer immédiatement par une version propre et re-tester visuellement dans le navigateur avant toute communication à Espoir Chinois.

8. **Ordonnancement Hiérarchique Strict par Niveau HSK (Ordre Chronologique Croissant)** :
   - Dans TOUTE la rubrique **Écoute & Lecture** (Chansons, Podcasts, Articles, Histoires, Dialogues), tous les contenus doivent obligatoirement être regroupés et affichés par **ordre croissant de niveau HSK** :
     - Tous les contenus **HSK 1** regroupés ensemble en premier (en haut).
     - Suivis de tous les contenus **HSK 2**.
     - Suivis de tous les contenus **HSK 3**.
     - Suivis de tous les contenus **HSK 4, HSK 5, HSK 6**.
   - Aucun contenu d'un niveau inférieur (ex: HSK 1) ne doit apparaître après un contenu de niveau supérieur (ex: HSK 3).

9. **Absence Totale et Stricte de Caractères Chinois sur les Cartes du Catalogue de la Grille** :
   - Dans TOUT le catalogue / grille de la rubrique **Écoute & Lecture** (Chansons, Podcasts, Articles, Histoires, Dialogues) :
     - Le titre affiché sur la carte est **100% en français** (`titleFr`).
     - Le nom de l'artiste/auteur est **100% en alphabet latin / français** (`artist`), sans AUCUN caractère chinois (ex: `Little Fox Chinese` et non `Little Fox Chinese (经典儿歌)`, `Cheng Xiang` et non `Cheng Xiang (程响)`).
     - La description est **100% en français**.
     - **Les caractères chinois (Hanzi) et le Pinyin sont réservés exclusivement à l'intérieur du Lecteur Immersif** (affichés uniquement lorsque l'apprenant clique sur la carte pour lancer la leçon).

11. **Règle Permanente d'Illustration par Miniature Originale de la Première Vidéo** :
   - Pour TOUTE nouvelle série de vidéos, vidéo individuelle, formation ou masterclass ajoutée sur la plateforme (que ce soit dans la sous-rubrique *Vidéos* d'*Écoute & Lecture* ou dans la rubrique *Formations*), l'image d'illustration/couverture de la carte et du lecteur DOIT obligatoirement être la **miniature officielle originale de la première vidéo** (`https://img.youtube.com/vi/<ID>/hqdefault.jpg` ou `maxresdefault.jpg`). Ne jamais utiliser d'image abstraite ou déconnectée du dessin animé/de la vidéo réelle.

12. **Règle du Plan Général par Défaut sur Écoute & Lecture (Onglet Chansons Actif)** :
   - Lors de la navigation vers la rubrique **Écoute & Lecture** (`/ecoute-lecture`), afficher systématiquement le **plan général du catalogue** avec l'onglet **Chansons** coché et visible par défaut. L'apprenant visualise immédiatement les chansons et peut ensuite switcher librement vers les autres sous-menus (*Articles*, *Histoires*, *Dialogues*, *Podcasts*, *Vidéos*). Ne jamais forcer la réouverture d'une session terminée sans paramètre d'URL explicite.

13. **Règle Permanente de Notification et Pop-up Toast pour TOUT Nouveau Contenu Ajouté** :
   - Pour TOUT nouveau contenu ajouté sur la plateforme (vidéo, épisode de série, formation, chanson, dialogue, article, podcast, cours) :
     1. **Notification Cloche** : Ajouter systématiquement la notification dans `src/lib/data/notificationsData.ts` (affichée au niveau de la cloche de notification en haut avec badge non lu).
     2. **Pop-up Toast Automatique (`NewContentToast`)** : Le dernier ajout non vu apparaît automatiquement sous forme de pop-up discret en bas à droite après 2.5 secondes avec la photo d'Espoir Chinois (ou icône), le titre, et le bouton direct `Regarder / Découvrir` pour rediriger l'apprenant en 1 clic.
     3. **Historique Cumulatif** : Si l'utilisateur ne s'est pas connecté depuis longtemps, tous les ajouts restent parfaitement ordonnés et consultables dans le volet des notifications (cloche).

## Règles de Contenu & Structure de la Rubrique Vocabulaire
La rubrique **Vocabulaire** est structurée autour de 4 onglets fondamentaux et des 6 niveaux officiels HSK :
- **Onglet 1 : Vocabulaire HSK** (les 6 modules officiels HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6).
- **Onglet 2 : Méthode de la Combinaison** (moteur combinatoire interactif Sujet + Verbe + Complément avec multiplicateur mathématique, phrases aléatoires, synthèse vocale et sauvegarde dans Mes Mots).
- **Onglet 3 : Mes Mots** (les mots et phrases combinées enregistrés par l'apprenant + ajout de mot personnalisé).
- **Onglet 4 : Dictionnaire (HSK 1–6)** (moteur de recherche et filtres de tous les termes).

1. **Structure Standard des Cartes de Vocabulaire** :
   - **Format Compact & Harmonisé** : Carte rectangulaire moderne `nixtio-card rounded-3xl`, avec **image haute définition compacte en haut (`h-32 sm:h-36`, `object-fit: cover`)**.
   - **Éléments Visuels Flottants sur l'Image** :
     - **En haut à droite** : Badge de niveau HSK (`HSK 1` à `HSK 6`) respectant la charte officielle des couleurs.
     - **En bas à gauche** : Badge indicateur du nombre de mots (ex: `150 mots`, `2500 mots`).
   - **Partie Inférieure de la Carte** :
     - **Titre en français** percutant et lisible.
     - **Description concise unique** (sans sous-titre redondant).
     - **Jauge de progression** animée avec pourcentage de maîtrise.
     - **Boutons d'action standardisés** :
       - `Voir la liste` (pour consulter l'intégralité des mots du pack).
       - `Réviser` (pour lancer la session de Flashcards 3D).
2. **Qualité, Originalité & Thématique d'Apprentissage des Images** :
   - Sélectionner des images haute résolution (Unsplash) nettes, lumineuses, contrastées et **centrées sur l'apprentissage réel** pour les niveaux HSK 1 à HSK 6 (carnets d'écriture, étudiants concentrés qui révisent, calligraphie active des caractères chinois, fiches d'étude, environnement de travail inspirant).
   - **Unicité stricte** : Aucune image ne doit être utilisée plus d'une fois dans tout le projet.
   - Bannir les images sombres, abstraites, génériques, déconnectées de l'étude ou floues.
   - Toujours vérifier visuellement le rendu final dans l'interface.

3. **Règles de Logique et Traitement Grammatical pour la Méthode de la Combinaison** :
   Pour tout mot ou phrase saisi par l'apprenant dans le champ libre ou sélectionné parmi les raccourcis :
   - **Étape 1 — Identifier la nature grammaticale du mot ou de la phrase saisie** : Déterminer avec précision s'il s'agit d'un verbe (transitif/intransitif), d'un nom/lieu/objet, d'un adjectif, d'un adverbe, d'une expression figée ou d'une phrase complète.
   - **Étape 2 — Détecter la structure réellement adaptée, sans la présumer** : La structure ne doit JAMAIS être imposée d'avance à Sujet + Verbe + Complément. Le moteur sélectionne la structure authentique :
     - *Sujet + Verbe + Complément* (verbe transitif appelant un complément ou nom d'objet appelant sujet + verbe).
     - *Sujet + Verbe seul* (verbe intransitif ou action naturelle sans complément — ex: 他去了 "il est parti", 我休息 "je me repose").
     - *Verbe + Complément seul* (sujet implicite, oral ou impératif — ex: 吃饭, 看电影, 去中国).
     - *Sujet + Adjectif* (phrase descriptive avec adverbe de degré — ex: 这件衣服很漂亮, 今天非常热).
     - *Groupe nominal / Réponse courte isolée*.
   - **Étape 3 — N'afficher que les postes réellement pertinents** : Si la structure détectée ne comporte que 2 postes, afficher exactement 2 colonnes d'options (pas 3) ; ne jamais inventer un poste artificiel ou vide.
   - **Étape 4 — Générer des options cohérentes et compatibles** : Les options à chaque poste doivent être 100% compatibles entre elles et avec le mot pivot d'origine, garantissant des phrases chinoises et françaises impeccables et naturelles.
   - **Étape 5 — Vérification et Présentation Épurée** :
      1. **Traduction complète à 100% en français** : La phrase finale doit être entièrement traduite en français impeccable, sans aucun mélange de langues.
      2. **Naturel idiomatique authentique** : La combinaison finale doit être une phrase qu'un locuteur natif chinois emploierait naturellement.
      3. **Épuration Maximale de l'Interface** : L'en-tête est épuré à une seule phrase synthétique. La boîte de phrase supprime tout texte verbeux de structure ainsi que les coches superflues (la phrase démarre directement avec les blocs de mots purs). Le multiplicateur mathématique et les explications détaillées sont positionnés en bas de page.
   - **Étape 6 — Gestion bienveillante des cas d'échec** : Si le terme saisi ne permet pas de construire une combinaison cohérente (caractère inconnu, particule isolée...), afficher un message bienveillant et explicite (ex: *"Ce mot ne se prête pas à la méthode de la combinaison — essayez un verbe, un adjectif ou un mot du quotidien"*) avec accès direct aux mots pivots suggérés.

4. **Règle d'Exemplification du Vocabulaire (Corpus Ouvert Tatoeba, hskhsk & Règle d'Or des 100% Sûr)** :
   - Pour les exemples de phrases affichés par mot de vocabulaire (Fiche détaillée du Dictionnaire, Mes Mots et Mot du Jour) :
     - **Plafond Progressif jusqu'à 5 Phrases Validées (0 à 5 Exemples)** : Dès que le corpus le permet, proposer **jusqu'à 5 phrases d'exemples authentiques et validées**. Si le corpus en compte moins, afficher exactement le nombre disponible (4, 3, 2, 1 ou 0). Si aucune phrase n'est certifiée à 100%, la section des exemples reste entièrement masquée.
     - **Ordonnancement Strict par Difficulté Croissante** : Les phrases sont systématiquement ordonnées de **la plus simple à la plus complexe** (ex: Niveau 1 Débutant / HSK 1 ➔ Niveau 2 Élémentaire / HSK 2 ➔ Niveau 3 Intermédiaire / HSK 3 ➔ Niveau 4 Intermédiaire Supérieur / HSK 4 ➔ Niveau 5 Avancé & Business / HSK 5-6).
     - **Règle d'Or de Fiabilité Absolue (100% Sûr ou Rien)** : Dès lors que l'on n'est pas certain à **100%** de l'exactitude, du naturel et de la fidélité d'une phrase d'exemple pour un locuteur natif, **il est formellement interdit de l'afficher comme exemple**. Il est préférable et normal qu'un mot rare ait moins d'exemples (2, 1 ou 0) plutôt que de présenter un exemple approximatif, artificiel ou potentiellement incorrect.
     - **Bannissement Strict des Phrases Méta / Génériques** : Interdiction totale d'afficher des phrases de remplissage de type *« X est un mot clé必考 du HSK... »* ou *« Le terme X exprime l'idée de... »*. Seules de vraies phrases de contexte naturel sont autorisées.
     - **Sources de Référence Primordiales** : Utiliser en priorité absolue le **Corpus Ouvert Tatoeba (`tatoeba.org`)** et **`hskhsk.com/word-lists`** pour des paires de phrases réelles chinois-français authentiques, relues et vérifiées. Pour les mots rares sans exemple suffisant, formuler une phrase exemplaire vérifiée par rapport aux tournures réellement attestées dans les corpus linguistiques BCC (`bcc.blcu.edu.cn`) ou CCL (Université de Pékin).
     - **Fichier de Données Fixe Local & Zéro Latence Réseau** : Ce travail de constitution et de vérification est réalisé une seule fois en amont et sauvegardé dans un fichier statique local (`hskSentencesDatabase.ts` / JSON) directement dans le projet. L'application ne doit JAMAIS recontacter d'API ou de site externe en temps réel lors de l'usage utilisateur, garantissant un chargement instantané à 100% et sans latence.
     - **Badge de Certification Épuré (Style Réseaux Sociaux)** : Pour toute phrase certifiée affichée, afficher une simple pastille de validation avec coche blanche `✓` (exactement comme le badge certifié des réseaux sociaux).
     - **Triptyque Complet & Synthèse Vocale** : Chaque exemple comporte obligatoirement son Hanzi, son Pinyin complet avec tons, sa traduction 100% française et sa prononciation audio dédiée (`Volume2`).

5. **Structure du Formulaire « Ajouter un Mot Personnalisé » (`Mes Mots`)** :
   - Le modal d'ajout de mot manuel est épuré et centré sur l'essentiel :
     - **Ligne 1 (2 colonnes)** : `Caractères Hanzi *` et `Pinyin avec tons`.
     - **Ligne 2 (Pleine largeur)** : `Traduction en Français *`.
     - **Ligne 3 (Pleine largeur)** : `Exemple` (champ libre multiligne pour enregistrer une phrase contextuelle personnelle).
     - **Ligne 4 (Pleine largeur)** : `Note` (champ pour les astuces, mnémotechniques ou précisions d'usage).
   - Bannissement des sélecteurs superflus de pack/niveau HSK lors de l'ajout d'un mot personnalisé.

6. **Normes des Sessions de Flashcards 3D & Système de Répétition Espacée (SRS)** :
   - **Abréviations grammaticales courtes** : Utiliser exclusivement les formes abrégées normalisées (`adv.`, `adj.`, `n.`, `v.`, `pron.`, `prép.`, `conj.`, `part.`, `num.`, `cl.`).
   - **Épuration des textes méta** : Bannissement de la mention « Référentiel HSK X » et du texte « Évaluez votre niveau de maîtrise » au-dessus des boutons.
   - **Centrage Absolu & Design Glassmorphism** : Recto et Verso utilisent un fond glassmorphism élégant aux reflets violet / turquoise de la charte. Le caractère Hanzi géant, le Pinyin, la traduction française et l'exemple sont tous **parfaitement centrés verticalement et horizontalement au cœur de la carte**.
   - **Échelle d'Intervalles SRS Normalisée** :
     - 🔴 **`À Revoir`** : **10 min** (quelques dizaines de minutes)
     - 🟠 **`Difficile`** : **2 h** (quelques heures)
     - 🟢 **`Je Sais`** : **4 j** (entre 3 et 5 jours)
     - ⚡ **`Facile`** : **7 j** (maximum 7 jours)
   - **Vibration Haptique & Confettis** : Déclenchement d'un retour haptique léger (`navigator.vibrate`) à chaque notation et célébration festive en fin de session.

## Règles de Contenu & Design de la Rubrique Formations
1. **Structure des Cartes de Formation** :
   - **Couverture Haute Définition** : Image ou miniature vidéo en haut au ratio 16:9 (`aspect-video sm:h-52`, `object-fit: cover`).
   - **Disposition Normalisée des Badges au Bas de la Miniature (Sur la Même Ligne)** :
     - Pour TOUTES les formations, les badges sont positionnés **au bas de l'image de couverture**, alignés horizontalement sur une seule et même ligne afin de laisser le haut et le centre de la miniature 100% dégagés :
       - À gauche : Badge de **Niveau** (ex: `DÉBUTANT`, `TOUS NIVEAUX`).
       - Juste à côté : Badge de **Contexte / Domaine** (ex: `PODCAST & IMMERSION`, `ORAL & QUOTIDIEN`).
       - À droite : Badge **Compteur de leçons** (ex: `▶ 9 leçons`, `▶ 31 leçons`).
     - **Taille Harmonisée** : Les 3 badges possèdent exactement la même taille de typographie compacte (`text-[10px]`, `font-bold` / `font-extrabold`, padding unifié) calquée sur celle du compteur de leçons.
   - **Partie Inférieure de la Carte** :
     - Titre de la formation lisible et percutant.
     - Description synthétique du programme.
     - Formateur attitré : **Espoir Chinois**.
     - Jauge de progression et compteur `X / Y leçons`.
     - Bouton d'action `Commencer la formation` / `Continuer la formation`.
2. **Grille Harmonisée à 3 Formations par Ligne sur Grand Écran (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)** :
   - Sur grand écran (Desktop / Web), afficher **systématiquement 3 formations par ligne** (`lg:grid-cols-3`), identique aux rubriques Vocabulaire et Écoute & Lecture, pour offrir un repérage visuel homogène et harmonieux.
   - Sur mobile, conserver l'affichage responsive fluide sur une seule colonne.
3. **Espace Interactif de Commentaires Épuré sous Chaque Leçon** :
   - Sous chaque leçon vidéo dans le lecteur immersif de formation, afficher un espace commentaire **100% épuré sans en-tête ni titres superflus** :
     - Avatar de l'apprenant à gauche.
     - Champ de saisie avec le placeholder direct **`Commentaire...`** (sans phrases longues, police minimale 16px sur mobile).
     - Bouton d'action standardisé et court : **`Publier`** (avec icône `Send`).
     - Fil de commentaires avec nom d'utilisateur, horodatage, bouton « J'aime », fil de réponses imbriquées et badge distinctif **`Formateur`** violet pour les réponses d'**Espoir Chinois**.

## Règle de Distinction des 3 Rôles et Appellations d'« Espoir Chinois »
Pour assurer une cohérence parfaite et ne jamais mélanger les casquettes dans toute l'application :

1. **Rôle 1 — Fondateur de ChinoisLingo (Notifications & Communications Officielles)** :
   - Utilisé pour toutes les **notifications de l'application**, messages d'annonces, e-mails et communications de la plateforme adressés aux utilisateurs.
   - Intitulé / Signature obligatoire : **« Espoir Chinois, Fondateur de ChinoisLingo »** (ou *« Espoir Chinois — Fondateur »*).

2. **Rôle 2 — Formateur (Rubrique Formations & Cours)** :
   - Utilisé exclusivement dans la rubrique **Formations**, fiches de cours et modules vidéo d'apprentissage.
   - Intitulé obligatoire : **« Formateur : Espoir Chinois »** (ou *« Formateur Espoir Chinois »*).

3. **Rôle 3 — Personnage & Intervenant Contextuel (Dialogues, Histoires & Écoute/Lecture)** :
   - Espoir Chinois ou d'autres apprenants (Katia, Brice, etc.) interviennent naturellement comme personnages au sein des mises en situation immersives.
   - **Nommage contextuel précis** : Adapter toujours le nom et le statut du personnage au scénario réel du dialogue (généralement l'apprenant francophone échangeant avec un interlocuteur chinois) :
     - *Scénario d'achat / commerce* : **Katia (Acheteuse)** ⟷ **Commerçant / Vendeur (chinois)**.
     - *Scénario business / négociation* : **Espoir Chinois (Partenaire)** ⟷ **Directeur d'usine (chinois)**.
     - *Scénario restaurant* : **Brice (Client)** ⟷ **Serveur (chinois)**.
     - *Scénario transport / déplacement* : **Espoir Chinois (Passager)** ⟷ **Chauffeur / Conducteur (chinois)**.
   - Bannir toute casquette institutionnelle (fondateur/formateur) à l'intérieur d'un dialogue de mise en situation.

## Règle de Présentation des Personnages dans les Dialogues & Écoute/Lecture
Pour maximiser l'immersion et la clarté pédagogique de chaque dialogue interactif :

1. **Emplacement Obligatoire de la Section « Les Personnages »** :
   - Dans le lecteur immersif de dialogue, la section **« Les Personnages du Dialogue »** doit TOUJOURS être positionnée **exactement entre le bloc d'en-tête (Titre, Pinyin, Badge HSK, Objectif & Durée)** et le **début de la transcription des répliques**.
   - Cela permet à l'apprenant de comprendre immédiatement qui parle, quel est le statut de chaque intervenant et quel est le cadre de l'échange avant de lire ou d'écouter les répliques.

2. **Structure des Fiches Personnages en En-tête** :
   - Chaque intervenant du dialogue dispose de sa carte dédiée présentant :
     - **Nom du personnage** (ex: `Espoir Chinois`, `王总 (Wáng zǒng)`, `Katia`, `摊主 (Tānzhǔ)`, `Brice`, `服务员 (Fúwùyuán)`).
     - **Badge de Rôle contextuel** (ex: `Partenaire commercial`, `Directeur d’Usine`, `Acheteuse`, `Commerçant`, `Client`, `Serveur`, `Passager`, `Conducteur`).
     - **Description contextuelle concise (1 à 2 lignes)** expliquant précisément ce qu'il fait dans la scène (qui il est, pourquoi il est là, quel est son but dans la conversation).
     - **Code couleur coordonné** (`violet` pour le premier intervenant / apprenant, `turquoise` pour le second intervenant / interlocuteur chinois).

3. **Règle Stricte d'Anti-Redondance dans les Bulles de Répliques** :
   - **Interdiction formelle des doublons de traduction dans les bulles** : Ne JAMAIS écrire le nom suivi de sa traduction française entre parenthèses ET un badge de rôle qui répète la même information (ex: banni ➔ `服务员 (Le Serveur)` + badge `Serveur` ; banni ➔ `摊主 (Le Vendeur)` + badge `Commerçant`).
   - **Format attendu** :
     - Le champ **Nom de l'intervenant** (`speaker`) affiche uniquement le nom propre ou l'intitulé chinois net : `服务员`, `王总`, `摊主`, `师傅`, `Espoir Chinois`, `Katia`, `Brice`.
     - Le badge **Rôle** (`speakerRole`) affiche la fonction : `Serveur`, `Directeur d’Usine`, `Commerçant`, `Conducteur`, `Partenaire`, `Acheteuse`, `Client`.

## Règle de Rédaction & d'Attribution des Articles et Histoires
1. **Rubrique Articles (`articles`) — Épuration & Règle d'Attribution** :
   - **Règle générale** : Pour tous les articles de culture, de vocabulaire ou de société (ex: *Les Clés des Affaires en Chine*, *La Culture du Thé en Chine*, *L'Importance des Nombres en Chine*), **ne JAMAIS afficher de nom de rédacteur / d'auteur** ni de badge de personnage artificiel. Les articles sont du contenu de lecture pur (Titre, Pinyin, Description, Texte immersif fluide).
   - **Exception Unique et Stricte** : La série d'articles exclusive **« Apprendre le Chinois avec Confiance »** rédigée personnellement par Espoir Chinois porte la mention d'auteur nette : **« Espoir Chinois »** (sans ajouter "Mentor" ou autre titre devant).

2. **Rubrique Histoires (`histoires`) — Présentation des Personnages** :
   - Dès qu'une histoire met en scène des personnages (ex: *Une Journée à Pékin*, *La Première Visite d'Usine*), insérer obligatoirement en en-tête la section **« Les Personnages de l’Histoire »** (exactement comme pour les dialogues).
   - Chaque personnage dispose de sa carte avec Nom, Rôle contextuel et description concise (1 à 2 lignes) de son rôle dans l'intrigue.

## Règle du Mot du Jour Dynamique & Quotidien (Rotation Automatique Toutes les 24h)
- Le **Mot du Jour** sur le Tableau de Bord n'est JAMAIS statique : il tourne **automatiquement chaque jour à minuit (toutes les 24 heures)**.
- Il est calculé de manière déterministe (`getDailyWord`) à partir de la date civile et d'un catalogue riche couvrant des **thématiques variées et vivantes** :
  - *Commerce & Usines* (prix, négociation, commandes, devis, MOQ).
  - *Culture & Réseau / Guanxi* (relations humaines, politesse, confiance, invitations).
  - *Motivation & Réussite* (persévérance, objectifs, apprentissage continu).
  - *Vie courante & Quotidien* (salutations, déplacements, repas, achats).
  - *Travail & Productivité* (efficacité, logistique, réunions, contrats, innovation).
- Chaque mot du jour possède obligatoirement :
  1. Son caractère **Hanzi** lisible et son **Pinyin** complet avec tons.
  2. Sa **traduction française** exacte et son badge de **catégorie thématique**.
  3. Son **contexte d'apprentissage / business** (explication concrète d'usage en Chine).
  4. Ses **3 exemples de phrases obligatoires et progressifs** :
     - **Exemple 1 (Simple / Débutant)** : Structure courte Sujet + Verbe + Complément pour mémorisation immédiate.
     - **Exemple 2 (Moyen / Intermédiaire)** : Phrase de terrain du quotidien ou de discussion commerciale.
     - **Exemple 3 (Avancé)** : Formulation complexe, professionnelle ou idiomatique de haut niveau.
     - Chaque exemple dispose de son triptyque complet (Hanzi, Pinyin, Français), de sa note d'usage et de sa synthèse vocale audio (`Volume2`).
  5. Le bouton de sauvegarde directe dans **Mes Mots** (`Bookmark` / `Check`).


