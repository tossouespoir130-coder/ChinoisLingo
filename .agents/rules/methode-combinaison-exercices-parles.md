# Règle Permanente : Méthode de la Combinaison dans les « Exercices parlés »

Ce document définit les règles d'or et les standards pédagogiques stricts applicables à la sous-catégorie **« Exercices parlés »** de la rubrique Écoute & Lecture. À relire obligatoirement avant toute création ou modification d'un modèle.

---

## 1. 🧩 Structure d'un Modèle & Moteur Commun
- **Un modèle = une phrase typique**, composée de cases fixes et de cases mobiles selon les principes stricts de la **Méthode de la Combinaison** (qui utilise le même moteur partagé que la rubrique Vocabulaire, sans divergence de logique).
- **Règle d'or absolue** : On change **UNE SEULE case à la fois**. Toutes les autres cases conservent rigoureusement leur valeur de base.
- **Progression par case mobile & modularité stricte** : La structure de l'étape **4. Combine** varie rigoureusement et fidèlement en fonction de la structure réelle de la phrase modèle :
  - Chaque case mobile correspond à une sous-étape dédiée.
  - Les libellés des cases et des étapes utilisent la **nature grammaticale des mots** (ex: **`Nom`** et non « Objet », **`Démonstratif`**, **`Sujet`**, **`Verbe`**).
  - Exemple Épisode 1 (`你想做什么？`, 2 composants mobiles dont le sujet scindé) : *1. Pronoms*, *2. Noms propres*, *3. Noms communs*, *4. Verbes*, puis *Tout mélanger*.
  - Exemple Épisode 2 (`请问，这个杯子多少钱？`, 2 composants mobiles) : *1. Démonstratifs*, *2. Noms*, puis *Tout mélanger*.
  - Interdiction de forcer artificiellement un découpage arbitraire en 4 étapes si la phrase ne comporte que 2 composants mobiles.
- **Format de chaque sous-étape** :
  - **3 exemples mis en avant** sous forme de cartes complètes : Hanzi, Pinyin, Français.
  - **« Autres possibilités »** affiché en permanence (ouvert directement, jamais replié ni masqué sous un accordéon ou une flèche). Titre contextualisé sans compteur entre parenthèses : *« Autres possibilités avec les démonstratifs »*, *« Autres possibilités avec les noms »*...
  - L'apprenant compose lui-même ses phrases en touchant un mot : on ne détaille pas passivement toutes les combinaisons.
  - Chaque sous-étape se conclut par l'invitation à la pratique : *« À toi : forme une phrase et dis-la à voix haute »*.
- **Sous-étape finale (« Tout mélanger »)** :
  - Permet de faire varier toutes les cases mobiles ensemble, avec tirage au sort (`Shuffle`) et affichage du compteur global dynamique certifié.

---

## 2. 🛡️ Données, Listes Fermées & Perfection Linguistique
- **Listes fermées et validées** : Toutes les options sont issues de listes fermées validées par **Espoir Chinois**. Une combinaison qui n'a pas de sens naturel ne doit jamais apparaître ni être comptabilisée.
- **Traductions françaises explicites** :
  - Tous les accords, formes verbales et élisions (*qu'il*, *qu'elle*, *qu'Anthony*, *d'acheter*, *d'écouter*, *d'écrire*, *d'étudier*...) sont définis expressément dans les données pour chaque mot, **jamais calculés ou devinés automatiquement**.
  - **Zéro caractère chinois dans les textes ou libellés français** : Chaque nom propre chinois possède impérativement son équivalent français officiel dans la traduction (ex: `安东尼` ➔ `Anthony`, `卡蒂娅` ➔ `Katia`, `丽丽` ➔ `Lily`, `小王` ➔ `Xiao Wang`, `老王` ➔ `Lao Wang`, `布里斯` ➔ `Brice`).
- **Règle Permanente du Pinyin dans les Textes d’Explication** :
  - Dans tout texte d'explication pédagogique, consigne ou remarque culturelle, chaque caractère ou groupe de caractères chinois est obligatoirement accompagné de son pinyin avec les tons, directement à côté entre parenthèses. Exemples : `想 (xiǎng)`, `们 (men)`, `小 (xiǎo)`, `你想做什么 (nǐ xiǎng zuò shénme)`.
  - Cela vaut pour un seul caractère comme pour une phrase entière, à chaque apparition.
  - Seule exception : un tableau, un sélecteur ou une carte qui possède déjà une ligne ou colonne dédiée au pinyin.
  - Les phrases françaises ne contiennent jamais de caractère chinois : seuls les textes d'explication en contiennent, toujours avec leur pinyin.
  - Pinyin avec les marques de ton diacritiques (`nǐ`, jamais `ni3`). En cas de doute sur une lecture (polyphone), demander arbitrage au lieu de trancher seul.
- **Niveau HSK & 生词** :
  - Le vocabulaire général d'un modèle relève du niveau HSK concerné.
  - Tout terme utile dépassant le niveau officiel fait l'objet d'un encart dédié **生词 (Mots à retenir)** en fin de modèle, avec Pinyin et traduction française soignée.

---

## 3. 🎯 Pédagogie, Tonalité & Séparation Question / Réponse
- **Tonalité bienveillante et concrète** : Comparaisons permanentes avec les spécificités du français, rubriques courtes *« Le sais-tu ? »* et astuces phonétiques, sans aucun jargon linguistique abstrait.
- **Règle des 2 Épisodes Séparés (Question vs Réponse) & Clôture de Leçon** :
  - Une question et sa réponse forment obligatoirement **DEUX épisodes distincts**.
  - **Bannissement de toute carte « Prochain épisode » ou boîte de « Mini-défi » en fin de modèle** : la fin de l'épisode se concentre exclusivement sur les **Mots à retenir (生词)** et le bouton universel **`✓ Terminé`**.
  - L'épisode 2 (la réponse) est un contenu autonome et distinct traité et publié séparément plus tard.

---

## 4. 🎙️ Règles Audio & Synthèse Vocale ElevenLabs
- **Règles ElevenLabs du projet** : Modèle `eleven_v3`, un seul appel par phrase, micro-fades doux (50 ms), zéro coupure brutale, timestamps exacts.
- **Politique stricte de génération** :
  - Audio généré **uniquement pour la phrase typique** et les **exemples mis en avant** expressément validés.
  - Zéro audio généré pour les centaines d'autres combinaisons : le bouton d'écoute est masqué en production.
  - La synthèse vocale du navigateur (`SpeechSynthesis`) est réservée exclusivement aux tests locaux (`isTest: true`).
  - **Aucune génération ElevenLabs sans l'accord préalable d'Espoir Chinois.**

---

## 5. 🚀 Processus de Validation & Environnement Local
1. **Validation du texte français** par Espoir Chinois en amont.
2. **Contrôle et validation de la version chinoise** de la voix.
3. **Développement 100% en local**.
4. **Validation interactive des rendus** sur les 3 écrans et toutes les sous-étapes.
5. **Interdiction formelle de tout commit ou git push** sans validation explicite préalable d'Espoir Chinois.
