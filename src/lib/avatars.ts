/**
 * Avatars proposés au choix dans « Modifier mon profil ».
 *
 * La galerie contenait auparavant la photo personnelle du fondateur et sept
 * portraits de personnes réelles issus d'une banque d'images. Deux problèmes :
 * la photo d'une personne lui appartient et ne doit pas devenir l'avatar de
 * n'importe qui, et proposer des visages d'inconnus comme identité de compte
 * est inconfortable.
 *
 * Ces illustrations sont des SVG encodés en `data:` — aucun appel réseau,
 * aucune dépendance à un service tiers, et elles s'affichent instantanément
 * même hors ligne. Les couleurs viennent de la charte ChinoisLingo.
 */

interface Motif {
  nom: string;
  fond: string;
  trait: string;
  /** Formes SVG dessinées par-dessus le fond, dans un carré de 96×96. */
  formes: string;
}

const MOTIFS: Motif[] = [
  {
    nom: 'Bulle',
    fond: '#6200EE',
    trait: '#03DAC5',
    formes:
      '<circle cx="48" cy="44" r="22" fill="none" stroke="#03DAC5" stroke-width="6"/>' +
      '<path d="M40 62 L44 76 L54 64" fill="none" stroke="#03DAC5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    nom: 'Vague',
    fond: '#03DAC5',
    trait: '#00695C',
    formes:
      '<path d="M18 56 Q33 38 48 56 T78 56" fill="none" stroke="#00695C" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="48" cy="32" r="7" fill="#00695C"/>',
  },
  {
    nom: 'Montagne',
    fond: '#3F51B5',
    trait: '#C5CAE9',
    formes:
      '<path d="M20 68 L40 38 L54 56 L66 42 L78 68 Z" fill="#C5CAE9"/>' +
      '<circle cx="66" cy="28" r="7" fill="#C5CAE9" opacity="0.75"/>',
  },
  {
    nom: 'Lanterne',
    fond: '#D81B60',
    trait: '#FFD180',
    formes:
      '<rect x="34" y="30" width="28" height="34" rx="14" fill="#FFD180"/>' +
      '<path d="M48 22 V30 M48 64 V74" stroke="#FFD180" stroke-width="5" stroke-linecap="round"/>',
  },
  {
    nom: 'Bambou',
    fond: '#1B5E20',
    trait: '#A5D6A7',
    formes:
      '<rect x="43" y="20" width="11" height="56" rx="5" fill="#A5D6A7"/>' +
      '<path d="M43 38 H54 M43 52 H54" stroke="#1B5E20" stroke-width="4"/>' +
      '<path d="M54 32 Q70 28 72 40" fill="none" stroke="#A5D6A7" stroke-width="5" stroke-linecap="round"/>',
  },
  {
    nom: 'Soleil',
    fond: '#FFC107',
    trait: '#B78103',
    formes:
      '<circle cx="48" cy="48" r="15" fill="#B78103"/>' +
      '<path d="M48 18 V26 M48 70 V78 M18 48 H26 M70 48 H78 M27 27 L33 33 M63 63 L69 69 M69 27 L63 33 M33 63 L27 69" stroke="#B78103" stroke-width="5" stroke-linecap="round"/>',
  },
  {
    nom: 'Pinceau',
    fond: '#8E24AA',
    trait: '#E1BEE7',
    formes:
      '<path d="M34 70 Q40 40 62 26" fill="none" stroke="#E1BEE7" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="34" cy="70" r="7" fill="#E1BEE7"/>',
  },
  {
    nom: 'Origami',
    fond: '#0288D1',
    trait: '#B3E5FC',
    formes:
      '<path d="M24 54 L48 24 L72 54 L48 46 Z" fill="#B3E5FC"/>' +
      '<path d="M48 46 L48 74 L30 60 Z" fill="#B3E5FC" opacity="0.7"/>',
  },
];

function versDataUri(m: Motif): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">` +
    `<rect width="96" height="96" fill="${m.fond}"/>` +
    m.formes +
    `</svg>`;
  // encodeURIComponent plutôt que base64 : la chaîne reste lisible dans les
  // outils de développement et le fichier reste diffable.
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export interface AvatarProposé {
  nom: string;
  url: string;
}

/** Les huit avatars proposés dans la galerie. */
export const AVATARS_PROPOSES: AvatarProposé[] = MOTIFS.map((m) => ({
  nom: m.nom,
  url: versDataUri(m),
}));

/** Initiales d'un nom, pour l'affichage à défaut de photo. */
export function initialesDe(nom: string | null | undefined): string {
  return (
    (nom ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((m) => m[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}
