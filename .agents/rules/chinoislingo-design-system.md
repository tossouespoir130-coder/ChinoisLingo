# ChinoisLingo Design System & UI Architecture Rule

Cette règle définit le **Design System officiel**, les **tokens de style**, les **normes d'animation** et l'**architecture de composants** de l'application **ChinoisLingo**.
Toute nouvelle page, composant ou fonctionnalité développée sur ChinoisLingo DOIT se conformer strictement à ces règles pour garantir une cohérence visuelle et une expérience utilisateur de premier ordre.

---

## 1. Identité de Marque & Palette de Couleurs

### 🏷️ Slogan Officiel de la Marque
- **Slogan Principal** : **« Le chinois devient facile »**
- **Formule Développée** : **« Avec ChinoisLingo, le chinois devient facile »**

### 🎨 Couleurs Principales (Brand)
- **Primaire (Violet)** : `#6200EE` (Variante hover/active : `#3700B3`, Dark mode accent : `#BB86FC`)
- **Secondaire (Turquoise)** : `#03DAC5` (Dark mode / texte contrasté : `#00897B`)

### 🏷️ Couleurs Thématiques par Rubrique
Chaque module et rubrique de l'application possède sa couleur d'accentuation dédiée à réutiliser sur ses badges, icônes, bordures au survol et jauges :
- 🎓 **Formations** : `#6200EE` (Violet)
- 🎧 **Écoute & Lecture / Podcasts** : `#03DAC5` (Turquoise)
- ✨ **Vocabulaire & SRS** : `#E91E63` / `#FFC107` (Rose `#E91E63` avec transition hover violet `#6200EE`)
- 📚 **Livres & Programmes / Catalogue** : `#E91E63` / `#DD2C00` (Rose / Rouge feu)
- 💡 **Guides Pédagogiques & Méthodes** : `#FFC107` / `#B78103` (Ambre)

### 🏅 Charte Officielle des Niveaux HSK (HSK 1 à HSK 6)
Chaque niveau HSK arbore une couleur fixe et universelle sur tous les badges, fiches et cartes :
- **HSK 1** : `#00BFA5` / `#00897B` (Turquoise / Vert Émeraude)
- **HSK 2** : `#0288D1` (Bleu Azur Océan)
- **HSK 3** : `#6200EE` (Violet ChinoisLingo)
- **HSK 4** : `#3F51B5` (Indigo / Bleu Roi)
- **HSK 5** : `#8E24AA` (Pourpre / Violet Profond)
- **HSK 6** : `#D81B60` / `#D32F2F` (Rubis Impérial / Magenta)

### ⚪ Neutres (Mode Clair & Mode Sombre)
- **Fond de page** : `#FAFAFA` (Mode Clair) / `#121212` (Mode Sombre)
- **Fond des cartes (`nixtio-card`)** : `#FFFFFF` (Clair) / `#1E1E1E` (Sombre)
- **Fond des sous-éléments/badges** : `#FAFAFA` (Clair) / `#181818` ou `#252525` (Sombre)
- **Bordures standard** : `#E0E0E0` (Clair) / `#2D2D2D` ou `#333333` (Sombre)
- **Texte Principal** : `#212121` (Clair) / `#F5F5F5` (Sombre)
- **Texte Secondaire / Sous-titres** : `#757575` (Clair) / `#A0A0A0` (Sombre)

---

## 2. Structure Visuelle des Cartes (`nixtio-card`)

Toutes les cartes interactives doivent utiliser la classe de base `nixtio-card` et adopter le gabarit suivant :
```html
<div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl shadow-xs hover:border-[#6200EE]/40 transition-all flex flex-col justify-between group">
  <!-- En-tête de carte -->
  <div className="flex items-center justify-between gap-2">
    <div className="w-10 h-10 rounded-2xl bg-[Couleur]/10 text-[Couleur] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[Couleur]/10 text-[Couleur] border border-[Couleur]/20">
      Badge Rubrique
    </span>
  </div>
  ...
</div>
```

---

## 3. Système d'Animations & Micro-Interactions (< 400ms)

