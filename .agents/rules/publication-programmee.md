# Règle Permanente : Publication Programmée & Échelonnement Automatique (12h00 GMT)

## 🚨 Règle d'Or Absolue
Pour **TOUT contenu textuel ou audio-visuel ajouté sur ChinoisLingo** (dialogues, histoires, articles, vidéos, podcasts, chansons) :

### 1. ⚙️ Déblocage 100% Automatique (Zéro Action Manuelle)
- Chaque ressource peut comporter le champ `date_publication?: string;` (format `"AAAA-MM-JJ"`).
- **Rétrocompatibilité totale** : Tout contenu existant ou sans `date_publication` reste immédiatement visible et accessible sans aucune date rétroactive.
- **Horaire Officiel de Déblocage : 12h00 GMT / UTC** :
  - Pour une date `"2026-10-02"`, l'heure exacte de libération est `2026-10-02T12:00:00Z` (midi GMT).
  - Avant 12h00 GMT le jour J : le contenu est invisible pour les apprenants.
  - Dès 12h00 GMT le jour J : le contenu s'affiche automatiquement dans le catalogue, la recherche et les parcours d'apprentissage, sans aucun clic ni intervention de l'administrateur.

### 2. 📅 Règle de Rythme par Défaut (1 contenu / jour)
- Lors de la soumission d'un lot de contenus (plus de 2 contenus le même jour) :
  - **Échelonner automatiquement 1 contenu par jour** sur les jours suivants à partir du premier créneau disponible à 12h00 GMT.
- **Exception** : Si **Espoir Chinois** donne une consigne explicite pour publier 2 ou plusieurs contenus à une date précise, appliquer rigoureusement son instruction.

### 3. 🖥️ Prévisualisation Locale Avant Production
- Toujours permettre la consultation et la prévisualisation immédiate en environnement local ou via paramètre d'aperçu administrateur avant toute mise en ligne définitive.

### 4. ✉️ Compatibilité Email Hebdomadaire
- Le récapitulatif hebdomadaire détecte automatiquement tous les contenus dont la `date_publication` est devenue active (débloquée à 12h00 GMT) au cours des 7 derniers jours.