### 🔘 1. Effet de Compression au Clic (`btn-press`)
Tous les boutons, onglets, sélecteurs et cartes cliquables doivent comporter la classe `.btn-press` :
```css
.btn-press {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-press:active {
  transform: scale(0.96);
}
```

### 🔥 2. Flamme de Série Active (`flame-burn-vivid`)
L'icône de flamme de la série quotidienne (🔥) utilise l'animation vivante et vibrante :
```css
@keyframes flameBurnVivid {
  0%, 100% { transform: scale(1) rotate(-1deg); filter: drop-shadow(0 0 4px rgba(255, 87, 34, 0.5)); }
  25% { transform: scale(1.1) rotate(2deg); filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.8)); }
  50% { transform: scale(0.96) rotate(-2deg); filter: drop-shadow(0 0 5px rgba(255, 87, 34, 0.6)); }
  75% { transform: scale(1.08) rotate(1deg); filter: drop-shadow(0 0 9px rgba(255, 61, 0, 0.9)); }
}
```

### 📊 3. Bandes de Progression Universelles (Jauges)
Toutes les bandes de progression s'animent progressivement de 0% à leur valeur cible avec la courbe douce sur ~3.2s :
```tsx
<div className="w-full h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
  <div
    className="h-full rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5]"
    style={{
      width: animated ? `${progressPct}%` : '0%',
      transition: 'width 3.2s cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  />
</div>
```

### 🔢 4. Compteurs Numériques (`AnimatedCounter`)
Les chiffres de métriques (série, mots maîtrisés, pourcentages) utilisent le composant réutilisable `<AnimatedCounter targetValue={value} />` avec easing cubic-out.

### 👁️ 5. Déclenchement au Défilement (`IntersectionObserver`)
Les sections inférieures (ex: Progression de l'Élève, Score des Pairs) s'animent **uniquement lorsque l'utilisateur les fait défiler à l'écran**, évitant d'animer des éléments invisibles.

### ♿ 6. Accessibilité Mouvement (`prefers-reduced-motion`)
Toutes les animations doivent être désactivées ou réduites si l'utilisateur a activé la préférence système correspondante.

---

## 4. Architecture des Fenêtres & Modals (`<Portal>`)

Tous les modals (Guides, À Propos, Ajout de mot, SRS) doivent obligatoirement :
1. Être encapsulés dans le composant `<Portal>` (`src/components/ui/Portal.tsx`) pour être rattachés au `document.body` :
   - Évite les interférences de coordonnées `transform` / `translate` sur les conteneurs parents.
   - Garantit un **centrage optique automatique au milieu exact du viewport visible** quel que soit le défilement.
2. Utiliser un backdrop semi-transparent flouté :
   `fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn`
3. Stopper la propagation du clic sur la carte interne (`e.stopPropagation()`) pour que seul le clic sur le fond ferme la fenêtre.

---

## 5. Hiérarchie Typographique & En-têtes

- **Titre H1 de Page** : `font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight`
- **Badge de Rubrique (Pill)** : `text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`
- **Sous-titre explicatif** : `text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium`
- **Caractères Chinois (Hanzi)** : `font-hanzi font-black text-2xl sm:text-3xl`
- **Phonétique Pinyin** : `font-pinyin font-bold text-sm sm:text-base`

---

## 6. Structure de Navigation Supérieure & Inférieure

1. **Barre de Navigation Supérieure (`TopNav`)** :
   - Logo **华 ChinoisLingo**
   - Onglets principaux : `Accueil`, `Vocabulaire`, `Écoute & Lecture`, `Formations`, `Livres & Programmes`.
   - Série de jours avec flamme ardente 🔥, loupe de recherche, notification et avatar utilisateur.
2. **Hub d'Accès Rapide Inférieur (Pied de Page / Accueil)** :
   - 👤 `Mon Compte` (`/mon-compte`)
   - 💳 `Abonnement` (`/abonnement`)
   - ⚙️ `Préférences` (`/parametres`)
   - ℹ️ `À Propos` (`ChinoisLingo`)
